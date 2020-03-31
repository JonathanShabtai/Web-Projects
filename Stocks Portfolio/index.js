// Initialize both tables to be sortable with DataTable plug-in
// Keep only sorting functionality
var table = $('#portfolio_table').DataTable( {
  "paging": false,
  "info": false,
  "bPaginate": false,
  "bFilter": false,
  "bSort": true,
});

var table_old = $('#portfolio_table_old').DataTable( {
  "paging": false,
  "info": false,
  "bPaginate": false,
  "bFilter": false,
  "bSort": true,
});

// Global variable for older portfolio
var total_value_old = 0;

// Using localStorage to access saved information
// Updates right table with newer prices, and left table with previous prices
async function load_storage_Portfolio() {
  if (localStorage.length !== 0) {
    var stocks = localStorage.getItem('myPortfolio');
    stocks = JSON.parse(stocks);
    var total_value = 0;
    total_value_old = 0;
    for (var i=0; i<stocks.length; i++) {
      var url = urlForProfile(stocks[i].symbol);
      // Left table
      table_old.row.add([stocks[i].symbol, stocks[i].price, stocks[i].shares, Math.floor(stocks[i].price * stocks[i].shares * 100) / 100] )
      .draw();
      total_value_old += (stocks[i].price * stocks[i].shares);
      
      // get latest price when loading
      stocks[i].price = await get_price(url, stocks[i].symbol);
      total_value += (stocks[i].price * stocks[i].shares);

      // Right table
      table.row.add([stocks[i].symbol, stocks[i].price, stocks[i].shares, Math.floor(stocks[i].price * stocks[i].shares * 100) / 100] )
      .draw();
    }
    total_value_old = (Math.floor(total_value_old * 100) / 100);
    total_value = (Math.floor(total_value * 100) / 100);
    document.querySelector("#portfolio_last_visit").innerHTML = `
      <p>Total (last-visit) portfolio value: ${total_value_old}</p>
      `;

    document.querySelector("#portfolio").innerHTML = `
      <p>Total portfolio value: ${total_value}</p>
      `;

    document.querySelector("#changes").innerHTML = `
      <p>Your total value has changed by: ${Math.floor(total_value - total_value_old)}</p>
      `;

    // Update localStorage with new prices
    addStockToPortfolio('myPortfolio', stocks);

  }
}

// Returns newest price for a given stock
async function get_price(url, stock_name) {
  let response = await fetch(url);
  if (response.status == 200) {
    let json = await response.json();
    let stock_data_price = await json.quote.latestPrice;
    return stock_data_price;
  }
  throw new Error(response.status);
}

// When page if loaded, also load existing portfolio
load_storage_Portfolio();

// API url builder
function urlForProfile(user_symbol) {
    const api_key_param = 'Tsk_63a76cf7c0e141a194fdcc2c6010960f';
    const base_url = `https://sandbox.iexapis.com`
    const api_url = `${base_url}/stable/stock/${user_symbol}/batch?types=quote,news,chart&range=1m&last=10&token=${api_key_param}`
    return api_url;
}

// Request Information button function
function searchStock() {
  var user_input = document.forms["myForm"]["stock_symbol"].value;
  if (user_input == "") {
    alert("Name must be filled out");
  }
  else {
    var url = urlForProfile(user_input);
    stockInfo(url, user_input).catch((error) => {
      console.error('Error:', error);
      alert("Stock symbol doesn't exist");
    });
  }
}

// Fetch information regarding a stock
async function stockInfo(url, stock_name) {
  let response = await fetch(url);

  if (response.status == 200) {
    let json = await response.json();
    let stock_data_symbol = json.quote.symbol;
    let stock_data_companyName = json.quote.companyName;
    let stock_data_price = json.quote.latestPrice;
    let stock_data_primaryExchange = json.quote.primaryExchange;
    let stock_data_change = json.quote.change;
    document.querySelector("#info").innerHTML = `
                <td>${stock_data_symbol}</td>
                <td class="mobile-hide">${stock_data_companyName}</td>
                <td>${stock_data_price}</td>
                <td class="mobile-hide">${stock_data_primaryExchange}</td>
                <td>${stock_data_change}`
    return json;
  }
  throw new Error(response.status);
}

// Create a stock object
function Stock(symbol, price, shares) {
  this.symbol = symbol;
  this.price = price;
  this.shares = shares;
}

