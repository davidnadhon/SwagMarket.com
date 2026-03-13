import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CartSidebar({ isOpen, onClose, items, onRemove, onUpdateQty, totalPrice, onCheckout }) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[60] bg-[#111111] 
                       border-l border-yellow-500/20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-bold font-mono text-lg tracking-wider">
                  CART
                </h2>
                <p className="text-yellow-500/60 text-xs font-mono">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 
                           hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <div className="w-16 h-16 border-2 border-yellow-500/20 flex items-center justify-center mb-4 clip-cyber">
                      <svg className="w-8 h-8 text-yellow-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m6 0V9" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-mono text-sm">CART IS EMPTY</p>
                    <p className="text-gray-700 font-mono text-xs mt-1">Add products to get started</p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      layout
                      className="flex gap-3 bg-[#1a1a1a] border border-white/5 p-3 hover:border-yellow-500/20 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs font-mono font-semibold truncate">{item.name}</h4>
                        <p className="text-yellow-500 text-xs font-mono mt-0.5">
                          ${item.price.toFixed(2)}
                        </p>
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1, item.stock)}
                            className="w-6 h-6 flex items-center justify-center bg-[#2a2a2a] text-gray-400 
                                       hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-white text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1, item.stock)}
                            disabled={item.quantity >= item.stock}
                            className="w-6 h-6 flex items-center justify-center bg-[#2a2a2a] text-gray-400 
                                       hover:text-yellow-500 hover:bg-yellow-500/10 transition-all
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-gray-600 text-xs font-mono ml-auto">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors self-start p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* Trust badges */}
                <div className="flex items-center gap-2 text-green-400 text-xs font-mono bg-green-400/5 
                                border border-green-400/20 px-3 py-2">
                  <ShieldCheckIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Transaction Chiffrée AES-256 · Vérification d'intégrité du colis</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">TOTAL</span>
                  <span className="text-yellow-500 font-bold font-mono text-xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <motion.button
                  onClick={onCheckout}
                  className="w-full py-3 bg-yellow-500 text-black font-bold font-mono text-sm 
                             tracking-widest hover:bg-yellow-400 transition-colors clip-cyber-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  PROCEED TO CHECKOUT →
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
