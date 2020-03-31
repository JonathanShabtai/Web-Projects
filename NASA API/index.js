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

// date formatter function
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

const nasa_api_url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${future}&${api_key_param}`;

// Getting essential quick facts
function quick_facts(url) {
  fetch(url).then((r) => r.json()).then((data) => {

    // next week number
    let num_asteroids = data.element_count
    document.querySelector("#num").innerHTML = num_asteroids

    // today's number
    let num_today = data.near_earth_objects[today].length
    document.querySelector("#num_today").innerHTML = num_today;

    // Finding the largest one today
    let max_mag = 0;
    $.each(data.near_earth_objects[today], function(index, value) {
      if (value.absolute_magnitude_h > max_mag) {
      max_mag = value.absolute_magnitude_h;
      }
    })
    document.querySelector("#largest").innerHTML = max_mag;
  })
}

quick_facts(nasa_api_url)

// function to control the picture of the day section
function photo(url) {
  fetch(url).then((r) => r.json()).then((data) => {

    let pic_title = data.title;
    document.querySelector("#space_image_title").innerHTML = pic_title;

    let pic_link = data.url;
    let image = document.querySelector("#pic_of_day img");
    image.src = pic_link;

    let pic_explain = data.explanation;
    document.querySelector("#pic_explaination").innerHTML = pic_explain;
  })
}

const nasa_api_picture = urlForNASA(today);
photo(nasa_api_picture)

// Update page to reflect hazardous astroids, dependent on user's day of choice
function update_info() {
  var dangerous_astroids = [];
  var e = document.getElementById("days");
  var days_ahead = (e.options[e.selectedIndex].value); // Get the day chosen
  days_ahead = parseInt(days_ahead);
  var picked_date = get_formatted_date(days_ahead);
  fetch(nasa_api_url).then((r) => r.json()).then((data) => {
    // Iterate over each astroid to find the hazardous ones
    $.each(data.near_earth_objects[picked_date], function(index, value) {
      if (value.is_potentially_hazardous_asteroid == true) {
        dangerous_astroids.push(value.name);
      }
      if (dangerous_astroids.length > 0) {
        document.querySelector("#actually_dangerous").innerHTML = (dangerous_astroids.toString());
        document.querySelector("#selected_date").innerHTML = `On date: ${picked_date}`;
      }
      else {
        document.querySelector("#actually_dangerous").innerHTML = `We're safe on ${picked_date}!`;
        document.querySelector("#selected_date").innerHTML = ``;
      }
  })
  })
}