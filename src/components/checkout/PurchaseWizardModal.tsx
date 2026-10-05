import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  QrCode,
  Wallet,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Product, PaymentMethod } from '../../types';

export const PurchaseWizardModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutProduct,
    setCheckoutProduct,
    products,
    reserveInventory,
    createOrderWithReservation,
    processPayment,
    retryPayment,
    setSelectedOrder,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(checkoutProduct);
  const [quantity, setQuantity] = useState<number>(1);
  const [reservationTtl, setReservationTtl] = useState<number>(600); // 10 minutes

  // Active reservation state in wizard
  const [reservationId, setReservationId] = useState<string>('');
  const [reservationRemaining, setReservationRemaining] = useState<number>(600);
  const [isReserving, setIsReserving] = useState<boolean>(false);

  // Order & Payment state
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'IDLE' | 'PROCESSING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'RETRYING'
  >('IDLE');
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  useEffect(() => {
    if (checkoutProduct) {
      setSelectedProduct(checkoutProduct);
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [checkoutProduct, products]);

  // Countdown timer for wizard reservation
  useEffect(() => {
    if (step >= 2 && reservationRemaining > 0 && reservationId) {
      const timer = setInterval(() => {
        setReservationRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, reservationRemaining, reservationId]);

  if (!isCheckoutOpen || !selectedProduct) return null;

  const totalAmount = selectedProduct.price * quantity;

  // Format MM:SS
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // STEP 1 -> STEP 2: Execute Inventory Reservation
  const handleProceedToReservation = async () => {
    setIsReserving(true);
    const result = await reserveInventory(selectedProduct.id, quantity, reservationTtl);
    setIsReserving(false);

    if (result.success && result.reservation) {
      setReservationId(result.reservation.id);
      setReservationRemaining(result.reservation.durationSeconds);

      // Create linked order
      const newOrder = await createOrderWithReservation(
        'Mahesh Sharma',
        'mahesh@salesstorm.internal',
        [
          {
            productId: selectedProduct.id,
            sku: selectedProduct.sku,
            name: selectedProduct.name,
            quantity,
            price: selectedProduct.price,
          },
        ],
        result.reservation.id
      );

      setCreatedOrderId(newOrder.id);
      setIdempotencyKey(`PAY-IDEMP-${Date.now()}-${newOrder.id}`);
      setStep(2);
    }
  };

  // STEP 2 -> STEP 3: Proceed to Payment Screen
  const handleProceedToPayment = () => {
    setStep(3);
  };

  // STEP 3: Execute Payment Simulation
  const handleExecutePayment = async () => {
    setPaymentStatus('PROCESSING');
    setPaymentError('');

    // Visual state transition delay
    await new Promise((r) => setTimeout(r, 900));

    if (simulateFailure) {
      const result = await processPayment(createdOrderId, paymentMethod, idempotencyKey, {
        simulateFailure: true,
      });
      setPaymentStatus('FAILED');
      setPaymentError(result.error || 'Payment Gateway Timeout (504)');
      setPaymentId(result.payment.id);
    } else {
      setPaymentStatus('AUTHORIZED');
      await new Promise((r) => setTimeout(r, 700));

      const result = await processPayment(createdOrderId, paymentMethod, idempotencyKey, {
        simulateFailure: false,
      });

      if (result.success) {
        setPaymentStatus('CAPTURED');
        setPaymentId(result.payment.id);
        setStep(4);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {
          // ignore if canvas not supported
        }
      }
    }
  };

  // Handle Retry
  const handleRetryPayment = async (forceSuccess: boolean = true) => {
    setPaymentStatus('RETRYING');
    const res = await retryPayment(paymentId, forceSuccess);
    if (res.success) {
      setPaymentStatus('CAPTURED');
      setStep(4);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setPaymentStatus('FAILED');
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setPaymentStatus('IDLE');
    setPaymentError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
      />

      {/* Main Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
      >
        {/* Stepper Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                SalesStorm Purchase & Order Orchestration
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: '1. Product' },
              { num: 2, label: '2. Reservation' },
              { num: 3, label: '3. Payment' },
              { num: 4, label: '4. Confirmed' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1.5 px-2 rounded-lg text-center font-mono text-xs transition-colors border ${
                  step === s.num
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                    : step > s.num
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700/50'
                }`}
              >
                {step > s.num ? `✓ ${s.label.split('. ')[1]}` : s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area per Step */}
        <div className="p-6">
          {/* STEP 1: Product Selection & Quantity */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-500 font-semibold">{selectedProduct.sku}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                      {selectedProduct.availableStock} in stock
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{selectedProduct.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{selectedProduct.description}</p>
                  <p className="font-mono font-bold text-base text-slate-900 dark:text-white mt-2">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.availableStock, q + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
                <div>
                  <span className="text-xs text-slate-500">Order Subtotal</span>
                  <p className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  <span>TTL Lock Duration: 10m (600s)</span>
                </div>
              </div>

              <button
                onClick={handleProceedToReservation}
                disabled={isReserving || selectedProduct.availableStock < quantity}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isReserving ? (
                  <span>Reserving Stock in Inventory...</span>
                ) : (
                  <>
                    <span>Reserve Inventory</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Reservation Confirmation with Animated Countdown */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Inventory Successfully Reserved!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  A high-priority lock has been placed in the Redis cluster for your order.
                </p>
              </div>

              {/* Reservation Details Box with Timer */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500">Reservation ID</span>
                  <span className="font-mono font-bold text-indigo-500">{reservationId}</span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500">Linked Order ID</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{createdOrderId}</span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500">Reserved Units</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {quantity}x {selectedProduct.name}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-500 animate-spin-slow" />
                    <span className="font-semibold">Expires in:</span>
                  </div>
                  <div className="font-mono font-bold text-lg text-amber-500">
                    {formatTimer(reservationRemaining)}
                  </div>
                </div>

                {/* Progress bar of countdown */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${(reservationRemaining / reservationTtl) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Interface & Failure Simulation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Total Order Amount</span>
                  <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-mono">TTL Lock Active:</span>
                  <p className="font-mono font-bold text-amber-500 text-sm">
                    {formatTimer(reservationRemaining)}
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Select Payment Method:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI / QR', icon: QrCode },
                    { id: 'wallet', label: 'Fast Wallet', icon: Wallet },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                          paymentMethod === m.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idempotency Key Banner */}
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Idempotency Key:</span>
                <span className="text-indigo-500 truncate max-w-xs">{idempotencyKey}</span>
              </div>

              {/* Presenter Failure Simulation Toggle */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      Simulate Payment Gateway Failure
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Demonstrates timeout (504), retry attempts, and compensation
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Payment Processing State / Error View */}
              {paymentStatus === 'PROCESSING' && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center animate-pulse">
                  <p className="text-xs font-mono font-bold text-indigo-500">
                    PROCESSING → AUTHORIZING WITH ACQUIRER NETWORK...
                  </p>
                </div>
              )}

              {paymentStatus === 'FAILED' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Payment Failed: {paymentError}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Automatic circuit breaker routed failed message to Dead Letter Queue (DLQ). Choose an action:
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleRetryPayment(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                    >
                      FORCE SUCCESS (RETRY #2)
                    </button>
                    <button
                      onClick={() => handleRetryPayment(false)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold text-xs"
                    >
                      RETRY PAYMENT (KEEP FAILING)
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus === 'RETRYING' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs font-mono font-bold text-amber-500 animate-pulse">
                    RETRYING... ATTEMPT #2 WITH EXPONENTIAL BACKOFF
                  </p>
                </div>
              )}

              {/* Pay Button */}
              {paymentStatus !== 'PROCESSING' && paymentStatus !== 'RETRYING' && (
                <button
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>PAY ₹{totalAmount.toLocaleString('en-IN')}</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 4: Order Confirmation & Receipt */}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Order Confirmed & Fulfilled!
              </h4>
              <p className="text-xs text-slate-500">
                Payment captured, inventory finalized from reserved to sold pool, and dispatch event published.
              </p>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-indigo-500">{createdOrderId}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="font-mono font-bold text-emerald-500">{paymentId}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Reservation Reference:</span>
                  <span className="font-mono text-slate-300">{reservationId} (LOCKED & FINALIZED)</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('orders');
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  View in Orders Table
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
