function carousel(url1, url2, url3) {
  fetch(url1).then((r) => r.json()).then((data) => {
    let pic_link = data.url;
    let image = document.querySelector("#carousel_img1");
    image.src = pic_link;
  })
  fetch(url2).then((r) => r.json()).then((data) => {
    let pic_link = data.url;
    let image = document.querySelector("#carousel_img2");
    image.src = pic_link;
  })
  fetch(url3).then((r) => r.json()).then((data) => {
    let pic_link = data.url;
    let image = document.querySelector("#carousel_img3");
    image.src = pic_link;
  })
}

var i;
var urls = [];
for (i = 0; i < 3; i++) {

  // pick random dates in 2019
  var random_month = Math.floor(Math.random() * (12) + 1);
  var random_day = Math.floor(Math.random() * (28) + 1);

  if (random_month < 10) {
    random_month = "0" + random_month;
  }
  if (random_day < 10) {
    random_day = "0" + random_day;
  }
  urls.push(`https://api.nasa.gov/planetary/apod?date=2019-${random_month}-${random_day}&api_key=dlvHeTxr75CURuyNnb4pc3yDGqMFFC92I7pdMepo`);
}

carousel(urls[0], urls[1], urls[2]);