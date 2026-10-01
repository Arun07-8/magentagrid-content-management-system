import test from 'node:test';
import assert from 'node:assert/strict';
import { authService } from '../modules/auth/auth.service.js';
import { loginSchema } from '../modules/auth/auth.validation.js';

test('Auth Service & Validation Tests', async (t) => {
  await t.test('loginSchema validates email and password constraints', () => {
    // Valid input
    const valid = loginSchema.safeParse({
      email: 'admin@example.com',
      password: 'password123',
    });
    assert.equal(valid.success, true);

    // Invalid email
    const invalidEmail = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    assert.equal(invalidEmail.success, false);

    // Short password (< 6 chars)
    const shortPassword = loginSchema.safeParse({
      email: 'admin@example.com',
      password: '123',
    });
    assert.equal(shortPassword.success, false);
  });

  await t.test('Admin login succeeds with correct credentials', async () => {
    const result = await authService.login('admin@example.com', 'password123');
    assert.ok(result.token, 'Token should be returned');
    assert.equal(result.user.email, 'admin@example.com');
    assert.equal(result.user.role, 'admin');
  });

  await t.test('Editor login succeeds with correct role', async () => {
    const result = await authService.login('editor@example.com', 'password123');
    assert.ok(result.token, 'Token should be returned');
    assert.equal(result.user.email, 'editor@example.com');
    assert.equal(result.user.role, 'editor');
  });

  await t.test('Login fails with invalid password', async () => {
    await assert.rejects(
      async () => {
        await authService.login('admin@example.com', 'wrongpassword');
      },
      {
        message: 'Invalid email or password',
      }
    );
  });
});
