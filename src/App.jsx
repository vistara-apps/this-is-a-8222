import React, { useState, useEffect } from 'react';
import { Shield, Mic, AlertTriangle, MapPin, Globe, FileText, User, Settings, LogIn } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import AppShell from './components/AppShell';
import KnowYourRights from './components/KnowYourRights';
import QuickRecord from './components/QuickRecord';
import UserProfile from './components/UserProfile';
import UserRegistration from './components/UserRegistration';
import PaymentModal from './components/PaymentModal';
import LocationService from './services/LocationService';
import LegalContentService from './services/LegalContentService';
import AIScriptGenerator from './services/AIScriptGenerator';
import { usePaymentContext } from './hooks/usePaymentContext';
import { useAuth } from './hooks/useAuth';

function App() {
  const [currentView, setCurrentView] = useState('rights');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [legalContent, setLegalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { createSession } = usePaymentContext();
  const { user, isAuthenticated, loading: authLoading, isPremium } = useAuth();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Get user location
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      // Fetch legal content based on location
      const content = await LegalContentService.getContentByState(location.state);
      setLegalContent(content);
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Set default content for California if location fails
      const defaultContent = await LegalContentService.getContentByState('CA');
      setLegalContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      await createSession();
      setIsPaid(true);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const navigation = [
    { id: 'rights', label: selectedLanguage === 'spanish' ? 'Tus Derechos' : 'Your Rights', icon: Shield },
    { id: 'record', label: selectedLanguage === 'spanish' ? 'Grabar' : 'Quick Record', icon: Mic },
    { id: 'scripts', label: selectedLanguage === 'spanish' ? 'Scripts IA' : 'AI Scripts', icon: FileText },
    { 
      id: 'profile', 
      label: isAuthenticated 
        ? (selectedLanguage === 'spanish' ? 'Perfil' : 'Profile')
        : (selectedLanguage === 'spanish' ? 'Iniciar Sesión' : 'Sign In'), 
      icon: isAuthenticated ? User : LogIn 
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rights':
        return (
          <KnowYourRights 
            legalContent={legalContent}
            selectedLanguage={selectedLanguage}
            userLocation={userLocation}
            loading={loading}
          />
        );
      case 'record':
        return <QuickRecord userLocation={userLocation} />;
      case 'scripts':
        return (
          <AIScriptGenerator 
            selectedLanguage={selectedLanguage}
            isPaid={isPaid}
            onPayment={handlePayment}
          />
        );
      case 'profile':
        if (!isAuthenticated) {
          return (
            <div className="py-8">
              {authMode === 'register' ? (
                <UserRegistration
                  selectedLanguage={selectedLanguage}
                  onSuccess={() => {
                    setAuthMode('login');
                    setCurrentView('rights');
                  }}
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="card">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-text">
                        {selectedLanguage === 'spanish' ? 'Iniciar Sesión' : 'Sign In'}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {selectedLanguage === 'spanish'
                          ? 'Accede a tu cuenta para usar todas las funciones'
                          : 'Access your account to use all features'}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => setAuthMode('register')}
                        className="w-full btn-primary"
                      >
                        {selectedLanguage === 'spanish' ? 'Crear Cuenta' : 'Create Account'}
                      </button>
                      
                      <div className="text-center">
                        <p className="text-gray-600">
                          {selectedLanguage === 'spanish' ? '¿Ya tienes cuenta?' : 'Already have an account?'}
                        </p>
                        <button className="text-primary hover:underline font-medium">
                          {selectedLanguage === 'spanish' ? 'Iniciar Sesión' : 'Sign In'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
        
        return <UserProfile selectedLanguage={selectedLanguage} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppShell 
        navigation={navigation}
        currentView={currentView}
        onNavigate={setCurrentView}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        userLocation={userLocation}
      >
        {renderCurrentView()}
      </AppShell>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
}

export default App;
