export {};

declare global {
  interface Window {
    google?: any;
    AppleID?: {
      auth: {
        init: (config: Record<string, unknown>) => void;
        signIn: () => Promise<any>;
      };
    };
    FB?: any;
    fbAsyncInit?: () => void;
  }
}
