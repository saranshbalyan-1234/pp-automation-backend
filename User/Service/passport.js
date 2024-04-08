import passport from "passport";
// const { Strategy: FacebookStrategy } = require('passport-facebook');
import { Strategy as GitHubStrategy } from "passport-github2";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { loginWithCredentals } from "./user.js";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";

/**
 * Sign in with Google.
 */
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    const googleStrategyConfig = new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "/auth/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, params, profile, done) => {
            try {
                // const email = profile.emails.find((el) => el.verified)?.value;
                const email = profile.emails[0]?.value;
                const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true });
                return done(null, loggedInUser);
            } catch (err) {
                return done(err);
            }
        }
    );
    passport.use("google", googleStrategyConfig);
}

/**
 * Sign in with GitHub.
 */
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    const githubStrategyConfig = new GitHubStrategy(
        {
            clientID: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: "/auth/github/callback",
            passReqToCallback: true,
            scope: ["user:email"],
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0]?.value;
                const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true });
                return done(null, loggedInUser);
            } catch (err) {
                return done(err);
            }
        }
    );
    passport.use("github", githubStrategyConfig);
}

/**
 * Sign in with LinkedIn.
 */
if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
    passport.use(
        new LinkedInStrategy(
            {
                clientID: process.env.LINKEDIN_ID,
                clientSecret: process.env.LINKEDIN_SECRET,
                callbackURL: `/auth/linkedin/callback`,
                scope: ["profile"],
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0]?.value;
                    const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true });
                    return done(null, loggedInUser);
                } catch (err) {
                    console.log(err);
                    return done(err);
                }
            }
        )
    );
}

/**
 * Sign in with Facebook.
 */
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_ID,
//   clientSecret: process.env.FACEBOOK_SECRET,
//   callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
//   profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
//   passReqToCallback: true
// }, async (req, accessToken, refreshToken, profile, done) => {
//   try {
//     if (req.user) {
//       const existingUser = await User.findOne({ facebook: profile.id });
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         return done(null, existingUser);
//       }
//       const user = await User.findById(req.user.id);
//       user.facebook = profile.id;
//       user.tokens.push({ kind: 'facebook', accessToken });
//       user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
//       user.profile.gender = user.profile.gender || profile._json.gender;
//       user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
//       await user.save();
//       req.flash('info', { msg: 'Facebook account has been linked.' });
//       return done(null, user);
//     }
//     const existingUser = await User.findOne({ facebook: profile.id });
//     if (existingUser) {
//       return done(null, existingUser);
//     }
//     const existingEmailUser = await User.findOne({ email: profile._json.email });
//     if (existingEmailUser) {
//       req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
//       return done(null, existingEmailUser);
//     }
//     const user = new User();
//     user.email = profile._json.email;
//     user.facebook = profile.id;
//     user.tokens.push({ kind: 'facebook', accessToken });
//     user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
//     user.profile.gender = profile._json.gender;
//     user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//     user.profile.location = profile._json.location ? profile._json.location.name : '';
//     await user.save();
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

export default {};
