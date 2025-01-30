from requests_oauthlib import OAuth2Session
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.getenv("clientId")
client_secret = os.getenv("clientSecret")
redirect_url = os.getenv("redirectURL")

session = OAuth2Session(client_id, redirect_uri=redirect_url)

auth_base_url = "https://www.strava.com/oauth/authorize"
session.scope = ["profile:read_all"]
auth_link = session.authorization_url(auth_base_url)

print(f"click here -> {auth_link[0]}")

redirect_response = input(f"Paste redirect url here: ")



