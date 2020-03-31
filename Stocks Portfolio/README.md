# Final Project

## Portfolio Manager :chart:

To load the web-app, use your **Chrome** browser and open the **index.html** file included in this repository.

The app is pretty simple. I used bootstrap, ES6, jquery, and some css for mobile viewing.
I used the **DataTable** jquery plug-in to have easily sortable tables.
Please be patient when the page is loading, as fetching the information may take a couple of seconds.

### How-to :dollar:
Enter a stock ticker (AAPL, AMZN, IBM, etc.) into the search field, and click **request information** to learn more about it.
*Note:* If the symbol does not exist, an alert will pop up.

If you decide to purchase some shares, enter the number of shares into the form and click **buy**. Same goes for selling.
Your portfolio will be updated immidialy.

*Note:* The app will not let you sell more than you have. It will also remove a stock from your portfolio if the number of shares is 0.
Use clear portfolio to sell all of your stocks and start from scratch!

#### Design :woman_artist:
On the left side of the page you will find your portfolio that is saved from your last session. This will include the older stock prices and shares.
On the right side, you will find your up-to-date portfolio. This one will change as you buy and sell stocks. This way, you will be able to compare your older portfolio with your new one.

Try out sorting your portfolios by clicking the column headers!

#### Data Storage :floppy_disk:
I opted to store relevant data utilizing localStorage. Data pertaining to your portfolio will be preserved from session to session when logging back into the web-app.

#### Mobile :iphone:
For mobile viewing, I added .mobile-hide and .mobile-break classes to hide some attributes that are not essential for viewing, and centered some text making the mobile experience clearer.
Also, the columns order of the tables will switch when going on mobile, as the current portfolio will be viewed on top for ease of use.