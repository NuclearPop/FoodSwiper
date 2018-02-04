const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const connection = mysql.createConnection({
  host: 'db.liyinxue.com',
  user: 'wenzhuow',
  password: '12345',
  database: 'foodswiper',
});
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const router = express.Router()

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
app.use(staticFiles)

router.get('/api/getfood', (req, res) => {
  connection.query('SELECT food_name FROM food', function(err, result){
    res.send({ express: result});
  });
});

router.get('/api/getaccount', (req, res) => {
  connection.query('SELECT acct_id FROM accounts WHERE acct_name = "wenzhuow"and password = "123"', function(err, result){
    res.send({ express: result});
  });
});

router.post('/api/check_account', (req, res) => {
  var user = req.body;
  var sql = 'SELECT acct_id FROM accounts WHERE acct_name = ? and password = ?';
  connection.query(sql, [user.name, user.password], function(err, result){
    console.log(result);
    if (result.length > 0) {
      res.send({express: result});
    } else {
      res.end('Fail');
    }
  })
});

router.post('api/add_favor'), (req, res) => {
  var list = req.body;
  if (list.id != 'None') {
    connection.query('SELECT favourites ')
  }
}


app.use(router)

// any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})
