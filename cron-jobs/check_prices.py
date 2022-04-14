# This file performs a cron job on Raspberry PI - at regular intervals:
# (1) Retrieves the alert list for a given user from the MongoDB database
# (2) Then sends an HTML request to AlphaVantage
# (3) Compares the HTML response to the alert conditions
# (4) Updates the alert notification list in the database

# Import requests library in order to send HTML requests to AlphaVantage API
import requests

# Password withheld in repository.
APIKEY = ''
APIURL = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&'

# Import mongoDB client to access mongoDB database
from pymongo import MongoClient

# MongoDB credentials
# Password withtheld in repository.
# See MongoDB documentation to set up your own MongoDB database to use with this program.
MDBPASSWORD = ''
MDBURL = f'mongodb+srv://root:{MDBPASSWORD}@cryptoalerts.8n8pz.mongodb.net/CryptoAlerts?retryWrites=true&w=majority'

# Connect to the MongoDB cluster
client = MongoClient(MDBURL)
# Retrieve the CryptoAlerts database (located within the cluster)
db = client['CryptoAlerts']
# Retrieve the list of alerts in the database
alertList = db['alertList']
# Get the list of notifications; insert new notifications here
notificationList = db['notificationList']

# Iterate through every alert (from every user):
for result in alertList.find():

    # Get the ticker and alert conditions of the cryptoasset
    username, ticker, alert_price, direction = result["username"], result["ticker"], result["price"], result["direction"]

    # Send an HTML request to Alpha Vantage
    request = APIURL + f"from_currency={ticker}&to_currency=USD&apikey={APIKEY}"
    r = requests.get(request)
    data = r.json()
    if data:
        curr_price = float(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
        timestamp = data['Realtime Currency Exchange Rate']['6. Last Refreshed']

        # Compare the price to the alert condition
        # If condition is met, store notification in database
        if (direction and (curr_price > alert_price)) or ((not direction) and (curr_price < alert_price)):
            notificationList.insert_one({ "ticker": ticker, "alertPrice": alert_price, "currPrice": curr_price, "direction": direction, "username": username, "timestamp": timestamp })