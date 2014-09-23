/**
* Simple OAuth with Strava API.
*
* Author: Ido Green
* Date: Sep 2014
*
*/

/**
* Todo: Replace all the TODO with your project values.
*
*/
function getStravaService() {
  var projectKEY = 'TODO';
  var clientId = 'TODO';
  var accessToken = 'TODO';
  var clientSecret = 'TODO';
  return OAuth2.createService('strava')

      // Set the endpoint URLs
      .setAuthorizationBaseUrl('https://www.strava.com/oauth/authorize')
      .setTokenUrl('https://www.strava.com/oauth/token')

      // Set the client ID and secret
      .setClientId(clientId)
      .setClientSecret(clientSecret)

      // Set the project key of the script using this library.
      .setProjectKey(projectKEY)

      // Set the name of the callback function in the script referenced above that should be
      // invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      .setParam('approval_prompt', 'force')
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());

      // Set the scopes to request (space-separated for Google services).
      //.setScope('https://www.strava.com/oauth/');

}

//
//
//
function authCallback(request) {
  var sService = getStravaService();
  var isAuthorized = sService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

//
//
//
function showSidebar() {
  var sService = getStravaService();
  if ( !sService.hasAccess() ) {
    var authorizationUrl = sService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Refresh the page when authorization complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    DocumentApp.getUi().showSidebar(page);
  } else {
    Logger.log("showSidebar(): We got access!");
  }
}
