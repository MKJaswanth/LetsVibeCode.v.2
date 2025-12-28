import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Flame } from 'lucide-react';

const ToolCard = ({ tool, onClick, voteCount, hasVoted, onUpvote }) => {
  const badgeColors = {
    free: 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.6)]',
    freemium: 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.6)]',
    paid: 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,170,0.6)]'
  };

  // Determine if this is a "featured" tool
  const isFeatured = tool.featured;

  return (
    <motion.div 
      onClick={() => onClick(tool)}
      className={`group relative flex flex-col h-full backdrop-blur-md overflow-hidden transition-all duration-300 cursor-pointer
        ${isFeatured ? 'bg-black/80 border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.2)]' : 'bg-black/40 border border-white/10 hover:border-neon-cyan'}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      style={{
        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
      }}
    >
      {/* Featured Banner */}
      {isFeatured && (
        <div className="absolute top-0 right-16 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 z-20">
          FEATURED
        </div>
      )}

      {/* Pricing Badge */}
      <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-bold tracking-widest uppercase z-20 ${badgeColors[tool.pricing]}`}
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 20px 100%)' }}>
        {tool.pricing}
      </div>

      {/* Affiliate/CTA Button (Visual Only for now) */}
      {tool.affiliate && (
         <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-neon-cyan text-black text-xs font-bold px-3 py-1 rounded-sm">
               GET DEAL
            </span>
         </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
            {isFeatured && <Star size={16} className="text-yellow-500 fill-yellow-500 animate-pulse" />}
            <h3 className={`font-orbitron text-lg font-bold tracking-wide transition-colors ${isFeatured ? 'text-yellow-400' : 'text-white group-hover:text-neon-cyan'}`}>
              {tool.name}
            </h3>
        </div>
        
        <p className="text-gray-400 text-sm font-mono leading-relaxed group-hover:text-gray-200 transition-colors flex-grow">
          {tool.desc}
        </p>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center group-hover:border-neon-cyan/30">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onUpvote}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-300 ${
                        hasVoted 
                        ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                    <motion.div
                        animate={hasVoted ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
                    >
                        <Flame size={14} className={hasVoted ? 'fill-neon-pink' : ''} />
                    </motion.div>
                    <span className="text-xs font-bold">{voteCount || 0}</span>
                </button>
                <span className="text-xs font-mono text-neon-cyan/60">
                    //{tool.category.split(' ')[0]}
                </span>
            </div>
            {!tool.affiliate && (
                <span className="text-xs text-neon-pink opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                ANALYZE <ExternalLink size={10} />
                </span>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;
