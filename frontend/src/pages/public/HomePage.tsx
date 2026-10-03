
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../widgets';
import { usePublicPosts } from '../../entities/post';
import { Spinner } from '../../shared/ui';
import { formatDate } from '../../shared/lib';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: posts = [], isLoading } = usePublicPosts();

  const displayPosts = posts.slice(0, 12);

  return (
    <PublicLayout>
      {isLoading ? (
        <Spinner fullHeight text="Loading stories..." />
      ) : (
        <>
          {/* New CMS Hero Section */}
          <section className="bg-white pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                {/* Left Side Content */}
                <div className="w-full lg:w-[35%] flex flex-col justify-center pt-8 lg:pt-0 lg:mt-12">
                  <h1 className="text-[32px] sm:text-[38px] lg:text-[54px] font-bold text-zinc-900 tracking-tight leading-[1.1] mb-5">
                    Discover insights that <span className="text-blue-600">spark curiosity</span>.
                  </h1>

                  <p className="text-[15px] sm:text-[16px] text-zinc-500 font-medium leading-[1.6] max-w-[480px] mb-8">
                    Explore our curated collection of expert articles, deep dives, and daily news covering technology, design, and business.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigate('/blog')}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold px-7 py-3.5 rounded-full transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5"
                    >
                      Explore Articles
                    </button>
                    <button
                      onClick={() => navigate('/about')}
                      className="inline-flex items-center justify-center bg-white hover:bg-zinc-50 text-zinc-900 text-[15px] font-semibold px-7 py-3.5 rounded-full border border-zinc-200 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Right Side Illustration */}
                <div className="w-full lg:w-[65%] relative flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
                  <div className="w-full max-w-[1100px] relative lg:-mr-16 xl:-mr-32">
                    <img
                      src="/banner/banner.png"
                      alt="CMS Content Studio"
                      className="w-full h-auto object-contain scale-[1.05] lg:scale-110 origin-right"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Latest Posts & News - Grid */}
          {displayPosts.length > 0 && (
            <section className="bg-zinc-50 border-t border-zinc-200/60 py-16 sm:py-24">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                  <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Latest Posts & News</h2>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-[15px] font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
                  >
                    View all posts →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                  {displayPosts.map((story) => (
                    <article
                      key={story._id || story.id}
                      className="group flex flex-col cursor-pointer transition-all"
                      onClick={() => navigate(`/blog/${story._id || story.id}`)}
                    >
                      {story.imageUrl && (
                        <div className="w-full aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100 mb-5">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex flex-col flex-1">

                        <h3 className="text-[20px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-3 leading-[1.35]">
                          {story.title}
                        </h3>

                        <span className="text-[13.5px] text-zinc-500">
                          {formatDate(story.createdAt)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {!posts.length && (
            <div className="text-center py-24 bg-white">
              <p className="text-zinc-500 text-lg">No content published yet.</p>
            </div>
          )}
        </>
      )}
    </PublicLayout>
  );
}
