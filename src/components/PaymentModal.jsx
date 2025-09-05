import React, { useState } from 'react';
import { X, Check, Crown, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StripeService from '../services/StripeService';

const PaymentModal = ({ isOpen, onClose, selectedLanguage, paymentType = 'subscription' }) => {
  const { user, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('premium_monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = StripeService.getPricingPlans();

  const handlePayment = async (planId) => {
    if (!user) {
      setError(
        selectedLanguage === 'spanish'
          ? 'Debes iniciar sesión para realizar un pago'
          : 'You must be signed in to make a payment'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      let sessionData;
      
      if (planId === 'pay_per_use') {
        sessionData = await StripeService.createDocumentPaymentSession(user.id);
      } else {
        const plan = plans.find(p => p.id === planId);
        sessionData = await StripeService.createSubscriptionSession(user.id, plan.stripePriceId);
      }

      // In a real app, redirect to Stripe Checkout
      // For demo purposes, we'll simulate a successful payment
      const confirmed = confirm(
        selectedLanguage === 'spanish'
          ? `¿Proceder con el pago de ${StripeService.formatCurrency(
              plans.find(p => p.id === planId)?.price || 0
            )}?`
          : `Proceed with payment of ${StripeService.formatCurrency(
              plans.find(p => p.id === planId)?.price || 0
            )}?`
      );

      if (confirmed) {
        // Simulate successful payment
        await StripeService.simulateSuccessfulPayment(sessionData.sessionId, user.id);
        await refreshProfile();
        
        alert(
          selectedLanguage === 'spanish'
            ? '¡Pago exitoso! Tu cuenta ha sido actualizada.'
            : 'Payment successful! Your account has been upgraded.'
        );
        
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PlanCard = ({ plan, isSelected, onSelect }) => {
    const isPopular = plan.popular;
    const isFree = plan.id === 'free';
    
    return (
      <div
        className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:border-gray-300'
        } ${isPopular ? 'ring-2 ring-accent ring-opacity-50' : ''}`}
        onClick={() => onSelect(plan.id)}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedLanguage === 'spanish' ? 'Más Popular' : 'Most Popular'}
            </span>
          </div>
        )}
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            {isFree ? (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-gray-600" />
              </div>
            ) : plan.id === 'pay_per_use' ? (
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {StripeService.formatCurrency(plan.price)}
            </span>
            {plan.interval && (
              <span className="text-gray-600">
                /{selectedLanguage === 'spanish' ? 
                  (plan.interval === 'month' ? 'mes' : 'año') : 
                  plan.interval
                }
              </span>
            )}
          </div>

          {plan.savings && (
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {selectedLanguage === 'spanish' ? 'Ahorra' : 'Save'} {StripeService.formatCurrency(plan.savings)}
              </span>
            </div>
          )}
        </div>

        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations && (
          <ul className="space-y-2 mb-6">
            {plan.limitations.map((limitation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-500">{limitation}</span>
              </li>
            ))}
          </ul>
        )}

        {!isFree && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePayment(plan.id);
            }}
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {selectedLanguage === 'spanish' ? 'Procesando...' : 'Processing...'}
              </div>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                {selectedLanguage === 'spanish' ? 'Seleccionar Plan' : 'Select Plan'}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedLanguage === 'spanish' ? 'Elegir Plan' : 'Choose Your Plan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedLanguage === 'spanish' 
                ? 'Desbloquea Todo el Potencial de Shield & Speak'
                : 'Unlock the Full Power of Shield & Speak'}
            </h3>
            <p className="text-gray-600">
              {selectedLanguage === 'spanish'
                ? 'Elige el plan que mejor se adapte a tus necesidades'
                : 'Choose the plan that best fits your needs'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              {selectedLanguage === 'spanish' ? 'Información Importante' : 'Important Information'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedLanguage === 'spanish'
                    ? 'Cancela en cualquier momento sin penalizaciones'
                    : 'Cancel anytime with no penalties'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedLanguage === 'spanish'
                    ? 'Pagos seguros procesados por Stripe'
                    : 'Secure payments processed by Stripe'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedLanguage === 'spanish'
                    ? 'Soporte al cliente 24/7 para usuarios premium'
                    : '24/7 customer support for premium users'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
