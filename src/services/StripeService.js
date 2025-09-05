import { loadStripe } from '@stripe/stripe-js';
import SupabaseService from './SupabaseService';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo'
);

class StripeService {
  static async getStripe() {
    return await stripePromise;
  }

  // Create a payment session for subscription
  static async createSubscriptionSession(userId, priceId = 'price_monthly_5') {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate the flow
      const sessionData = {
        sessionId: `cs_test_${Date.now()}`,
        url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
        priceId,
        amount: 500, // $5.00 in cents
        currency: 'usd',
        mode: 'subscription'
      };

      // Save payment intent to database
      await SupabaseService.savePaymentRecord(userId, {
        stripe_session_id: sessionData.sessionId,
        amount: sessionData.amount,
        currency: sessionData.currency,
        status: 'pending',
        payment_type: 'subscription',
        metadata: { priceId }
      });

      return sessionData;
    } catch (error) {
      console.error('Error creating subscription session:', error);
      throw error;
    }
  }

  // Create a payment session for one-time document generation
  static async createDocumentPaymentSession(userId, documentType = 'ai_script') {
    try {
      const sessionData = {
        sessionId: `cs_test_${Date.now()}`,
        url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
        amount: 100, // $1.00 in cents
        currency: 'usd',
        mode: 'payment'
      };

      // Save payment intent to database
      await SupabaseService.savePaymentRecord(userId, {
        stripe_session_id: sessionData.sessionId,
        amount: sessionData.amount,
        currency: sessionData.currency,
        status: 'pending',
        payment_type: 'one_time',
        metadata: { documentType }
      });

      return sessionData;
    } catch (error) {
      console.error('Error creating document payment session:', error);
      throw error;
    }
  }

  // Simulate successful payment (in real app, this would be handled by webhooks)
  static async simulateSuccessfulPayment(sessionId, userId) {
    try {
      // Update payment record
      const paymentHistory = await SupabaseService.getUserPaymentHistory(userId);
      const payment = paymentHistory.find(p => p.stripe_session_id === sessionId);
      
      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Update payment status
      await SupabaseService.savePaymentRecord(userId, {
        ...payment,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      // Update subscription status if it's a subscription payment
      if (payment.payment_type === 'subscription') {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

        await SupabaseService.updateSubscriptionStatus(userId, {
          status: 'active',
          subscription_id: `sub_${Date.now()}`,
          expires_at: expiresAt.toISOString()
        });
      }

      return { success: true, payment };
    } catch (error) {
      console.error('Error processing successful payment:', error);
      throw error;
    }
  }

  // Handle payment cancellation
  static async handlePaymentCancellation(sessionId, userId) {
    try {
      const paymentHistory = await SupabaseService.getUserPaymentHistory(userId);
      const payment = paymentHistory.find(p => p.stripe_session_id === sessionId);
      
      if (payment) {
        await SupabaseService.savePaymentRecord(userId, {
          ...payment,
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error handling payment cancellation:', error);
      throw error;
    }
  }

  // Get customer portal URL (for managing subscriptions)
  static async createCustomerPortalSession(userId) {
    try {
      // In a real app, this would call your backend API
      const portalData = {
        url: `https://billing.stripe.com/p/session/test_${Date.now()}`,
        return_url: window.location.origin + '/profile'
      };

      return portalData;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      throw error;
    }
  }

  // Validate webhook signature (backend only)
  static validateWebhookSignature(payload, signature, secret) {
    // This would be implemented on the backend
    // Using Stripe's webhook signature validation
    throw new Error('Webhook validation should be done on the backend');
  }

  // Process webhook events (backend only)
  static async processWebhookEvent(event) {
    // This would be implemented on the backend
    // Handle various Stripe webhook events
    throw new Error('Webhook processing should be done on the backend');
  }

  // Helper method to format currency
  static formatCurrency(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Helper method to get subscription status
  static getSubscriptionStatus(subscription) {
    if (!subscription) return 'inactive';
    
    const now = new Date();
    const expiresAt = new Date(subscription.subscription_expires_at);
    
    if (subscription.subscription_status === 'active' && expiresAt > now) {
      return 'active';
    } else if (subscription.subscription_status === 'active' && expiresAt <= now) {
      return 'expired';
    } else {
      return subscription.subscription_status || 'inactive';
    }
  }

  // Get available pricing plans
  static getPricingPlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'usd',
        interval: null,
        features: [
          'Basic rights information',
          'Location-based legal content',
          'Audio recording (local only)',
          'Basic emergency alerts'
        ],
        limitations: [
          'No AI script generation',
          'No cloud storage',
          'Limited legal content'
        ]
      },
      {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 500, // $5.00 in cents
        currency: 'usd',
        interval: 'month',
        stripePriceId: 'price_monthly_5',
        features: [
          'All free features',
          'Unlimited AI script generation',
          'Cloud recording storage',
          'Advanced emergency contacts',
          'Comprehensive legal database',
          'Priority support'
        ],
        popular: true
      },
      {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        price: 5000, // $50.00 in cents (save $10)
        currency: 'usd',
        interval: 'year',
        stripePriceId: 'price_yearly_50',
        features: [
          'All premium features',
          '2 months free',
          'Priority support',
          'Early access to new features'
        ],
        savings: 1000 // $10.00 savings
      },
      {
        id: 'pay_per_use',
        name: 'Pay Per Document',
        price: 100, // $1.00 in cents
        currency: 'usd',
        interval: null,
        features: [
          'Generate single AI script',
          'No subscription required',
          'Perfect for occasional use'
        ]
      }
    ];
  }
}

export default StripeService;
