# README

Azure AD B2C is a cost effective identity provider covering social and enterprise logins but it can be awekward to integrate with - its documentation is not great and it using it involves ferreting around across multiple samples (not always working or complete), the ADAL library, and the MSAL library. Fun it is not.

I've focused this package on B2C although with minor changes it could be used more broadly. MSAL itself is rather generic but B2C has some specific requirements and I think half of the problem with the documentation is that you end up drifting across B2C and straight AD. I wanted to make things simpler for B2C.

Hopefully this will help people writing React apps. It makes use of MSAL underneath and the core of it (other than protecting routes) will probably work with other frameworks too but I use React at the moment. As it's an SPA my assumption in the library and documentation below is that you ultimately want to get an access token that you can use to call remote APIs. See this [Azure AD B2C post here](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-access-tokens) for details on how to set this up on the B2C side.

PRs welcome - lets make B2C easier to use!

## Initializing the Library

You'll first need to load the module and pass some configuration to the library. Normally this would go in your index.js file:

    import authentication from './react-azure-b2c';
    authentication.initialize({
        // optional, will default to this
        instance: 'https://login.microsoftonline.com/tfp/', 
        // your B2C tenant
        tenant: 'myb2ctenant.onmicrosoft.com',
        // the policy to use to sign in, can also be a sign up or sign in policy
        signInPolicy: 'mysigninpolicy',
        // the the B2C application you want to authenticate with (that's just a random GUID - get yours from the portal)
        applicationId: '75ee2b43-ad2c-4366-9b8f-84b7d19d776e',
        // where MSAL will store state - localStorage or sessionStorage
        cacheLocation: 'sessionStorage',
        // the scopes you want included in the access token
        scopes: ['https://headlessforumdev.onmicrosoft.com/management/admin']
    });
    
## Authenticating When The App Starts

If you want to set things up so that a user is authenticated as soon as they hit your app (for example if you've got a link to an app from a landing page) then 


## Thanks

To build this I made use of the B2C site, the [https://github.com/AzureAD/microsoft-authentication-library-for-js](MSAL library docs), the [react-adal source](https://github.com/salvoravida/react-adal) and this [React MSAL sample](https://github.com/sunilbandla/react-msal-sample). Thanks!
