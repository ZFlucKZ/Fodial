const nodeMailer = require('../config/nodemailer');

//* this is another way of exporting a method
exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate(
    { comment: comment },
    '/comments/new_comment.ejs'
  );

  nodeMailer.transporter.sendMail(
    {
      from: 'guyguy5050@gmail.com',
      to: comment.user.email,
      subject: 'New Comment Published!',
      // text: 'Hello world?',
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending email', err);
        return;
      }

      console.log('Message sent', info);
      return;
    }
  );
};
