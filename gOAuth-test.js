/**
* Simple OAuth with Strava API.
* This current script is fetching from Strava:
  data.id, data.start_date_local , data.location_city, data.location_country , 
  data.name, data.distance, data.moving_time, data.elapsed_time ,  data.total_elevation_gain ,data.kudos_count, data.average_speed,
  data.achievement_count, data.type 
  
  and put it in a 'master sheet'.
  
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
// Fetching all the activities and put them inside our sheet of activities.
//
// @see: http://strava.github.io/api/v3/activities/#get-activities
//
function getActivities() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aSheet = ss.getSheetByName("Activities");
  
  var sService = getStravaService();
  
  var startLine = 2;
  var resPerPage = 100;
  
  for (var i=1; i < 200; i++) {
    Logger.log("** Fetching page: " + i);
    var response = UrlFetchApp.fetch('https://www.strava.com/api/v3/athlete/activities?per_page=' + resPerPage + '&page=' + i, {
       headers: { Authorization: 'Bearer ' + sService.getAccessToken() }
      });
    var jsonData = response.getContentText();
    //Logger.log("Now we can make requests to the Strava API.\n" + JSON.stringify(jsonData));

    var retCode = jsonToSheet(jsonData, startLine, aSheet);
    if (retCode == -1) {
      Logger.log("Goting to stop fetching on page: "+i+ " as we don't have any more activities");
      return;
    }
    startLine += resPerPage;
  }
}

//
//
//
function jsonToSheet(jsonData, startLine, sheet) {

  var dataSet = JSON.parse(jsonData);
  var rows = [];
  var data;
  if ( dataSet.length == 0) {
    Logger.log("No more activities on start line: "+startLine);
    return -1;
  }
  
  for (i = 0; i < dataSet.length; i++) {
    data = dataSet[i];
    rows.push([data.id, data.start_date_local , data.location_city, data.location_country , 
               data.name, data.distance, data.moving_time, data.elapsed_time ,  data.total_elevation_gain ,data.kudos_count, data.average_speed,
               data.achievement_count, data.type ]);
  }
  Logger.log("We got: " + rows.length + " activities");
  dataRange = sheet.getRange(startLine, 1, rows.length, 13);
  dataRange.setValues(rows);
  SpreadsheetApp.flush();
  return 0;
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
