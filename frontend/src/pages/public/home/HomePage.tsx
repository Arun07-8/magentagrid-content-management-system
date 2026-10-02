import { ArrowRight, Calendar, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../../widgets';
import { usePublicPosts } from '../../../entities/post';
import { Spinner, Button, Badge } from '../../../shared/ui';
import { formatDate } from '../../../shared/lib';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: posts = [], isLoading } = usePublicPosts();

  const latestArticles = posts.slice(0, 3);

  const platformHighlights = [
    { icon: BookOpen, title: 'Curated Editorial', desc: 'Carefully reviewed long-form ideas' },
    { icon: Layers, title: 'Clean Architecture', desc: 'Modern publishing infrastructure' },
    { icon: Sparkles, title: 'Distraction Free', desc: 'Focused on calm reading and writing' },
    { icon: ShieldCheck, title: 'Verified Authors', desc: 'Insights from industry practitioners' },
  ];

  return (
    <PublicLayout>
      {/* Editorial Hero Section */}
      <section className="bg-slate-50/70 border-b border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-medium mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <span>Independent Publishing Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
              Stories, ideas, and perspectives for modern thinkers.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              A thoughtfully designed publication platform delivering in-depth articles on technology,
              design, engineering, and digital craft.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate('/blog')}
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore All Articles
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/about')}
              >
                About Our Platform
              </Button>
            </div>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14 pt-10 border-t border-slate-200/80">
            {platformHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16 sm:py-20 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Recent Dispatches
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Latest Articles
              </h2>
            </div>

            <button
              onClick={() => navigate('/blog')}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {isLoading ? (
            <Spinner fullHeight text="Loading latest articles..." />
          ) : latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestArticles.map((article) => {
                const articleId = article._id || article.id;
                const formattedDate = formatDate(article.createdAt) || 'Recent';

                return (
                  <article
                    key={articleId}
                    onClick={() => navigate(`/blog/${articleId}`)}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-150 flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={
                          article.imageUrl ||
                          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt={article.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
                        }}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="neutral">
                          {article.category || 'Technology'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-400 mb-2.5">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formattedDate}</span>
                          </div>
                          {article.readTime && (
                            <>
                              <span>•</span>
                              <span>{article.readTime}</span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 mb-2 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                          {article.description || article.content}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                        <span>Read article</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14 bg-slate-50/70 rounded-xl border border-slate-200/80">
              <p className="text-slate-500 text-sm">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Editorial Subscription / Platform Note */}
      <section className="py-14 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-slate-800 shadow-sm">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Stay Informed
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Get thoughtful writing directly to your inbox.
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Join readers who follow our long-form essays, tech deep dives, and product notes.
                No spam, ever.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 w-full sm:w-64"
              />
              <Button
                variant="secondary"
                size="md"
                onClick={() => alert('Thank you for subscribing!')}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
