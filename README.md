# Passport Scrapbook
Trying out [passport](http://www.passportjs.org/) strategies for Twitter, Facebook, and GitHub. Additionally, using the returned OAuth tokens to perform API requests.

The basic premise is that you can log in to the app with any of the three accounts. Once you have logged in, you will see your profile picture as well as some data from the chosen account. You can then link additional accounts to your app account, which will retrieve the associated picture and data as well. Magic!

## Quickstart
This project requires some significant setup to run as each of the three providers must be configured to allow this app to authenticate to it. You then must store the respective credentials in a `.env` file (or manually set them as environment variables). So yeah, there's no quickstart :p

## Tech Stuff
* Node
* Express
* Handlebars
* Mongoose
* Passport
    * Twitter
    * Facebook
    * GitHub
* APIs
    * Twitter
    * Facebook
    * GitHub
