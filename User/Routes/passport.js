import express from "express";
import passport from "passport";
import {} from "#user/Service/passport.js";
const Router = express.Router();

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    Router.get("/google", passport.authenticate("google", { scope: ["email"], session: false }));
    Router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google", session: false }), (req, res) => {
        const { accessToken, refreshToken } = req.user;
        return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    });
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    Router.get("/github", passport.authenticate("github"));
    Router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/auth/github", session: false }), (req, res) => {
        const { accessToken, refreshToken } = req.user;
        return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    });
}

if (process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET) {
    Router.get("/linkedin", passport.authenticate("linkedin"));
    Router.get("/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/auth/linkedin", session: false }), (req, res) => {
        console.log("saransh", "callback");
        const { accessToken, refreshToken } = req.user;
        return res.redirect(`${process.env.WEBSITE_HOME}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    });
}
export default Router;
