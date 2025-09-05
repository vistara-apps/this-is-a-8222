import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const AppShell = ({ 
  children, 
  navigation, 
  currentView, 
  onNavigate, 
  selectedLanguage, 
  onLanguageChange,
  userLocation 
}) => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S&S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">Shield & Speak</h1>
                <p className="text-sm text-gray-500">Know your rights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => onLanguageChange(e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-surface"
                >
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                </select>
              </div>
              
              {/* Location Display */}
              {userLocation && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userLocation.state}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  currentView === id 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppShell;