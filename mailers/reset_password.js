const nodeMailer = require('../config/nodemailer');

exports.resetPassword = (email, token) => {
  nodeMailer.transporter.sendMail(
    {
      from: 'guyguy5050@gmail.com',
      to: email,
      subject: 'Reset Account Password Link!',
      // text: 'Hello world?',
      html: `<h3>Please Click the link below to reset your password</h3>
      <a href="localhost:8000/users/resetpassword/${token}" target="_blank">localhost:8000/users/resetpassword/${token}</a>`,
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending email (reset password)', err);
        return;
      }

      console.log('Message sent (reset password)', info);
      return;
    }
  );
};
