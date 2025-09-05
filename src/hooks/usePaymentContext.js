import { useWalletClient } from "wagmi";
import { useCallback, useState } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import StripeService from "../services/StripeService";
import { useAuth } from "./useAuth";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { user, refreshProfile } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Crypto payment using x402-axios
  const createCryptoSession = useCallback(async () => {
    if (!walletClient || !walletClient.account) throw new Error("please connect your wallet");
    if (isError) throw new Error("wallet not connected");
    if (isLoading) throw new Error("wallet is loading");
    
    const baseClient = axios.create({
        baseURL: "https://payments.vistara.dev",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    const apiClient = withPaymentInterceptor(baseClient, walletClient);
    const response = await apiClient.post("/api/payment", { amount: "$5.00" });
    const paymentResponse = response.config.headers["X-PAYMENT"];
    
    if (!paymentResponse) throw new Error("payment response is absent");
    
    const decoded = decodeXPaymentResponse(paymentResponse);
    console.log(`decoded payment response: ${JSON.stringify(decoded)}`);
    
    return decoded;
  }, [walletClient, isError, isLoading]);

  // Stripe subscription payment
  const createStripeSubscription = useCallback(async (planId = 'premium_monthly') => {
    if (!user) throw new Error("User must be authenticated");
    
    setPaymentLoading(true);
    try {
      const plans = StripeService.getPricingPlans();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) throw new Error("Invalid plan selected");
      
      const sessionData = await StripeService.createSubscriptionSession(user.id, plan.stripePriceId);
      
      // In a real app, redirect to Stripe Checkout
      // For demo, simulate successful payment
      await StripeService.simulateSuccessfulPayment(sessionData.sessionId, user.id);
      await refreshProfile();
      
      return { success: true, sessionData };
    } finally {
      setPaymentLoading(false);
    }
  }, [user, refreshProfile]);

  // Stripe one-time payment for documents
  const createStripeDocumentPayment = useCallback(async (documentType = 'ai_script') => {
    if (!user) throw new Error("User must be authenticated");
    
    setPaymentLoading(true);
    try {
      const sessionData = await StripeService.createDocumentPaymentSession(user.id, documentType);
      
      // In a real app, redirect to Stripe Checkout
      // For demo, simulate successful payment
      await StripeService.simulateSuccessfulPayment(sessionData.sessionId, user.id);
      
      return { success: true, sessionData };
    } finally {
      setPaymentLoading(false);
    }
  }, [user]);

  // Generic payment method that supports both crypto and Stripe
  const createSession = useCallback(async (paymentMethod = 'crypto', options = {}) => {
    switch (paymentMethod) {
      case 'crypto':
        return await createCryptoSession();
      case 'stripe_subscription':
        return await createStripeSubscription(options.planId);
      case 'stripe_document':
        return await createStripeDocumentPayment(options.documentType);
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }, [createCryptoSession, createStripeSubscription, createStripeDocumentPayment]);

  // Get customer portal for subscription management
  const getCustomerPortal = useCallback(async () => {
    if (!user) throw new Error("User must be authenticated");
    
    return await StripeService.createCustomerPortalSession(user.id);
  }, [user]);

  return { 
    createSession,
    createCryptoSession,
    createStripeSubscription,
    createStripeDocumentPayment,
    getCustomerPortal,
    paymentLoading,
    isWalletConnected: !!walletClient?.account,
    isWalletLoading: isLoading
  };
}
