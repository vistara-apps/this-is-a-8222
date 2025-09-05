import React, { useState } from 'react';
import { MessageSquare, Zap, Lock } from 'lucide-react';
import OpenAI from 'openai';

const AIScriptGenerator = ({ selectedLanguage, isPaid, onPayment }) => {
  const [scenario, setScenario] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  });

  const scenarios = [
    {
      id: 'traffic_stop',
      label: selectedLanguage === 'spanish' ? 'Parada de Tráfico' : 'Traffic Stop',
      description: selectedLanguage === 'spanish' 
        ? 'Detenido por un oficial de policía mientras conduces'
        : 'Pulled over by a police officer while driving'
    },
    {
      id: 'pedestrian_stop',
      label: selectedLanguage === 'spanish' ? 'Parada Peatonal' : 'Pedestrian Stop',
      description: selectedLanguage === 'spanish'
        ? 'Abordado por la policía mientras caminas'
        : 'Approached by police while walking'
    },
    {
      id: 'home_visit',
      label: selectedLanguage === 'spanish' ? 'Visita Domiciliaria' : 'Home Visit',
      description: selectedLanguage === 'spanish'
        ? 'Policía en tu puerta o en tu propiedad'
        : 'Police at your door or on your property'
    },
    {
      id: 'workplace',
      label: selectedLanguage === 'spanish' ? 'En el Trabajo' : 'Workplace',
      description: selectedLanguage === 'spanish'
        ? 'Contacto policial en tu lugar de trabajo'
        : 'Police contact at your workplace'
    }
  ];

  const generateScript = async () => {
    if (!isPaid) {
      onPayment();
      return;
    }

    if (!scenario) {
      alert(selectedLanguage === 'spanish' 
        ? 'Por favor selecciona un escenario'
        : 'Please select a scenario');
      return;
    }

    setLoading(true);
    try {
      const selectedScenario = scenarios.find(s => s.id === scenario);
      const language = selectedLanguage === 'spanish' ? 'Spanish' : 'English';
      
      const prompt = `Generate a brief, legally sound script for someone interacting with police in this scenario: ${selectedScenario.description}. 

Requirements:
- Respond in ${language}
- Keep it concise (2-3 sentences max)
- Focus on constitutional rights
- Be respectful but firm
- Include key phrases about remaining silent, refusing searches, and requesting an attorney
- Make it practical for someone who might be nervous or stressed

Scenario: ${selectedScenario.description}`;

      const response = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: 'You are a legal expert helping people understand their rights during police interactions. Provide practical, constitutionally-sound advice that prioritizes safety and legal protection.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      setGeneratedScript(response.choices[0].message.content);
    } catch (error) {
      console.error('Failed to generate script:', error);
      setGeneratedScript(
        selectedLanguage === 'spanish' 
          ? 'Error al generar el guión. Por favor intenta de nuevo.'
          : 'Failed to generate script. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">AI Script Generator</h2>
        <p className="text-gray-600">
          {selectedLanguage === 'spanish'
            ? 'Obtén guiones personalizados para situaciones específicas'
            : 'Get personalized scripts for specific situations'}
        </p>
      </div>

      {!isPaid && (
        <div className="card bg-primary/10 border border-primary/20">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-primary">
                {selectedLanguage === 'spanish' ? 'Función Premium' : 'Premium Feature'}
              </h4>
              <p className="text-sm text-primary/80 mt-1">
                {selectedLanguage === 'spanish'
                  ? 'Desbloquea guiones de IA personalizados por $5/mes o $1 por documento'
                  : 'Unlock personalized AI scripts for $5/month or $1 per document'}
              </p>
              <button 
                onClick={onPayment}
                className="btn-primary mt-3"
              >
                {selectedLanguage === 'spanish' ? 'Desbloquear Ahora' : 'Unlock Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {selectedLanguage === 'spanish' ? 'Selecciona un Escenario' : 'Select a Scenario'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((scenarioOption) => (
            <label
              key={scenarioOption.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                scenario === scenarioOption.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="scenario"
                value={scenarioOption.id}
                checked={scenario === scenarioOption.id}
                onChange={(e) => setScenario(e.target.value)}
                className="sr-only"
              />
              <div>
                <h4 className="font-semibold text-text">{scenarioOption.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{scenarioOption.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateScript}
          disabled={loading || !scenario}
          className={`btn-primary flex items-center justify-center mx-auto ${
            loading || !scenario ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {selectedLanguage === 'spanish' ? 'Generando...' : 'Generating...'}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              {selectedLanguage === 'spanish' ? 'Generar Guión' : 'Generate Script'}
            </>
          )}
        </button>
      </div>

      {/* Generated Script */}
      {generatedScript && (
        <div className="card border-l-4 border-accent">
          <div className="flex items-start space-x-3 mb-3">
            <MessageSquare className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <h3 className="text-lg font-semibold">
              {selectedLanguage === 'spanish' ? 'Tu Guión Personalizado' : 'Your Personalized Script'}
            </h3>
          </div>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-text italic font-medium">"{generatedScript}"</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              {selectedLanguage === 'spanish'
                ? 'Recuerda: mantén la calma, habla claramente y repite si es necesario.'
                : 'Remember: stay calm, speak clearly, and repeat if necessary.'}
            </p>
          </div>
        </div>
      )}

      {/* Example Scripts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          {selectedLanguage === 'spanish' ? 'Ejemplos de Guiones' : 'Example Scripts'}
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-3">
            <h4 className="font-medium text-sm text-gray-800 mb-2">
              {selectedLanguage === 'spanish' ? 'Parada de Tráfico:' : 'Traffic Stop:'}
            </h4>
            <p className="text-sm italic">
              {selectedLanguage === 'spanish'
                ? '"Oficial, estoy ejerciendo mi derecho a permanecer en silencio. Aquí está mi licencia y registro. No consiento a ninguna búsqueda."'
                : '"Officer, I am exercising my right to remain silent. Here is my license and registration. I do not consent to any searches."'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-md p-3">
            <h4 className="font-medium text-sm text-gray-800 mb-2">
              {selectedLanguage === 'spanish' ? 'Encuentro General:' : 'General Encounter:'}
            </h4>
            <p className="text-sm italic">
              {selectedLanguage === 'spanish'
                ? '"Estoy ejerciendo mi derecho a permanecer en silencio y quiero hablar con un abogado antes de responder cualquier pregunta."'
                : '"I am exercising my right to remain silent and want to speak to a lawyer before answering any questions."'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScriptGenerator;