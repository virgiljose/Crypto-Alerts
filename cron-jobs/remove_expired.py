# Import mongoDB client to access mongoDB database
from pymongo import MongoClient

# Used to compare dates
from datetime import datetime

# MongoDB credentials
# Password withtheld in repository.
# See MongoDB documentation to set up your own MongoDB database to use with this program.
MDBPASSWORD = ''
MDBURL = f'mongodb+srv://root:{MDBPASSWORD}@cryptoalerts.8n8pz.mongodb.net/CryptoAlerts?retryWrites=true&w=majority'

# Connect to the MongoDB cluster
client = MongoClient(MDBURL)
# Retrieve the CryptoAlerts database (located within the cluster)
db = client['CryptoAlerts']
# Get the list of notifications
notificationList = db['notificationList']

# Get current datetime
curr_datetime = datetime.now()

# set days until expiry of notification
EXPIRY_DAYS = 29

# Iterate through every notification
for result in notificationList.find():

    # Get the timestamp for the given notification
    timestamp = result["timestamp"]
    # Convert timestamp into a datetime object
    notification_datetime = datetime.fromisoformat(timestamp)
    # Get elapsed time between time of notification and current time
    duration = curr_datetime - notification_datetime
    # Delete any expired notifications
    if duration.days > EXPIRY_DAYS:
        notificationList.remove(result)