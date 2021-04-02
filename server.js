const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API} = require('./config/config');

const corsWhitelist = ['http://localhost:8081', 'https://msc-nursery-app.herokuapp.com', 'http://localhost:8080'];

const corsOptions = {
  origin: function (origin, callback) {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

const app = express();

app.use(cors(corsOptions));

// parse requests of content-type application/json
app.use(bodyParser.json());

// parse requests of content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get('/', (req, res) => {
  res.json({message: 'Welcome to nursery app'});
});

require('./routes/nursery')(app);
require('./routes/child')(app);
require('./routes/journal')(app);
require('./routes/journal-type')(app);
require('./routes/user')(app);
require('./routes/auth')(app);
require('./routes/calendar')(app);

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: SENDGRID_API
  }
}));

app.post('/send', (req, res) => {
  const {name, email, message, subject} = req.body
  transporter.sendMail({
    to: email,
    from: email,
    subject: subject,
    html: `<h3>${name}</h3>
           <p>${message}</p>`
  }).then(resp => {
    console.log("email sent");
    res.json({resp})
  })
    .catch(err => {
      console.log(err)
    })
})


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});