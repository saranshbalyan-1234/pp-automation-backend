import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { BasicStrategy } from 'passport-http';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

import { loginWithCredentals } from './user.service.js';

/**
 * Sign in with Username and Password.
 */
passport.use(new BasicStrategy(
  async (username, password, done) => {
    try {
      // eslint-disable-next-line sonarjs/no-duplicate-string
      const user = await loginWithCredentals({ email: username, password, rememberMe: true, tenant: process.env.DATABASE_PREFIX + process.env.DATABASE_NAME });
      if (!user) { return done(null, false); }
      return done(null, user);
    } catch (e) {
      return done(null, false);
    }
  }
));

/**
 * Sign in with Google.
 */
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  const googleStrategyConfig = new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, _params, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  );
  passport.use('google', googleStrategyConfig);
}

/**
 * Sign in with GitHub.
 */
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  const githubStrategyConfig = new GitHubStrategy(
    {
      callbackURL: '/auth/github/callback',
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      passReqToCallback: true,
      scope: ['user:email']
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
        return done(null, loggedInUser);
      } catch (err) {
        return done(err);
      }
    }
  );
  passport.use('github', githubStrategyConfig);
}

/**
 * Sign in with LinkedIn.
 */
if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        callbackURL: '/auth/linkedin/callback',
        clientID: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
        passReqToCallback: true,
        scope: ['profile']
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails[0]?.value;
          // eslint-disable-next-line sonarjs/no-duplicate-string
          const loggedInUser = await loginWithCredentals({ email, isPassRequired: false, rememberMe: true, tenant: req.headers['x-tenant-id'] });
          return done(null, loggedInUser);
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );
}

export default {};
