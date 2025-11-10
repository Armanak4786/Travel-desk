// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export let environment = {
  production: false,
  // apiUrl: 'https://portalgateway/gateway',
  // apiUrl: 'https://portalgatewaydev:447/gateway',
  // apiUrl: 'https://udcdevportalgateway:544/gateway',
  // apiUrl: "https://172.16.3.67:444/gateway",
  apiUrl: "https://devportalgateway.aurionpro.com/gateway",
  //apiUrl: "https://testudcportalgateway.aurionpro.com/gateway",
  // OIDC Config : Start
  // authority:
  //   "https://login.microsoftonline.com/2c4787bf-22ff-4192-bda2-7055d259e141",
  authority: "https://login10.fisglobal.com/idp/aurionpro",
  redirectUrl: window.location.origin + "/authentication/login",
  postLogoutRedirectUri: window.location.origin + "/post-logout",
  // clientId: "d4ea1b2b-7183-4465-a51a-d36e7f10ca69",

  // scope: "openid profile email User.Read",
  scope: "openid profile email offline_access",
  autoUserInfo: false,
  responseType: "code",
  silentRenew: true,
  useRefreshToken: true,
  secureRoutes: ["https://graph.microsoft.com/"],
  maxIdTokenIatOffsetAllowedInSeconds: 600,

  // for access token API call manually
  //original
  // clientId: 'AURPR.RESTAPI.IA',
  // client_secret: '~MA#0ola',
  grant_type: "client_credentials",
  //service 1
  // clientId: "SERVICEACCOUNT.1",
  // client_secret: "hF%Ichfff6g5",
  // service 2
  // clientId: 'SERVICEACCOUNT.2',
  // client_secret: 'tJ~C(5Yj2(C2',
  // OIDC Config : End
  client_id: "AURPRIA.RESTAPI.QA",
  client_secret: "1mn(rWme6wTa",
  // grant_type:"client_credentials"

  // OIDC logout
  FIS: true,
  revokeSessionUrlEntra:
    "https://graph.microsoft.com/v1.0/me/revokeSignInSessions",
  revokeAllTokenFIS:
    "https://login10.fisglobal.com/idp/aurionpro/rest/1.0/idptoken/delete/alltoken/me",
  ActiveClient: "UDCDO",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
