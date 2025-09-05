class LegalContentService {
  static legalContent = {
    'CA': {
      state: 'California',
      rights_summary: 'In California, you have the right to remain silent, refuse searches without a warrant, and request an attorney. California has strong privacy protections.',
      script_english: 'Officer, I am exercising my right to remain silent. I do not consent to any searches. I want to speak to a lawyer before answering any questions.',
      script_spanish: 'Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ninguna búsqueda. Quiero hablar con un abogado antes de responder cualquier pregunta.'
    },
    'TX': {
      state: 'Texas',
      rights_summary: 'In Texas, you have fundamental constitutional rights including the right to remain silent and refuse consent to searches without a warrant.',
      script_english: 'I am invoking my right to remain silent and my right to an attorney. I do not consent to any searches.',
      script_spanish: 'Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado. No consiento a ninguna búsqueda.'
    },
    'NY': {
      state: 'New York',
      rights_summary: 'New York law protects your right to remain silent, refuse searches, and have legal representation. Stop-and-frisk has specific limitations.',
      script_english: 'I am exercising my constitutional rights to remain silent and to have an attorney present. I do not consent to any searches.',
      script_spanish: 'Estoy ejerciendo mis derechos constitucionales a permanecer en silencio y a tener un abogado presente. No consiento a ninguna búsqueda.'
    }
  };

  static async getContentByState(state) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.legalContent[state] || this.legalContent['CA'];
  }

  static async getAllStates() {
    return Object.keys(this.legalContent);
  }
}

export default LegalContentService;