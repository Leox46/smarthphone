var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Smartphone = require('./smartphone');

/*************************** INIZIALIZZAZIONE *****************************/
// instantiate express
const app = express();

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    //user: 'test', // non obbligatori, dato che sono già presenti nell'URI.
    //pass: 'test'
  };
mongoose.connect('mongodb://user:password@ds149865.mlab.com:49865/db_test', options); // MLAB
//mongoose.connect('mongodb://localhost:27017/GENERAL', options) // LOCALE

const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;
// get an instance of the express Router
var router = express.Router();
/***************************************************************************/

// test route to make sure everything is working
router.get('/', function (req, res) {
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Welcome to our API!!!!!!' });
});


router.route('/smartphones')

  // create a smartphone
  // accessed at POST http://localhost:8080/api/v1/smartphones
  .post(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // create a new instance of the smartphone model
    var smartphone = new Smartphone();
    // set the smartphones name (comes from the request)
    smartphone.brand = req.body.brand;
  	smartphone.model = req.body.model;
  	smartphone.price = req.body.price;

    // save the smartphone and check for errors
    smartphone.save(function (err) {
      if (err) { res.send(err); }
      res.json(smartphone);
    });
  })

  // get all the smartphones
  // accessed at GET http://localhost:8080/api/v1/smartphones
  // variante: questo server risponde anche se gli viene specificata come query
  // del GET lo brand, ritornando tutti gli smartphone con lo brand specificato.
  // accessed at GET http://localhost:8080/api/v1/smartphones/?brand=177928
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    if(req.query.brand == null) { // se NON è specificato lo brand, allora ritorno tutti gli smartphones
      Smartphone.find(function (err, smartphones) {
        if (err) { res.send(err); }
        res.json(smartphones);
      });
    }
    else {
      Smartphone.find( {'brand': req.query.brand}, function (err, smartphones) {
        if (err) { res.send(err); }
        res.json(smartphones);
      });
    }
  });


// route /smartphones/smartphone
router.route('/smartphones/:smartphone_id')

  // get the smartphone with that id
  // (accessed at GET http://localhost:8080/api/smartphones/:smartphone_id)
  .get(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Smartphone.findOne( {'_id': req.params.smartphone_id}, function (err, smartphone) {
      if (err) { res.send(err); }
      res.json(smartphone);
    });
  })


  // update the smartphone with this id
  // (accessed at PUT http://localhost:8080/api/v1/smartphones/:smartphone_id)
  .put(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    // use our smartphone model to find the smartphone we want
    // ATTENZIONE!: usare findOne, e non find, altrimenti ritorna una collezione di oggetti, e bisogna estrarre il primo!
    Smartphone.findOne( {'_id': req.params.smartphone_id}, function (err, smartphone) {
      if (err) { res.send(err); }
      // update the smartphones info
      if(smartphone != null){
        if(req.body.brand != null) smartphone.brand = req.body.brand;
      	if(req.body.model != null) smartphone.model = req.body.model;
      	if(req.body.price != null) smartphone.price = req.body.price;
        // save the smartphone
        smartphone.save(function (err) {
          if (err) { res.send(err); }
          res.json(smartphone);
        });
      }
      else{
        res.status = 404;
        res.json({ error: { message: "Item Not Found" } });
      }
    });
  })


  // delete the smartphone with this id
  // (accessed at DELETE http://localhost:8080/api/v1/smartphones/:smartphone_id)
  .delete(function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    Smartphone.remove( {'_id': req.params.smartphone_id}, function (err, smartphone) {
      if (err) { res.send(err); }
      else{
        res.json({ message: 'Successfully deleted' });
      }
    });
  });



/*************************** MIDDLEWARE CORS ********************************/
// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening: ' + req.method);
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});
/**************************************************************************/

// register our router on /api
app.use('/api/v1', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = router;
