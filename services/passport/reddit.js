//REDDIT STUFF
const passport = require("./index");
const request = require("request");

var redditComments;
var redditUser;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//REDDIT strategy
let { REDDIT_SECRET, REDDIT_ID } = process.env;
const RedditStrategy = require("passport-reddit").Strategy;

passport.use(
  new RedditStrategy(
    {
      clientID: "iYGqaEBjhTeT8w",
      clientSecret: "BX9aC5ltMyBfJNxnC-KkuGRyl5A",
      callbackURL: "http://localhost:3000/auth/reddit/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ redditId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
      // console.log(profile);
      // console.log(profile.comments);
      let newUrl =
        "https://www.reddit.com/user/" + profile.name + "/comments.json";
      // console.log(newUrl);
      let comments = new Promise(function(resolve) {
        request.get(newUrl, (req, res) => {
          console.log(JSON.parse(res.body));

          return resolve(JSON.parse(res.body));
        });
      }).then(returnedData => {
        redditComments = returnedData.data.children.map(comment => {
          let obj = {
            body: comment.data.body,
            link_title: comment.data.link_title
          };
          return obj;
        });
        redditUser = profile.name;
        return done(null, redditComments);
      });
    }
  )
);

/*
{ subreddit_id: 't5_2r0cn',
<   approved_at_utc: null,
<   edited: false,
<   banned_by: null,
<   removal_reason: null,
<   link_id: 't3_6twagu',
<   link_author: 'Wardcity',
<   likes: null,
<   replies: '',
<   user_reports: [],
<   saved: false,
<   id: 'dlo9adj',
<   banned_at_utc: null,
<   gilded: 0,
<   archived: false,
<   report_reasons: null,
<   author: 'testThingStuff',
<   num_comments: 31,
<   can_mod_post: false,
<   parent_id: 't3_6twagu',
<   score: 1,
<   approved_by: null,
<   over_18: false,
<   collapsed: false,
<   body: 'huh\n',
<   link_title: 'Girlfriend [31F] just kind of dropped an anvil on my head [28M]',
<   author_flair_css_class: null,
<   downs: 0,
<   is_submitter: false,
<   collapsed_reason: null,
<   body_html: '&lt;div class="md"&gt;&lt;p&gt;huh&lt;/p&gt;\n&lt;/div&gt;',
<   distinguished: null,
<   quarantine: false,
<   can_gild: true,
<   subreddit: 'relationship_advice',
<   name: 't1_dlo9adj',
<   score_hidden: true,
<   num_reports: null,
<   link_permalink: 'https://www.reddit.com/r/relationship_advice/comments/6twagu/girlfriend_31f_just_kind_of_dropped_an_anvil_on/',
<   stickied: false,
<   created: 1502862136,
<   author_flair_text: null,
<   link_url: 'https://www.reddit.com/r/relationship_advice/comments/6twagu/girlfriend_31f_just_kind_of_dropped_an_anvil_on/',
<   created_utc: 1502833336,
<   subreddit_name_prefixed: 'r/relationship_advice',
<   controversiality: 0,
<   mod_reports: [],
<   subreddit_type: 'public',
<   ups: 1 }
> undefined
>
*/
