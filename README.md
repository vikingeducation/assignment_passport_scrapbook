# Passport Scrapbook

## Introduction
This project implements various OAuth strategies to create a user "scrapbook" which gathers various information from each of the user's connected social media accounts.

## Technologies Used
OAuth, Passport, Node, Express, MongoDB

## Getting Started
This application uses Facebook, Instagram, GitHub, Twitter, and Spotify authentication strategies. To get this up and running on your local machine, you will need to set up developers accounts with each of these OAuth providers, then set them up in the root .env file in the following fashion:

```
SESSION_SECRET=VALUE_HERE
INSTAGRAM_APP_ID=VALUE_HERE
INSTAGRAM_APP_SECRET=VALUE_HERE
GITHUB_APP_ID=VALUE_HERE
GITHUB_APP_SECRET=VALUE_HERE
TWITTER_APP_ID=VALUE_HERE
TWITTER_APP_SECRET=VALUE_HERE
SPOTIFY_APP_ID=VALUE_HERE
SPOTIFY_APP_SECRET=VALUE_HERE
FACEBOOK_APP_ID=VALUE_HERE
FACEBOOK_APP_SECRET=VALUE_HERE
```