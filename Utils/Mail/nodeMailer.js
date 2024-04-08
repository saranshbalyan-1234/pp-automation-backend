import nodemailer from "nodemailer";
import { createToken } from "#utils/jwt.js";
import registerHTML from "#utils/Mail/HTML/register.js";
import resetPasswordHtml from "#utils/Mail/HTML/resetPassword.js";
var transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
    },
});

const sendMailApi = (req, res) => {
    /*  #swagger.tags = ["Mail"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    transporter.sendMail(req.body, function (error, info) {
        if (error) {
            return res.status(400).json({ error: error });
        } else {
            return res.status(200).json(info);
        }
    });
};
const sendMail = async (data, type) => {
    let mailOption = {
        to: "",
        subject: "",
        text: "",
        html: "",
    };
    let token = "";
    let link = "";
    switch (type) {
        case "customerRegister":
            token = createToken({ email: data.email }, process.env.JWT_VERIFICATION_SECRET);
            link = `${process.env.WEBSITE_HOME}/auth/verify-customer/${token}`;
            mailOption = {
                to: data.email,
                subject: "Customer Registration Successfull",
                html: registerHTML(data.name, link),
            };
            break;
        case "addUser":
            token = createToken({ email: data.email, tenant: data.tenant }, process.env.JWT_VERIFICATION_SECRET);
            link = `${process.env.WEBSITE_HOME}/auth/verify-user/${token}`;
            mailOption = {
                to: data.email,
                subject: "Registration Successfull",
                html: registerHTML(data.name, link),
            };
            console.log(link);
            break;
        case "reset-password":
            token = createToken({ email: data.email, tenant: data.tenant }, process.env.JWT_RESET_SECRET, process.env.JWT_RESET_EXPIRATION);
            link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
            mailOption = {
                to: data.email,
                subject: "Password Reset",
                html: resetPasswordHtml(data.name, link),
            };
            break;
    }
    transporter.sendMail({ ...mailOption, from: process.env.MAILER_FROM }, function (error, info) {
        if (error) {
            console.log(error);
            console.log("Failed to send email");
        } else {
            console.log(info);
            console.log("Email Sent");
        }
    });
};
export { sendMailApi, sendMail };
