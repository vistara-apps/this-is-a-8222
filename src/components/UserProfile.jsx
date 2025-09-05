import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit3, Save, X, Shield, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import EmergencyContacts from './EmergencyContacts';

const UserProfile = ({ selectedLanguage }) => {
  const { user, userProfile, updateProfile, signOut, isPremium, hasActiveSubscription } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        phone_number: userProfile.phone_number || ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccess(
        selectedLanguage === 'spanish' 
          ? 'Perfil actualizado exitosamente'
          : 'Profile updated successfully'
      );
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile?.full_name || '',
      phone_number: userProfile?.phone_number || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getSubscriptionStatus = () => {
    if (!userProfile) return 'free';
    
    const { subscription_status } = userProfile;
    return subscription_status || 'free';
  };

  const getSubscriptionBadge = () => {
    const status = getSubscriptionStatus();
    
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <Crown className="w-4 h-4" />
            <span>{selectedLanguage === 'spanish' ? 'Premium' : 'Premium'}</span>
          </div>
        );
      case 'trial':
        return (
          <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <Shield className="w-4 h-4" />
            <span>{selectedLanguage === 'spanish' ? 'Prueba' : 'Trial'}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            <User className="w-4 h-4" />
            <span>{selectedLanguage === 'spanish' ? 'Gratis' : 'Free'}</span>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">
          {selectedLanguage === 'spanish' 
            ? 'Por favor inicia sesión para ver tu perfil'
            : 'Please sign in to view your profile'}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {selectedLanguage === 'spanish' ? 'Mi Perfil' : 'My Profile'}
        </h2>
        <p className="text-gray-600">
          {selectedLanguage === 'spanish'
            ? 'Gestiona tu información personal y configuración'
            : 'Manage your personal information and settings'}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {selectedLanguage === 'spanish' ? 'Información Personal' : 'Personal Information'}
          </h3>
          <div className="flex items-center space-x-3">
            {getSubscriptionBadge()}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-primary hover:text-primary/80"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">
                  {selectedLanguage === 'spanish' ? 'Editar' : 'Edit'}
                </span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedLanguage === 'spanish' ? 'Guardar' : 'Save'}
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedLanguage === 'spanish' ? 'Cancelar' : 'Cancel'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Correo Electrónico' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Nombre Completo' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-primary focus:border-transparent' 
                    : 'bg-gray-50 text-gray-600'
                }`}
                placeholder={
                  selectedLanguage === 'spanish' 
                    ? 'Ingresa tu nombre completo'
                    : 'Enter your full name'
                }
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Número de Teléfono' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-primary focus:border-transparent' 
                    : 'bg-gray-50 text-gray-600'
                }`}
                placeholder={
                  selectedLanguage === 'spanish' 
                    ? 'Ingresa tu número de teléfono'
                    : 'Enter your phone number'
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <EmergencyContacts selectedLanguage={selectedLanguage} />

      {/* Account Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {selectedLanguage === 'spanish' ? 'Acciones de Cuenta' : 'Account Actions'}
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={signOut}
            className="w-full btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          >
            {selectedLanguage === 'spanish' ? 'Cerrar Sesión' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="card bg-primary/5 border border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          {selectedLanguage === 'spanish' ? 'Estado de Suscripción' : 'Subscription Status'}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">
              {selectedLanguage === 'spanish' ? 'Plan Actual:' : 'Current Plan:'}
            </span>
            {getSubscriptionBadge()}
          </div>
          
          {userProfile?.subscription_expires_at && (
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                {selectedLanguage === 'spanish' ? 'Expira:' : 'Expires:'}
              </span>
              <span className="text-gray-600">
                {new Date(userProfile.subscription_expires_at).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {!isPremium && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                {selectedLanguage === 'spanish'
                  ? 'Actualiza a Premium para acceso completo a todas las funciones'
                  : 'Upgrade to Premium for full access to all features'}
              </p>
              <button className="btn-primary">
                {selectedLanguage === 'spanish' ? 'Actualizar a Premium' : 'Upgrade to Premium'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
