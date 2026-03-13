import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShieldCheckIcon, LockClosedIcon, TruckIcon } from '@heroicons/react/24/outline';

const STEPS = ['Cart', 'Shipping', 'Payment'];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 text-xs font-mono font-bold clip-cyber-sm
            ${i < currentStep
              ? 'bg-yellow-500 text-black'
              : i === currentStep
              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/60'
              : 'bg-[#1a1a1a] text-gray-600 border border-white/10'
            }`}
          >
            {i < currentStep ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-mono hidden sm:block ${i === currentStep ? 'text-yellow-500' : 'text-gray-600'}`}>
            {step.toUpperCase()}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mx-1 ${i < currentStep ? 'bg-yellow-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function CartStep({ items, totalPrice, onNext }) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-mono font-bold text-lg">Order Summary</h3>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 bg-[#1a1a1a] p-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-mono truncate">{item.name}</p>
              <p className="text-yellow-500 text-xs font-mono">x{item.quantity}</p>
            </div>
            <p className="text-white text-xs font-mono">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-3 flex justify-between">
        <span className="text-gray-400 font-mono text-sm">Total</span>
        <span className="text-yellow-500 font-bold font-mono text-lg">${totalPrice.toFixed(2)}</span>
      </div>
      <button
        onClick={onNext}
        className="w-full py-3 bg-yellow-500 text-black font-bold font-mono text-sm tracking-widest 
                   hover:bg-yellow-400 transition-colors clip-cyber-sm"
      >
        CONTINUE → SHIPPING
      </button>
    </div>
  );
}

