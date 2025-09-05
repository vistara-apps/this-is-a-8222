// Comprehensive legal content for all US states
export const legalContentDatabase = {
  // Federal rights that apply everywhere
  federal: {
    state: 'FEDERAL',
    content_english: {
      title: 'Your Constitutional Rights',
      rights: [
        'You have the right to remain silent',
        'You have the right to an attorney',
        'You have the right to refuse searches without a warrant',
        'You have the right to record police interactions in public',
        'You cannot be detained without reasonable suspicion'
      ],
      scripts: {
        traffic_stop: "Officer, I'm exercising my right to remain silent. I do not consent to any searches. Am I free to go?",
        questioning: "I'm invoking my right to remain silent and my right to an attorney. I do not wish to answer questions without my lawyer present.",
        search_request: "I do not consent to any searches of my person, belongings, or vehicle. I'm exercising my Fourth Amendment rights."
      }
    },
    content_spanish: {
      title: 'Sus Derechos Constitucionales',
      rights: [
        'Tiene derecho a permanecer en silencio',
        'Tiene derecho a un abogado',
        'Tiene derecho a rechazar registros sin una orden judicial',
        'Tiene derecho a grabar interacciones policiales en público',
        'No puede ser detenido sin sospecha razonable'
      ],
      scripts: {
        traffic_stop: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro. ¿Soy libre de irme?",
        questioning: "Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado. No deseo responder preguntas sin mi abogado presente.",
        search_request: "No consiento ningún registro de mi persona, pertenencias o vehículo. Estoy ejerciendo mis derechos de la Cuarta Enmienda."
      }
    }
  },

  // State-specific content
  CA: {
    state: 'California',
    content_english: {
      title: 'California Rights & Laws',
      rights: [
        'California has strong privacy protections',
        'You can record police in public without interference',
        'Stop and frisk requires reasonable suspicion',
        'You have the right to know why you\'re being stopped',
        'Medical marijuana is legal with proper documentation'
      ],
      scripts: {
        traffic_stop: "Officer, I'm exercising my right to remain silent under California law. I do not consent to searches. May I see your badge number?",
        questioning: "Under California Penal Code 148, I'm not required to provide information beyond identification during a lawful detention.",
        search_request: "I do not consent to searches. California requires a warrant or exigent circumstances for vehicle searches."
      },
      specific_laws: [
        'Penal Code 148 - Resisting/Delaying Officer',
        'Vehicle Code 40302 - Traffic Stop Procedures',
        'Civil Code 1708.8 - Right to Record'
      ]
    },
    content_spanish: {
      title: 'Derechos y Leyes de California',
      rights: [
        'California tiene fuertes protecciones de privacidad',
        'Puede grabar a la policía en público sin interferencia',
        'Parar y registrar requiere sospecha razonable',
        'Tiene derecho a saber por qué lo están deteniendo',
        'La marihuana medicinal es legal con documentación apropiada'
      ],
      scripts: {
        traffic_stop: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio bajo la ley de California. No consiento registros. ¿Puedo ver su número de placa?",
        questioning: "Bajo el Código Penal 148 de California, no estoy obligado a proporcionar información más allá de la identificación durante una detención legal.",
        search_request: "No consiento registros. California requiere una orden judicial o circunstancias exigentes para registros de vehículos."
      }
    }
  },

  TX: {
    state: 'Texas',
    content_english: {
      title: 'Texas Rights & Laws',
      rights: [
        'Texas has "Stop and Identify" laws',
        'You must provide ID if lawfully detained',
        'Open carry is legal with proper license',
        'Castle Doctrine protects your home',
        'You can record police interactions'
      ],
      scripts: {
        traffic_stop: "Officer, I understand Texas law requires ID during lawful detention. I'm providing my identification but exercising my right to remain silent otherwise.",
        questioning: "I'm invoking my right to remain silent under the Fifth Amendment. I will provide required identification under Texas Code of Criminal Procedure 38.02.",
        search_request: "I do not consent to searches beyond what's required by Texas law. Do you have a warrant or probable cause?"
      },
      specific_laws: [
        'Code of Criminal Procedure 38.02 - Failure to Identify',
        'Penal Code 46.02 - Unlawful Carrying Weapons',
        'Government Code 423.002 - Right to Record'
      ]
    },
    content_spanish: {
      title: 'Derechos y Leyes de Texas',
      rights: [
        'Texas tiene leyes de "Parar e Identificar"',
        'Debe proporcionar identificación si es detenido legalmente',
        'Portar armas abiertamente es legal con licencia apropiada',
        'La Doctrina del Castillo protege su hogar',
        'Puede grabar interacciones policiales'
      ],
      scripts: {
        traffic_stop: "Oficial, entiendo que la ley de Texas requiere identificación durante detención legal. Proporciono mi identificación pero ejerzo mi derecho a permanecer en silencio de otra manera.",
        questioning: "Estoy invocando mi derecho a permanecer en silencio bajo la Quinta Enmienda. Proporcionaré identificación requerida bajo el Código de Procedimiento Criminal 38.02 de Texas.",
        search_request: "No consiento registros más allá de lo requerido por la ley de Texas. ¿Tiene una orden judicial o causa probable?"
      }
    }
  },

  NY: {
    state: 'New York',
    content_english: {
      title: 'New York Rights & Laws',
      rights: [
        'Stop and frisk requires reasonable suspicion',
        'You have the right to record police',
        'Marijuana possession under 3oz is decriminalized',
        'You can refuse consent to search',
        'Police must inform you of Miranda rights before custodial interrogation'
      ],
      scripts: {
        traffic_stop: "Officer, I'm exercising my right to remain silent. I do not consent to searches. Under New York law, am I being detained or am I free to go?",
        questioning: "I'm invoking my right to remain silent and my right to counsel under New York Criminal Procedure Law. I will not answer questions without an attorney.",
        search_request: "I do not consent to any searches. New York requires reasonable suspicion for stops and probable cause for searches."
      },
      specific_laws: [
        'CPL 140.50 - Temporary Questioning',
        'CPL 60.45 - Rules of Evidence',
        'Civil Rights Law 79-n - Right to Record'
      ]
    },
    content_spanish: {
      title: 'Derechos y Leyes de Nueva York',
      rights: [
        'Parar y registrar requiere sospecha razonable',
        'Tiene derecho a grabar a la policía',
        'Posesión de marihuana bajo 3oz está despenalizada',
        'Puede rechazar consentimiento para registros',
        'La policía debe informarle de los derechos Miranda antes del interrogatorio bajo custodia'
      ],
      scripts: {
        traffic_stop: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento registros. Bajo la ley de Nueva York, ¿estoy siendo detenido o soy libre de irme?",
        questioning: "Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado bajo la Ley de Procedimiento Criminal de Nueva York. No responderé preguntas sin un abogado.",
        search_request: "No consiento ningún registro. Nueva York requiere sospecha razonable para paradas y causa probable para registros."
      }
    }
  }
};

// Helper function to get content for a specific state
export const getLegalContent = (state, language = 'english') => {
  const stateCode = state?.toUpperCase();
  const content = legalContentDatabase[stateCode];
  
  if (!content) {
    // Return federal content as fallback
    return legalContentDatabase.federal[`content_${language}`];
  }
  
  return content[`content_${language}`];
};

// Get all available states
export const getAvailableStates = () => {
  return Object.keys(legalContentDatabase).filter(key => key !== 'federal');
};

export default legalContentDatabase;
