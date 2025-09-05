import React, { useState, useEffect } from 'react';
import { Shield, Mic, AlertTriangle, MapPin, Globe, FileText, User, Settings } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import AppShell from './components/AppShell';
import KnowYourRights from './components/KnowYourRights';
import QuickRecord from './components/QuickRecord';
import LocationService from './services/LocationService';
import LegalContentService from './services/LegalContentService';
import AIScriptGenerator from './services/AIScriptGenerator';
import { usePaymentContext } from './hooks/usePaymentContext';

function App() {
  const [currentView, setCurrentView] = useState('rights');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [legalContent, setLegalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const { createSession } = usePaymentContext();

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
    { id: 'rights', label: 'Your Rights', icon: Shield },
    { id: 'record', label: 'Quick Record', icon: Mic },
    { id: 'scripts', label: 'AI Scripts', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
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
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Wallet Connection</h3>
              <ConnectButton />
            </div>
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
              <p className="text-gray-600 mb-4">
                {isPaid ? 'Premium Member' : 'Free Plan'}
              </p>
              {!isPaid && (
                <button 
                  onClick={handlePayment}
                  className="btn-primary"
                >
                  Upgrade to Premium - $5/month
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
  );
}

export default App;