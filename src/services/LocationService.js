class LocationService {
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Simulate reverse geocoding - in real app, use a geocoding service
            const stateFromCoords = this.getStateFromCoordinates(latitude, longitude);
            
            resolve({
              latitude,
              longitude,
              state: stateFromCoords,
              city: 'Current City' // Would be resolved via geocoding API
            });
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          // Fallback to default location if permission denied
          resolve({
            latitude: 37.7749,
            longitude: -122.4194,
            state: 'CA',
            city: 'San Francisco'
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static getStateFromCoordinates(lat, lng) {
    // Simplified state detection based on coordinates
    // In a real app, use a proper geocoding service
    if (lat >= 32.5 && lat <= 42 && lng >= -124.4 && lng <= -114.1) return 'CA';
    if (lat >= 25.8 && lat <= 31 && lng >= -106.6 && lng <= -93.5) return 'TX';
    if (lat >= 40.5 && lat <= 45.0 && lng >= -79.8 && lng <= -71.8) return 'NY';
    if (lat >= 39.7 && lat <= 42.5 && lng >= -80.5 && lng <= -74.7) return 'PA';
    
    return 'CA'; // Default to California
  }
}

export default LocationService;