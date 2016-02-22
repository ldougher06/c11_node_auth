'use strict';

const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(chalk.magenta.bold('Node.js server started. ') + chalk.red.bold.bgYellow(`Listening on PORT ${PORT}`));
})
