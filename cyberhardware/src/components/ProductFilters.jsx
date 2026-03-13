import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from '../data/products';

export default function ProductFilters({ search, onSearch, activeCategory, onCategory }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm font-mono 
                     pl-9 pr-4 py-2.5 placeholder-gray-600 
                     focus:outline-none focus:border-yellow-500/60 transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <FunnelIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all
              ${activeCategory === cat
                ? 'bg-yellow-500 text-black font-bold'
                : 'bg-[#1a1a1a] text-gray-400 border border-white/10 hover:border-yellow-500/40 hover:text-yellow-500'
              }`}
          >
            {cat.toUpperCase()}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
