var nodemailer = require('nodemailer');
var mailid="parassehgal7338@gmail.com";
var username="Smartherd";
var r=Math.floor(100000 + Math.random() * 900000);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cuisinevotre24@gmail.com',
    pass: 'vcadmin@12345'
  }
});

var mailOptions = {
  from: 'cuisinevotre24@gmail.com',
  to: mailid,
  subject: 'Votre Cuisine-Verification Mail',
  html: '<h3>Hi '+username+'</h3><p>Your Verification code for Votre Cuisine is:</p><h3>'+r+'</h3>',       
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});