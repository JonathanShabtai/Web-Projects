// document.querySelector(".dropdown-menu").innerHTML = `<a class="dropdown-item" href="#"><span id="drop1">test</span></a>`;

// My api key:
// dlvHeTxr75CURuyNnb4pc3yDGqMFFC92I7pdMepo

// Finding today's date in yyyy-mm-dd format
function urlForNASA(date) {
    const api_key_param = 'api_key=dlvHeTxr75CURuyNnb4pc3yDGqMFFC92I7pdMepo';
    const base_url = `https://api.nasa.gov/planetary/apod`
    const api_url = `${base_url}?date=${date}&${api_key_param}`
    return api_url
}

const api_key_param = 'api_key=dlvHeTxr75CURuyNnb4pc3yDGqMFFC92I7pdMepo';

function get_formatted_date(num_of_days_ahead) {
  var date = new Date();
  date.setDate(date.getDate() + num_of_days_ahead);
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // month 0 is January
  if (month < 10) {
    month = "0" + month;
  }
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  return (`${year}-${month}-${day}`);
}

var today = get_formatted_date(0);
var future = get_formatted_date(7);

document.querySelector("#date").innerHTML = today;

const nasa_api_url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${future}&${api_key_param}`;

// Update table based upon the users pick
function update_info() {
  let astroid = new Object();
  var astroids = [];
  var miss_array = [];
  var diameter_array = [];
  var speed_array = [];
  var e = document.getElementById("metric");
  var metric = (e.options[e.selectedIndex].value); // Save user's choice
  fetch(nasa_api_url).then((r) => r.json()).then((data) => {
    if (metric == 'miss') {
      document.querySelector("#parameter").innerHTML = 'Miss Distance in Miles (closest to farthest)';
      for (var j in data.near_earth_objects) {
        for (var i in data.near_earth_objects[j]) {
          let name = data.near_earth_objects[j][i].name;
          let miss = parseInt(data.near_earth_objects[j][i].close_approach_data[0].miss_distance.miles);
          astroid[name] = miss;
          miss_array.push(parseInt(data.near_earth_objects[j][i].close_approach_data[0].miss_distance.miles));
        }
      }
      // Sort by metric from largest to smallest
      astroidSorted = Object.keys(astroid).sort(function(a,b){return astroid[a]-astroid[b]});
      answerString = ""
      // Update table's html
      for (var i = 0; i < 10; i++) {
        answerString += `<tr>
                <th scope="row">${i+1}</th>
                <td>${astroidSorted[i]}</td>
                <td>${astroid[astroidSorted[i]]}</td>
              </tr>`
      }
      document.querySelector("#result").innerHTML = answerString; 
    }

    if (metric == 'diameter') {
      document.querySelector("#parameter").innerHTML = 'Diameter in Miles';
      for (var j in data.near_earth_objects) {
        for (var i in data.near_earth_objects[j]) {
          let name = data.near_earth_objects[j][i].name;
          let diameter = (data.near_earth_objects[j][i].estimated_diameter.miles.estimated_diameter_max);
          astroid[name] = diameter;
          diameter_array.push(parseInt(data.near_earth_objects[j][i].estimated_diameter.miles.estimated_diameter_max));
        }
      }
      astroidSorted = Object.keys(astroid).sort(function(a,b){return astroid[a]-astroid[b]});
      astroidSorted = astroidSorted.reverse();
      answerString = ""
      for (var i = 0; i < 10; i++) {
        answerString += `<tr>
                <th scope="row">${i+1}</th>
                <td>${astroidSorted[i]}</td>
                <td>${astroid[astroidSorted[i]]}</td>
              </tr>`
      }
      document.querySelector("#result").innerHTML = answerString; 
    }

    if (metric == 'speed') {
      document.querySelector("#parameter").innerHTML = 'Speed in Miles per hour';
      for (var j in data.near_earth_objects) {
        for (var i in data.near_earth_objects[j]) {
          let name = data.near_earth_objects[j][i].name;
          let speed = parseInt(data.near_earth_objects[j][i].close_approach_data[0].relative_velocity.miles_per_hour);
          astroid[name] = speed;
          speed_array.push(parseInt(data.near_earth_objects[j][i].close_approach_data[0].relative_velocity.miles_per_hour));
        }
      }
      astroidSorted = Object.keys(astroid).sort(function(a,b){return astroid[a]-astroid[b]});
      astroidSorted = astroidSorted.reverse();
      answerString = ""
      for (var i = 0; i < 10; i++) {
        answerString += `<tr>
                <th scope="row">${i+1}</th>
                <td>${astroidSorted[i]}</td>
                <td>${astroid[astroidSorted[i]]}</td>
              </tr>`
      }
      document.querySelector("#result").innerHTML = answerString;
    }

    // In case user chooses the 'Choose below' default value again
    if (metric == 'nothing') {
      document.querySelector("#parameter").innerHTML = 'Choose again please!';
      document.querySelector("#result").innerHTML = '';
    }
  })
}