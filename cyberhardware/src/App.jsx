import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import ProductFilters from './components/ProductFilters';
import { useCart } from './hooks/useCart';
import { products } from './data/products';

function TrustBanner() {
  const items = [
    '🔒 AES-256 Encrypted Transactions',
    '📦 Package Integrity Verification',
    '🛡️ Anonymous Shipping Available',
    '⚡ Secure Checkout · TLS 1.3',
    '🔐 Zero-Knowledge Payment Processing',
  ];
  return (
    <div className="bg-[#0d0d0d] border-b border-yellow-500/10 overflow-hidden">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-16 py-2 whitespace-nowrap"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-yellow-500/50 text-xs font-mono">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-yellow-500/3 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-3xl">
          {/* Terminal-style prefix */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-yellow-500 font-mono text-sm">root@cyberhardware:~$</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-4 bg-yellow-500"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono mb-4 leading-tight"
          >
            <span className="text-white">Premium</span>
            <br />
            <span className="text-yellow-500 text-glow">Cyber Tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed"
          >
            Professional-grade cybersecurity hardware for red team operators,
            security researchers, and privacy-conscious individuals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { label: '8 Products', icon: '◈' },
              { label: 'AES-256 Secure', icon: '🔒' },
              { label: 'Anonymous Shipping', icon: '📦' },
              { label: '24/7 Support', icon: '⚡' },
            ].map((badge) => (
              <span
                key={badge.label}
                className="flex items-center gap-1.5 text-xs font-mono text-gray-400 
                           bg-[#1a1a1a] border border-white/10 px-3 py-1.5"
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleCheckout = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 300);
  };

  const handleOrderSuccess = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] scanline">
      <TrustBanner />
      <Navbar totalItems={totalItems} onCartOpen={() => setCartOpen(true)} />
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filters */}
        <div className="mb-8">
          <ProductFilters
            search={search}
            onSearch={setSearch}
            activeCategory={activeCategory}
            onCategory={setActiveCategory}
          />
        </div>

        {/* Products count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-xs font-mono">
            <span className="text-yellow-500">{filteredProducts.length}</span> / {products.length} products
          </p>
          <div className="flex items-center gap-1.5 text-gray-600 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            SECURE CONNECTION
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-6xl mb-4 opacity-30">🔍</div>
              <p className="text-gray-500 font-mono text-sm">NO RESULTS FOUND</p>
              <p className="text-gray-700 font-mono text-xs mt-1">
                Try a different search term or category
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0d0d0d] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-mono font-bold text-sm">CYBER<span className="text-white">HARDWARE</span></span>
              <span className="text-gray-700 font-mono text-xs">◈ Professional Security Tools</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-xs font-mono">
              <span>🔒 AES-256</span>
              <span>📦 Integrity Check</span>
              <span>🛡️ Anonymous</span>
            </div>
          </div>
          <p className="text-gray-700 text-xs font-mono text-center mt-4">
            © 2024 CyberHardware · For authorized security testing only · All transactions encrypted
          </p>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onRemove={removeItem}
        onUpdateQty={updateQuantity}
        totalPrice={totalPrice}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
