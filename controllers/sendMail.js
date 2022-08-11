const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (name, to, url, txt, work) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  if (work === 'actvation') {
    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: to,
      subject: 'PIGION',
      html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style=" text-transform: capitalize;color: teal;">Hi ${name} </h2>
              <p>Thank You for signing up, we're excited to get you started on PIGION.
              </p>
              <p>Please click on the link below to activate your account.</p>
              
              <a href=${url} target='_blank' style="background: orange; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
          
              
              </div>
          `,
    };

    smtpTransport.sendMail(mailOptions, (err, infor) => {
      if (err) return err;
      return infor;
    });
  } else {
    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: to,
      subject: 'PIGION',
      html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style=" text-transform: capitalize;color: teal;">Hi ${name} </h2>
              <p>Someone has requested to change the password for your Crunchbase account.
               You can reset your password using the link below:
              </p>
              
              <a href=${url} target='_blank'>${url}</a>
              <p>If you did not request this password reset or think this reset was made in error, please contact us at contact@pigeon.com</p>
             
              <p>Thanks
              <br/>
              Team Pigeon
              </p>
              </div>
          `,
    };

    smtpTransport.sendMail(mailOptions, (err, infor) => {
      if (err) return err;
      return infor;
    });
  }
};

module.exports = sendEmail;
