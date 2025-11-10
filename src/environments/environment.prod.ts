export let environment = {
  production: true,
  // apiUrl: 'https://portalgateway/gateway',
  // apiUrl: 'https://portalgatewaydev:447/gateway',
  // apiUrl: 'http://udcportalgateway:5005/gateway',
  apiUrl: "",
  // OIDC Config : Start
  authority: "https://login10.fisglobal.com/idp/aurionpro",
  redirectUrl: window.location.origin + "/authentication/login",
  postLogoutRedirectUri: window.location.origin + "/post-logout",
  // clientId: 'AURPR.RESTAPI.IA',
  // clientId: 'AP.UDC.TEST',
  scope: "openid profile",
  autoUserInfo: false,
  responseType: "code",
  silentRenew: true,
  useRefreshToken: true,

  // other config options
  // logLevel: LogLevel.Debug,

  // for access token API call manually
  // client_secret: '~MA#0ola',
  grant_type: "client_credentials",

  // Only use in microsoft Entra
  secureRoutes: [""],
  maxIdTokenIatOffsetAllowedInSeconds: 600,
  // OIDC Config : End

  client_id: "AURPRIA.RESTAPI.QA",
  client_secret: "1mn(rWme6wTa",

  // OIDC logout
  FIS: true,
  revokeSessionUrlEntra:
    "https://graph.microsoft.com/v1.0/me/revokeSignInSessions",
  revokeAllTokenFIS:
    "https://login10.fisglobal.com/idp/aurionpro/rest/1.0/idptoken/delete/alltoken/me",
  ActiveClient: "UDCDO",
};
