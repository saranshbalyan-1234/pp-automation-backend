import nodemailer from 'nodemailer';

import { createToken } from '#utils/jwt.js';
import registerHTML from '#utils/Mail/HTML/register.js';
import resetPasswordHtml from '#utils/Mail/HTML/resetPassword.js';
const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.MAILER_PASS,
    user: process.env.MAILER_USER
  },
  service: process.env.MAILER_SERVICE
});

const sendMailApi = (req, res) => {
  /*
   *  #swagger.tags = ["Mail"]
   *  #swagger.security = [{"apiKeyAuth": []}]
   */
  transporter.sendMail(req.body, (error, info) => {
    if (error) {
      return res.status(400).json({ error });
    }
    return res.status(200).json(info);
  });
};
const sendMail = (data, type) => {
  let mailOption = {
    html: '',
    subject: '',
    text: '',
    to: ''
  };
  let token = '';
  let link = '';
  switch (type) {
    case 'customerRegister':
      token = createToken({ email: data.email }, process.env.JWT_VERIFICATION_SECRET);
      link = `${process.env.WEBSITE_HOME}/auth/verify-customer/${token}`;
      mailOption = {
        html: registerHTML(data.name, link),
        subject: 'Customer Registration Successfull',
        to: data.email
      };
      break;
    case 'addUser':
      token = createToken({ email: data.email, tenant: data.tenant }, process.env.JWT_VERIFICATION_SECRET);
      link = `${process.env.WEBSITE_HOME}/auth/verify-user/${token}`;
      mailOption = {
        html: registerHTML(data.name, link),
        subject: 'Registration Successfull',
        to: data.email
      };
      console.log(link);
      break;
    case 'reset-password':
      token = createToken({ email: data.email, tenant: data.tenant }, process.env.JWT_RESET_SECRET, process.env.JWT_RESET_EXPIRATION);
      link = `${process.env.WEBSITE_HOME}/reset-password/${token}`;
      mailOption = {
        html: resetPasswordHtml(data.name, link),
        subject: 'Password Reset',
        to: data.email
      };
      break;
    default:
      break;
  }
  transporter.sendMail({ ...mailOption, from: process.env.MAILER_FROM }, (error, info) => {
    if (error) {
      console.log(error);
      console.log('Failed to send email');
    } else {
      console.log(info);
      console.log('Email Sent');
    }
  });
};
export { sendMail, sendMailApi };
