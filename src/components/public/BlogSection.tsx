import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, User, ArrowRight, X } from 'lucide-react';
import { BLOG_POSTS } from '../../data/initialData';
import { BlogPost } from '../../types';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 bg-[#FAF7F2] border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFD8] text-[#BE5A38] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academia & Gestión de Belleza</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Artículos para Líderes de Salones
          </h2>
          <p className="text-[#78716C] text-base sm:text-lg">
            Estrategias probadas de colorimetría, control de mermas, ventas cruzadas y fidelización de clientela.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8DFD8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-[#BE5A38]">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917] leading-snug group-hover:text-[#BE5A38] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#57534E] line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#F0E8E1] mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-[#BE5A38]" />
                  <span className="font-semibold text-[#292524]">{post.author}</span>
                </div>

                <button
                  id={`btn-read-post-${post.id}`}
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#BE5A38] hover:text-[#A84E30]"
                >
                  <span>Leer Artículo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Full Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#57534E] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 bg-[#FAF7F2] text-[#BE5A38] text-xs font-bold rounded-full border border-[#E8DFD8]">
              {selectedPost.category}
            </span>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917] mt-3">
              {selectedPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[#78716C] my-4 pb-4 border-b border-[#E8DFD8]">
              <span>Por <strong>{selectedPost.author}</strong> ({selectedPost.authorRole})</span>
              <span>•</span>
              <span>{selectedPost.date}</span>
            </div>

            <img
              src={selectedPost.imageUrl}
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />

            <div className="prose text-sm text-[#44403C] leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8DFD8] flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 bg-[#BE5A38] text-white text-xs font-bold rounded-xl"
              >
                Cerrar Artículo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
