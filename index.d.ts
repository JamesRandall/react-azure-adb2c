// Type definitions for react-azure-adb2c
// Project: react-azure-adb2c
// Definitions by: Gavin Barron <https://github.com/gavinbarron>

export = react_azure_adb2c;

interface AuthConfig {
    instance?: string;
    tenant: string;
    signInPolicy: string;
    resetPolicy?: string;
    applicationId: string;
    cacheLocation?: string;
    redirectUri?: string;
    postLogoutRedirectUri?: string;
    scopes: string[];
}
declare const react_azure_adb2c: {
    default: {
        initialize (config: AuthConfig): void;
        run(launchApp: any): void;
        required(WrappedComponent: any, renderLoading: any): (props: any) => any;
        signOut(): any;
        getAccessToken(): any;
    }
}