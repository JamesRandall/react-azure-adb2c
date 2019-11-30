// note on window.msal usage. There is little point holding the object constructed by new Msal.UserAgentApplication
// as the constructor for this class will make callbacks to the acquireToken function and these occur before
// any local assignment can take place. Not nice but its how it works.
import * as Msal from 'msal';
import React from 'react';

const logger = new Msal.Logger(loggerCallback, { level: Msal.LogLevel.Warning });
const state = {
  stopLoopingRedirect: false,
  launchApp: null,
  accessToken: null,
  scopes: []  
}
var appConfig = {
  instance: null,
  tenant: null,
  signInPolicy: null,
  resetPolicy: null,
  applicationId: null,
  cacheLocation: null,
  redirectUri: null,
  postLogoutRedirectUri: null
};

function loggerCallback(logLevel, message, piiLoggingEnabled) {
  console.log(message);
}

function authCallback(errorDesc, token, error, tokenType) {
  if (errorDesc && errorDesc.indexOf('AADB2C90118') > -1) {
    redirect();
  }
  else if (errorDesc) {
    console.log(error + ':' + errorDesc);
    state.stopLoopingRedirect = true;
  } else {
    acquireToken();
  }  
}

function redirect() {
  const localMsalApp = window.msal;
  localMsalApp.authority = `https://login.microsoftonline.com/tfp/${appConfig.tenant}/${appConfig.resetPolicy}`;
  acquireToken();
}

function acquireToken(successCallback) {
  const localMsalApp = window.msal; 
  const user = localMsalApp.getUser(state.scopes);
  if (!user) {
    localMsalApp.loginRedirect(state.scopes);
  }
  else {
    localMsalApp.acquireTokenSilent(state.scopes).then(accessToken => {
      state.accessToken = accessToken;
      if (state.launchApp) {
        state.launchApp();
      }
      if (successCallback) {
        successCallback();
      }
    }, error => {
      if (error) {
        localMsalApp.acquireTokenRedirect(state.scopes);
      }
    });
  }
  
}

const authentication = {
  initialize: (config) => {
    appConfig = config;
    const instance = config.instance ? config.instance : 'https://login.microsoftonline.com/tfp/';
    const authority = `${instance}${config.tenant}/${config.signInPolicy}`;
    var validateAuthority = instance.indexOf('b2clogin.com') === -1;
    let scopes = config.scopes;
    if (!scopes || scopes.length === 0) {
      console.log('To obtain access tokens you must specify one or more scopes. See https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-access-tokens');
      state.stopLoopingRedirect = true;
    }  
    state.scopes = scopes;
    
    new Msal.UserAgentApplication(config.applicationId,
      authority,
      authCallback,
      { logger: logger,
        cacheLocation: config.cacheLocation,
        postLogoutRedirectUri: config.postLogoutRedirectUri,
        redirectUri: config.redirectUri,
        validateAuthority: validateAuthority }
    );
  },
  run: (launchApp) => {
    state.launchApp = launchApp; 
    if (!window.msal.isCallback(window.location.hash) && window.parent === window && !window.opener) {
      if (!state.stopLoopingRedirect) {
        acquireToken();
      }    
    }
  },
  required: (WrappedComponent, renderLoading) =>  {
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          signedIn: false,
          error: null,
        };
      }

      componentWillMount() {
        acquireToken(() => {
          this.setState({
            signedIn: true
          });
        });        
      }

      render() {
        if (this.state.signedIn) {
          return (<WrappedComponent {...this.props} />);
        }
        return typeof renderLoading === 'function' ? renderLoading() : null;
      }
    };
  },
  signOut: () => window.msal.logout(),
  getAccessToken: () => state.accessToken
}

export default authentication;