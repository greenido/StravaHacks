/* 
 @Author: Ido Green
 @date: 9/6/2014
 
 * */

var strava = new require("strava")({
  //Todo: read it from conf file.
});

strava.athlete.activities.get({page: 2} ,function(err, res) {
  console.log("====== Fetching Our Activities ======");
  console.log(res);
  console.log("====== End ======");
  if (err) {
    console.log("Err: " + err);
  }
});

// Todo
// 1. Show the user the results
// 2. Ask for permission(s)
// 3. Push the results to an online DB (e.g. MongoDB, Sheets etc')
// 4. Keep track and set a reminder for the next update phase.
//
//


//strava.athlete.get(function(err, res) {
//  console.log(res);
//  if (err) {
//    console.log("Err: " + err);
//  }
//});
//    