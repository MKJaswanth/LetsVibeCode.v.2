import React from 'react';

const FilterBar = ({ currentFilter, setFilter }) => {
  const filters = ['all', 'free', 'freemium', 'paid'];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`
            relative px-6 py-2 font-orbitron text-sm uppercase tracking-wider border transition-all duration-300
            ${currentFilter === filter 
              ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.5)] font-bold' 
              : 'bg-black/60 text-neon-cyan border-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)]'}
          `}
          style={{
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