function ShippingStep({ onNext, onBack }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', zip: '', country: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.zip.trim()) errs.zip = 'Required';
    if (!form.country.trim()) errs.country = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const Field = ({ name, placeholder }) => (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
        className={`w-full bg-[#1a1a1a] border ${errors[name] ? 'border-red-500/60' : 'border-white/10'} 
                   text-white text-sm font-mono px-3 py-2.5 placeholder-gray-600 
                   focus:outline-none focus:border-yellow-500/60 transition-colors`}
      />
      {errors[name] && <p className="text-red-400 text-xs font-mono mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TruckIcon className="w-5 h-5 text-yellow-500" />
        <h3 className="text-white font-mono font-bold text-lg">Shipping Info</h3>
      </div>
      <div className="space-y-3">
        <Field name="name" placeholder="Full Name" />
        <Field name="address" placeholder="Street Address" />
        <div className="grid grid-cols-2 gap-3">
          <Field name="city" placeholder="City" />
          <Field name="zip" placeholder="ZIP Code" />
        </div>
        <Field name="country" placeholder="Country" />
      </div>
      <div className="flex items-center gap-2 text-green-400 text-xs font-mono bg-green-400/5 
                      border border-green-400/20 px-3 py-2">
        <ShieldCheckIcon className="w-4 h-4 flex-shrink-0" />
        <span>Encrypted delivery · Anonymous shipping available</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-[#1a1a1a] text-gray-400 font-mono text-sm border border-white/10 
                     hover:border-yellow-500/30 transition-colors"
        >
          ← BACK
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] py-3 bg-yellow-500 text-black font-bold font-mono text-sm tracking-widest 
                     hover:bg-yellow-400 transition-colors clip-cyber-sm"
        >
          CONTINUE → PAYMENT
        </button>
      </div>
    </div>
  );
}

function PaymentStep({ totalPrice, onBack, onConfirm }) {
  const [form, setForm] = useState({ cardNumber: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validate = () => {
    const errs = {};
    const raw = form.cardNumber.replace(/\s/g, '');
    if (raw.length < 16) errs.cardNumber = 'Invalid card number';
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = 'Invalid (MM/YY)';
    if (form.cvv.length < 3) errs.cvv = 'Invalid CVV';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 2000);
  };

  const Field = ({ name, placeholder, type = 'text', value, onChange }) => (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#1a1a1a] border ${errors[name] ? 'border-red-500/60' : 'border-white/10'} 
                   text-white text-sm font-mono px-3 py-2.5 placeholder-gray-600 
                   focus:outline-none focus:border-yellow-500/60 transition-colors`}
      />
      {errors[name] && <p className="text-red-400 text-xs font-mono mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <LockClosedIcon className="w-5 h-5 text-yellow-500" />
        <h3 className="text-white font-mono font-bold text-lg">Secure Payment</h3>
      </div>

      {/* Security indicators */}
      <div className="flex gap-2 flex-wrap">
        {['AES-256', 'TLS 1.3', 'PCI-DSS'].map((tag) => (
          <span key={tag} className="text-[10px] font-mono text-green-400 bg-green-400/10 
                                     border border-green-400/20 px-2 py-0.5">
            ◈ {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        <Field
          name="cardNumber"
          placeholder="Card Number (16 digits)"
          value={form.cardNumber}
          onChange={(e) => setForm((p) => ({ ...p, cardNumber: formatCard(e.target.value) }))}
        />
        <Field
          name="name"
          placeholder="Cardholder Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            name="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={(e) => setForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
          />
          <Field
            name="cvv"
            placeholder="CVV"
            type="password"
            value={form.cvv}
            onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
          />
        </div>
      </div>

      <div className="border border-yellow-500/20 bg-yellow-500/5 p-3">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-gray-400">Amount to charge:</span>
          <span className="text-yellow-500 font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 bg-[#1a1a1a] text-gray-400 font-mono text-sm border border-white/10 
                     hover:border-yellow-500/30 transition-colors disabled:opacity-50"
        >
          ← BACK
        </button>
        <motion.button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-[2] py-3 bg-yellow-500 text-black font-bold font-mono text-sm tracking-widest 
                     hover:bg-yellow-400 transition-colors clip-cyber-sm disabled:opacity-60"
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full inline-block"
              />
              ENCRYPTING...
            </span>
          ) : (
            `CONFIRM $${totalPrice.toFixed(2)}`
          )}
        </motion.button>
      </div>
    </div>
  );
}

function SuccessStep({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-8 text-center space-y-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-16 h-16 bg-green-500/20 border border-green-500/50 flex items-center justify-center clip-cyber"
      >
        <ShieldCheckIcon className="w-8 h-8 text-green-400" />
      </motion.div>
      <div>
        <h3 className="text-white font-mono font-bold text-xl">ORDER CONFIRMED</h3>
        <p className="text-gray-500 font-mono text-xs mt-2">
          Transaction encrypted · Integrity verified
        </p>
      </div>
      <div className="space-y-1 text-xs font-mono">
        <p className="text-green-400">✓ Payment processed securely</p>
        <p className="text-green-400">✓ Package integrity check passed</p>
        <p className="text-green-400">✓ Anonymous shipping confirmed</p>
      </div>
      <button
        onClick={onClose}
        className="px-8 py-3 bg-yellow-500 text-black font-bold font-mono text-sm tracking-widest 
                   hover:bg-yellow-400 transition-colors clip-cyber-sm"
      >
        CLOSE
      </button>
    </motion.div>
  );
}

export default function CheckoutModal({ isOpen, onClose, items, totalPrice, onSuccess }) {
  const [step, setStep] = useState(0);

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep(0), 300);
  };

  const handleSuccess = () => {
    setStep(3);
    onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            onClick={step < 3 ? handleClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] 
                       w-full max-w-lg mx-4 bg-[#111111] border border-yellow-500/20 clip-cyber"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-mono font-bold text-sm tracking-widest">
                  SECURE CHECKOUT
                </span>
              </div>
              {step < 3 && (
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-yellow-500 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {step < 3 && <StepIndicator currentStep={step} />}

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CartStep items={items} totalPrice={totalPrice} onNext={() => setStep(1)} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ShippingStep onNext={() => setStep(2)} onBack={() => setStep(0)} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <PaymentStep totalPrice={totalPrice} onBack={() => setStep(1)} onConfirm={handleSuccess} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="success">
                    <SuccessStep onClose={handleClose} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
