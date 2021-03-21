const express                   = require('express');
app                             = express();
var bodyParser                  = require('body-parser');

const validator                 = require('./validator/validator');
//const controller                = require('./controllers');
const startupService            = require('./startupService');
const docsapp                     = require('./controllers/requests');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,accept-language');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.post('/get_requests',       validator.getRequests,           docsapp.getRequests);
app.post('/accept_booking',     validator.acceptBooking,         docsapp.acceptBooking);
app.post('/create_booking',     validator.createBooking,         docsapp.createBooking);
app.post('/get_all_requests',   validator.getAllRequests,        docsapp.getAllRequests);
startupService.initialize();