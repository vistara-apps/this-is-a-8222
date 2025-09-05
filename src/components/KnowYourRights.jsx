import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import InfoCard from './InfoCard';

const KnowYourRights = ({ legalContent, selectedLanguage, userLocation, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rights information...</p>
        </div>
      </div>
    );
  }

  const content = legalContent || {
    state: userLocation?.state || 'Unknown',
    rights_summary: 'You have the right to remain silent, the right to an attorney, and the right to refuse searches without a warrant.',
    script_english: 'I am exercising my right to remain silent. I do not consent to any searches. I want to speak to a lawyer.',
    script_spanish: 'Estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ninguna búsqueda. Quiero hablar con un abogado.'
  };

  const script = selectedLanguage === 'spanish' ? content.script_spanish : content.script_english;

  const rightsPoints = [
    {
      icon: Shield,
      title: selectedLanguage === 'spanish' ? 'Derecho a permanecer en silencio' : 'Right to remain silent',
      description: selectedLanguage === 'spanish' 
        ? 'No tienes que responder preguntas más allá de tu identificación'
        : 'You do not have to answer questions beyond providing identification'
    },
    {
      icon: CheckCircle,
      title: selectedLanguage === 'spanish' ? 'Derecho a un abogado' : 'Right to an attorney',
      description: selectedLanguage === 'spanish'
        ? 'Puedes solicitar un abogado en cualquier momento'
        : 'You can request a lawyer at any time'
    },
    {
      icon: AlertTriangle,
      title: selectedLanguage === 'spanish' ? 'Rechazar búsquedas' : 'Refuse searches',
      description: selectedLanguage === 'spanish'
        ? 'Puedes rechazar búsquedas sin una orden judicial'
        : 'You can refuse searches without a warrant'
    }
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Location Banner */}
      <div className="bg-primary/10 rounded-lg p-4">
        <p className="text-primary font-semibold text-center">
          {selectedLanguage === 'spanish' 
            ? `Información legal para ${content.state}`
            : `Legal information for ${content.state}`}
        </p>
      </div>

      {/* Rights Summary */}
      <InfoCard variant="stateLaw" title={
        selectedLanguage === 'spanish' ? 'Tus Derechos' : 'Your Rights'
      }>
        <div className="space-y-4">
          {rightsPoints.map((right, index) => (
            <div key={index} className="flex items-start space-x-3">
              <right.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-text">{right.title}</h4>
                <p className="text-gray-600 text-sm">{right.description}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* What to Say Script */}
      <InfoCard variant="script" title={
        selectedLanguage === 'spanish' ? 'Qué Decir' : 'What to Say'
      }>
        <div className="bg-gray-50 rounded-md p-4 border-l-4 border-accent">
          <p className="font-medium text-text italic">"{script}"</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {selectedLanguage === 'spanish' 
            ? 'Mantén la calma, habla claramente y repite si es necesario.'
            : 'Stay calm, speak clearly, and repeat if necessary.'}
        </div>
      </InfoCard>

      {/* Important Reminders */}
      <InfoCard title={
        selectedLanguage === 'spanish' ? 'Recordatorios Importantes' : 'Important Reminders'
      }>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-accent">•</span>
            <span>
              {selectedLanguage === 'spanish'
                ? 'Mantén las manos visibles en todo momento'
                : 'Keep your hands visible at all times'}
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent">•</span>
            <span>
              {selectedLanguage === 'spanish'
                ? 'No resistas físicamente, incluso si no estás de acuerdo'
                : 'Do not physically resist, even if you disagree'}
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-accent">•</span>
            <span>
              {selectedLanguage === 'spanish'
                ? 'Documenta la interacción si es posible'
                : 'Document the interaction if possible'}
            </span>
          </li>
        </ul>
      </InfoCard>
    </div>
  );
};

export default KnowYourRights;