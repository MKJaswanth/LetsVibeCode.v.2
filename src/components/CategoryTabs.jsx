import React from 'react';
import { motion } from 'framer-motion';

const CategoryTabs = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-5xl mx-auto">
      <button
        onClick={() => setActiveCategory('ALL')}
        className={`relative px-4 py-2 text-sm font-orbitron tracking-wider transition-colors duration-300 ${
          activeCategory === 'ALL' ? 'text-black font-bold' : 'text-gray-400 hover:text-neon-cyan'
        }`}
      >
        {activeCategory === 'ALL' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-neon-cyan skew-x-[-12deg]"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">ALL SYSTEMS</span>
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`relative px-4 py-2 text-sm font-orbitron tracking-wider transition-colors duration-300 ${
            activeCategory === category ? 'text-black font-bold' : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          {activeCategory === category && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-neon-cyan skew-x-[-12deg]"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{category.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
