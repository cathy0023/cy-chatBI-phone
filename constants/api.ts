import Constants from 'expo-constants';

const API_BASE =
  Constants.expoConfig?.extra?.apiBase || 'http://localhost:3000';

export { API_BASE };
