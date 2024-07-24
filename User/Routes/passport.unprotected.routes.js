import express from 'express';
import passport from 'passport';

import {} from '#user/Service/passport.js';
const Router = express.Router();

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  Router.get('/google', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/google"
     */
    next();
  }, passport.authenticate('google', { scope: ['email'], session: false }));

  Router.get('/google/callback', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/google/callback"
     */
    next();
  }, passport.authenticate('google', { failureRedirect: '/auth/google', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  Router.get('/github', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/github"
     */
    next();
  }, passport.authenticate('github'));
  Router.get('/github/callback', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/github/callback"
     */
    next();
  }, passport.authenticate('github', { failureRedirect: '/auth/github', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}

if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
  Router.get('/linkedin', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/linkedin"
     */
    next();
  }, passport.authenticate('linkedin'));
  Router.get('/linkedin/callback', (_req, _res, next) => {
    /*
     *#swagger.tags = ["Passport"]
     *#swagger.path = "/passport/linkedin/callback"
     */
    next();
  }, passport.authenticate('linkedin', { failureRedirect: '/auth/linkedin', session: false }), (req, res) => {
    const { accessToken, refreshToken } = req.user;
    return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  });
}
export default Router;
