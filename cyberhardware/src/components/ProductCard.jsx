import { motion } from 'framer-motion';
import { ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const categoryColors = {
  Hardware: 'badge-hardware',
  Privacy: 'badge-privacy',
  Pentest: 'badge-pentest',
};

const badgeColors = {
  BESTSELLER: 'bg-yellow-500 text-black',
  PRO: 'bg-blue-500 text-white',
  SECURE: 'bg-purple-500 text-white',
  NEW: 'bg-green-500 text-black',
  LIMITED: 'bg-red-500 text-white',
};

export default function ProductCard({ product, onAddToCart, index }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#111111] border border-white/10 hover:border-yellow-500/50 
                 transition-all duration-300 overflow-hidden clip-cyber flex flex-col"
    >
      {/* Top glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

        {/* Product badge */}
        {product.badge && (
          <span className={`absolute top-3 right-3 text-[10px] font-bold font-mono px-2 py-0.5 
                            tracking-widest ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 tracking-wider 
                          ${categoryColors[product.category]}`}>
          {product.category.toUpperCase()}
        </span>

        {/* Stock indicator */}
        {product.stock <= 10 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-[10px] font-mono">
              {product.stock} LEFT
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-yellow-500 
                       transition-colors duration-200 font-mono">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div>
            <div className="text-yellow-500 font-bold text-lg font-mono">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-gray-600 text-[10px] font-mono">EXCL. TAXES</div>
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={product.stock === 0}
            animate={added ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold 
                        tracking-wider transition-all duration-200 clip-cyber-sm
                        ${added
                          ? 'bg-green-500 text-black border border-green-400'
                          : product.stock === 0
                          ? 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/40 hover:bg-yellow-500 hover:text-black'
                        }`}
          >
            {added ? (
              <>
                <span>✓</span>
                <span>ADDED</span>
              </>
            ) : product.stock === 0 ? (
              <span>OUT OF STOCK</span>
            ) : (
              <>
                <PlusIcon className="w-3.5 h-3.5" />
                <span>ADD</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom corner decoration */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yellow-500/30 
                      group-hover:border-yellow-500/70 transition-colors duration-300" />
    </motion.div>
  );
}
