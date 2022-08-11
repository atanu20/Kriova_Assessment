var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_key: process.env.SEND_GRID_API_KEY,
  },
};
var mailer = nodemailer.createTransport(sgTransport(options));

const sendEmailGrid = (name, to, url, txt, work) => {
  if (work === 'actvation') {
    var email = {
      from: process.env.SEND_GRID_MAIL,
      to: to,
      subject: 'KRIOVA ACCOUNT VERIFICATION',
      html: `
                          <div style="max-width: 700px;background-color:ghostwhite;box-shadow:0px 2px 15px black; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
                          <h2 style=" text-transform: capitalize;color: teal;">Hi ${name} </h2>
                          <p>Thank You for signing up, we're excited to get you started on KRIOVA.
                          </p>
                          <p>Please click on the link below to activate your account.</p>
                          
                          <a href=${url} target='_blank' style="background: #82d523; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
                      
                          
                          </div>
                      `,
    };
  } else {
    var email = {
      from: process.env.SEND_GRID_MAIL,
      to: to,
      subject: 'KRIOVA PASSWORD RESET VERIFICATION',
      html: `
      <div style="max-width: 700px; margin:auto;background-color:ghostwhite;box-shadow:0px 2px 5px grey; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style=" text-transform: capitalize;color: teal;">Hi ${name} </h2>
              <p>Someone has requested to change the password for your account.
               You can reset your password using the link below:
              </p>
              
              <a href=${url} target='_blank'>${url}</a>
              <p>If you did not request this password reset or think this reset was made in error, please contact us at contact@kriova.com</p>
             
              <p>Thanks
              <br/>
              Team Pigeon
              </p>
              </div>
                  `,
    };
  }

  mailer.sendMail(email, function (err, res) {
    if (err) {
      console.log(err);
    }
    console.log(res);
  });
};

module.exports = sendEmailGrid;
