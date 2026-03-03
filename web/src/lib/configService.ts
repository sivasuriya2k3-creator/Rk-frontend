import api from './api';

export interface GoogleConfig {
  clientId: string | null;
  enabled: boolean;
}

export interface AppleConfig {
  clientId: string | null;
  redirectURI: string | null;
  scopes: string | null;
  enabled: boolean;
}

export interface FacebookConfig {
  appId: string | null;
  version: string | null;
  enabled: boolean;
}

export interface SocialProviderConfig {
  google: GoogleConfig;
  apple: AppleConfig;
  facebook: FacebookConfig;
}

export const configService = {
  getPublicConfig: async (): Promise<SocialProviderConfig> => {
    const response = await api.get('/config/public');
    return response.data;
  }
};
