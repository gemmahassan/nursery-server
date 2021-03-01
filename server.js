const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// app.use(cors(corsOptions));

// parse requests of content-type application/json
app.use(bodyParser.json());

// parse requests of content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get('/', (req, res) => {
  res.json({message: 'Welcome to nursery app'});
});

require('./routes/staff')(app);
require('./routes/nursery')(app);
require('./routes/child')(app);
require('./routes/journal')(app);
require('./routes/journal-type')(app);
require('./routes/user')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});