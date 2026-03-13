import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, ShieldCheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Navbar({ totalItems, onCartOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-yellow-500/20 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 clip-cyber-sm flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-wider font-mono">
                CYBER<span className="text-yellow-500">HARDWARE</span>
              </span>
              <div className="text-yellow-500/50 text-xs font-mono tracking-widest -mt-1">
                ◈ SECURE STORE
              </div>
            </div>
          </div>

          {/* Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {['Products', 'Categories', 'About'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-mono tracking-wider"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Security badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-green-400 text-xs font-mono">
              <LockIcon />
              <span>AES-256</span>
            </div>

            {/* Cart button */}
            <motion.button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 
                         text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/60 transition-all clip-cyber-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <AnimatePresence mode="wait">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 text-black text-xs font-bold 
                               rounded-full flex items-center justify-center"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-sm font-mono hidden sm:block">CART</span>
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-400 hover:text-yellow-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-yellow-500/20 py-4 space-y-3"
            >
              {['Products', 'Categories', 'About'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm font-mono tracking-wider px-2"
                >
                  {link}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
