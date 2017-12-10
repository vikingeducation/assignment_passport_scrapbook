const google = require('googleapis');
const calendar = google.calendar('v3');
const OAuth2 = google.auth.OAuth2;

let oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/google/callback'
);

oauth2Client.generateAuthUrl({
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  approval_prompt: "force",
  access_type: 'offline'
});

const GoogleService = {
  getCalendarEvents: user => {
    return new Promise((resolve, reject) => {
      if (user.googleAccessToken) {
        oauth2Client.credentials.access_token = user.googleAccessToken;
        oauth2Client.credentials.refresh_token = user.googleRefreshToken;

        calendar.events.list({
          auth: oauth2Client,
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 5,
          singleEvents: true,
          orderBy: 'startTime'
        },
        function(err, response) {
          if (err) {
            reject(err);
          } else {
            resolve(response.items);
          }
        });
      } else {
        resolve();
      }
    });
  }
};

module.exports = GoogleService;
