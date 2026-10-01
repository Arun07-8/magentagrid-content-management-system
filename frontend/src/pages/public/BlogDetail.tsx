import { useState } from 'react'
import { Calendar, Link2, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { PostView } from '../../entities/post/ui/PostView'
import { usePublicPost, usePublicPosts } from '../../entities/post/hooks/usePosts'

export default function BlogDetail() {
  const navigate = useNavigate()
  const { id: paramId, slug } = useParams<{ id?: string; slug?: string }>()

  const { data: allPosts = [] } = usePublicPosts()
  const effectiveId = paramId || slug || (allPosts.length > 0 ? (allPosts[0]._id || allPosts[0].id) : undefined)

  const { data: post, isLoading, isError, error } = usePublicPost(effectiveId)
  const [copied, setCopied] = useState(false)

  // 4 related published posts
  const relatedPosts = allPosts
    .filter((a) => (a._id || a.id) !== effectiveId)
    .slice(0, 4)

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog link */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Main Article */}
            <div className="lg:col-span-8">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm">Loading article...</p>
                </div>
              ) : isError || !post ? (
                <div className="py-20 text-center text-red-500 space-y-3">
                  <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
                  <h2 className="text-lg font-bold text-slate-900">Article not found</h2>
                  <p className="text-xs text-slate-500">
                    {(error as any)?.message || 'This article may not be published or has been removed.'}
                  </p>
                  <button
                    onClick={() => navigate('/blog')}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                  >
                    <span>Browse All Articles</span>
                  </button>
                </div>
              ) : (
                <PostView
                  title={post.title}
                  description={post.description}
                  content={post.content}
                  imageUrl={post.imageUrl}
                  category={post.category}
                  date={formattedDate}
                  readTime={post.readTime}
                  authorName={post.author?.name}
                />
              )}
            </div>

            {/* Right Column: Related Articles Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
                  Related Articles
                </h3>

                {relatedPosts.length === 0 ? (
                  <p className="text-xs text-slate-400">No related articles yet.</p>
                ) : (
                  <div className="space-y-4">
                    {relatedPosts.map((related) => {
                      const relId = related._id || related.id!
                      const relDate = new Date(related.createdAt || related.updatedAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )

                      return (
                        <div
                          key={relId}
                          onClick={() => navigate(`/blog/${relId}`)}
                          className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                            <img
                              src={
                                related.imageUrl ||
                                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80'
                              }
                              alt={related.title}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80'
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-blue-600 block mb-0.5">
                              {related.category || 'Technology'}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {related.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{relDate}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