// Buy and Sell button function
// sign is +1 for buying, and -1 for selling
function addOrRemoveStock(sign) {
  var user_input = document.forms["myForm"]["stock_symbol"].value;
  var num_shares = document.forms["myForm"]["num_shares"].value;

  // Error check
  if (num_shares == "" || isNaN(num_shares) || parseInt(num_shares) <= 0) {
    alert("Number of shares must be filled out with a positive number.");
    return;
  }

  num_shares = parseInt(num_shares);

  // Error check
  if (user_input == "") {
    alert("Name must be filled out");
  }
  else {
    addOrRemoveStock_api(user_input, num_shares, sign).catch((error) => {
      console.error('Error:', error);
      alert("Stock symbol doesn't exist");
    });
  }
}

// Creates new stock objects and updates portfolio
async function addOrRemoveStock_api(user_input, num_shares, sign) {
    url = urlForProfile(user_input);
    let response = await fetch(url);
    if (response.status == 200) {
      let json = await response.json();
      let stock_data_symbol = json.quote.symbol;
      let stock_data_price = json.quote.latestPrice;

      var stock_symbol = document.forms["myForm"]["stock_symbol"].value;
      stock_symbol = stock_symbol.toUpperCase();

      document.querySelector("#portfolio").innerHTML = ``;
      var total_value = 0;

      if (localStorage.length !== 0) {
        var stocks = localStorage.getItem('myPortfolio');
        stocks = JSON.parse(stocks);
      }
      else {
        var stocks = [];
      }

      // Error check
      if (stocks.length == 0) {
        if (sign > 0) {
          stock_instance = new Stock(stock_data_symbol, stock_data_price, num_shares);
          stocks.push(stock_instance);
        }
        // Stock doesn't exist in portfolio, and user wants to sell
        else {
          alert("Can't sell more than you have!");
        }
      }
      else {
        // if stock exists in portfoilo, update the shares to sum up
        // Would not detect the stock again, and create new - needs a fix
        var flag = true; // Indicates whether the stock doesn't exist in portfolio
        for (var i=0; i<stocks.length; i++) {
          if (stocks[i].symbol == stock_data_symbol) {
            stocks[i].price = stock_data_price;
            if ((stocks[i].shares + (sign) * parseInt(num_shares)) < 0) {
              alert("Can't sell more than you have!");
            }
            // Remove stock if its number of shares is 0
            else if ((stocks[i].shares + (sign) * parseInt(num_shares)) == 0) {
              stocks.splice(i,i+1);
              // Corner case in which all stocks are sold manually
              if (stocks.length == 0) {
                table.clear();
                table.draw();
              }
            }
            else {
              stocks[i].shares += (sign) * parseInt(num_shares);
            }
            flag = false;
          }
          // if stock doesn't exist in portfolio, create new. (Need to take care of negatives)
        }
        if (flag) {
          if (sign * num_shares < 0) {
            alert("Can't sell more than you have!");
          }
          else{
            stock_instance = new Stock(stock_data_symbol, stock_data_price, num_shares);
            stocks.push(stock_instance);            
          }
        }
      }
      clearStorage();
      console.log(stocks)
      addStockToPortfolio('myPortfolio', stocks);
      buildStocksPortfolioHtml(stocks);

      return json;
    }

    throw new Error(response.status);
  }

// Updates right table
function buildStocksPortfolioHtml(stocks) {
  var total_value = 0;
  table.clear();
  for (var i=0; i<stocks.length; i++) {
    total_value += (stocks[i].price * stocks[i].shares);
    table.row.add([stocks[i].symbol, stocks[i].price, stocks[i].shares, Math.floor(stocks[i].price * stocks[i].shares * 100) / 100] )
    .draw();
  }
  total_value = (Math.floor(total_value * 100) / 100);
  document.querySelector("#portfolio").innerHTML = `
    <p>Total portfolio value: ${total_value}</p>
    `;

  document.querySelector("#changes").innerHTML = `
  <p>Your total value has changed by: ${Math.floor(total_value - total_value_old)}</p>
  `;
}

function addStockToPortfolio(portfolio, stocks) {
  // convert object to a JSON string
  localStorage.setItem(portfolio, JSON.stringify(stocks));
  console.log('added ' + stocks + ' to portfolio');
}

function clearStorage() {
  localStorage.removeItem('myPortfolio');
}

// Clear Portfolio button function
function clearStorage_btn() {
  localStorage.removeItem('myPortfolio');
  document.querySelector("#portfolio_last_visit").innerHTML = `
  <p>Your portfolio has been cleared.</p>
  `;
  document.querySelector("#portfolio").innerHTML = `
  <p>Your portfolio has been cleared.</p>
  `;
    document.querySelector("#changes").innerHTML = `
  <p>Your portfolio has been cleared.</p>
  `;
  // Initialize all information
  total_value_old = 0;
  table_old.clear();
  table_old.draw();
  table.clear();
  table.draw();
}
