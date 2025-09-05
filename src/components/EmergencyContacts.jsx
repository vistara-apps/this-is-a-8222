import React, { useState, useEffect } from 'react';
import { Plus, Phone, Mail, Edit3, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SupabaseService from '../services/SupabaseService';

const EmergencyContacts = ({ selectedLanguage }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contactsData = await SupabaseService.getEmergencyContacts(user.id);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      setError(
        selectedLanguage === 'spanish'
          ? 'Nombre y teléfono son requeridos'
          : 'Name and phone are required'
      );
      return;
    }

    try {
      const addedContact = await SupabaseService.addEmergencyContact(user.id, {
        name: newContact.name,
        phone_number: newContact.phone,
        email: newContact.email,
        relationship: newContact.relationship
      });

      setContacts(prev => [...prev, addedContact]);
      setNewContact({ name: '', phone: '', email: '', relationship: '' });
      setIsAdding(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateContact = async (contactId, updates) => {
    try {
      const updatedContact = await SupabaseService.updateEmergencyContact(contactId, {
        name: updates.name,
        phone_number: updates.phone,
        email: updates.email,
        relationship: updates.relationship
      });

      setContacts(prev => 
        prev.map(contact => 
          contact.id === contactId ? updatedContact : contact
        )
      );
      setEditingId(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm(
      selectedLanguage === 'spanish'
        ? '¿Estás seguro de que quieres eliminar este contacto?'
        : 'Are you sure you want to delete this contact?'
    )) {
      return;
    }

    try {
      await SupabaseService.deleteEmergencyContact(contactId);
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const ContactForm = ({ contact = {}, onSave, onCancel, isNew = false }) => {
    const [formData, setFormData] = useState({
      name: contact.name || '',
      phone: contact.phone_number || '',
      email: contact.email || '',
      relationship: contact.relationship || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Nombre' : 'Name'} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={
                selectedLanguage === 'spanish' ? 'Nombre del contacto' : 'Contact name'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Relación' : 'Relationship'}
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">
                {selectedLanguage === 'spanish' ? 'Seleccionar...' : 'Select...'}
              </option>
              <option value="family">
                {selectedLanguage === 'spanish' ? 'Familia' : 'Family'}
              </option>
              <option value="friend">
                {selectedLanguage === 'spanish' ? 'Amigo/a' : 'Friend'}
              </option>
              <option value="colleague">
                {selectedLanguage === 'spanish' ? 'Colega' : 'Colleague'}
              </option>
              <option value="lawyer">
                {selectedLanguage === 'spanish' ? 'Abogado/a' : 'Lawyer'}
              </option>
              <option value="other">
                {selectedLanguage === 'spanish' ? 'Otro' : 'Other'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Teléfono' : 'Phone'} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={
                selectedLanguage === 'spanish' ? 'Número de teléfono' : 'Phone number'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage === 'spanish' ? 'Email' : 'Email'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={
                selectedLanguage === 'spanish' ? 'Correo electrónico' : 'Email address'
              }
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>
              {selectedLanguage === 'spanish' ? 'Guardar' : 'Save'}
            </span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>
              {selectedLanguage === 'spanish' ? 'Cancelar' : 'Cancel'}
            </span>
          </button>
        </div>
      </form>
    );
  };

  if (!user) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {selectedLanguage === 'spanish' ? 'Contactos de Emergencia' : 'Emergency Contacts'}
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">
              {selectedLanguage === 'spanish' ? 'Agregar' : 'Add'}
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Add New Contact Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4">
            {selectedLanguage === 'spanish' ? 'Nuevo Contacto' : 'New Contact'}
          </h4>
          <ContactForm
            isNew
            onSave={handleAddContact}
            onCancel={() => {
              setIsAdding(false);
              setNewContact({ name: '', phone: '', email: '', relationship: '' });
              setError('');
            }}
          />
        </div>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {selectedLanguage === 'spanish'
              ? 'No tienes contactos de emergencia configurados'
              : 'No emergency contacts configured'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedLanguage === 'spanish'
              ? 'Agrega contactos que serán notificados en caso de emergencia'
              : 'Add contacts who will be notified in case of emergency'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === contact.id ? (
                <ContactForm
                  contact={contact}
                  onSave={(formData) => handleUpdateContact(contact.id, formData)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        {contact.relationship && (
                          <p className="text-sm text-gray-600 capitalize">
                            {contact.relationship}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone_number}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingId(contact.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">
              {selectedLanguage === 'spanish' ? 'Información Importante' : 'Important Information'}
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              {selectedLanguage === 'spanish'
                ? 'Estos contactos recibirán alertas automáticas cuando uses la función de grabación de emergencia. Asegúrate de que estén al tanto de este servicio.'
                : 'These contacts will receive automatic alerts when you use the emergency recording feature. Make sure they are aware of this service.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
