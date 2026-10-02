import test from 'node:test';
import assert from 'node:assert/strict';
import { postService } from '../modules/posts/post.service.js';
import { createPostSchema } from '../modules/posts/post.validation.js';

test('Post Module & Role-Based Permissions Tests', async (t) => {
  await t.test('createPostSchema validates required fields', () => {
    // Missing title
    const invalidTitle = createPostSchema.safeParse({
      title: '',
      description: 'Test description',
      content: 'Test content',
    });
    assert.equal(invalidTitle.success, false);

    // Missing description
    const invalidDesc = createPostSchema.safeParse({
      title: 'Valid title',
      description: '',
      content: 'Test content',
    });
    assert.equal(invalidDesc.success, false);

    // Missing content
    const invalidContent = createPostSchema.safeParse({
      title: 'Valid title',
      description: 'Valid description',
      content: '',
    });
    assert.equal(invalidContent.success, false);

    // Valid post
    const valid = createPostSchema.safeParse({
      title: 'A Great Blog Post',
      description: 'A short summary of the post',
      content: 'Detailed body content paragraph.',
      status: 'Draft',
    });
    assert.equal(valid.success, true);
  });

  await t.test('Editor role is blocked from publishing post directly', async () => {
    await assert.rejects(
      async () => {
        await postService.createPost(
          {
            title: 'Editor Attempt',
            description: 'Trying to publish directly as editor',
            content: 'Content here',
            status: 'Published',
          },
          { id: '662b2e8a1d5a8b001f3e1a02', name: 'Editor User' },
          'editor' // role
        );
      },
      (err: any) => {
        return err.statusCode === 403 || err.message.includes('permission');
      }
    );
  });

  await t.test('Admin role can create, publish, unpublish, and delete posts', async () => {
    // 1. Create Draft
    const post = await postService.createPost(
      {
        title: 'Admin Created Post',
        description: 'Testing lifecycle',
        content: 'Lifecycle body content',
        status: 'Draft',
      },
      { id: '662b2e8a1d5a8b001f3e1a01', name: 'Admin User' },
      'admin'
    );
    assert.ok(post._id || post.id);
    assert.equal(post.status, 'Draft');

    const postId = (post._id || post.id).toString();

    // 2. Draft should NOT appear in public website posts
    const publicPostsBefore = await postService.getPublicPosts();
    const foundInPublicBefore = publicPostsBefore.some(
      (p) => (p._id || p.id).toString() === postId
    );
    assert.equal(foundInPublicBefore, false, 'Draft should not appear in public posts');

    // 3. Admin publishes post
    const publishedPost = await postService.publishPost(postId);
    assert.equal(publishedPost.status, 'Published');

    // 4. Now it SHOULD appear in public posts
    const publicPostsAfter = await postService.getPublicPosts();
    const foundInPublicAfter = publicPostsAfter.some(
      (p) => (p._id || p.id).toString() === postId
    );
    assert.equal(foundInPublicAfter, true, 'Published post must appear in public posts');

    // 5. Admin unpublishes post
    const unpublishedPost = await postService.unpublishPost(postId);
    assert.equal(unpublishedPost.status, 'Draft');

    // 6. Admin deletes post
    await postService.deletePost(postId);
    await assert.rejects(
      async () => {
        await postService.getPostById(postId);
      },
      (err: any) => err.statusCode === 404 || err.message.includes('not found')
    );
  });
});
