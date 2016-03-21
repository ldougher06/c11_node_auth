'use strict';

const express = require('express');
const chalk = require('chalk');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const RedisStore = require('connect-redis')(session);
const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || 'logansecret';

const userRoutes = require('./lib/user/user.routes.js');

const app = express();

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: false}));

// override with POST having ?_method=DELETE in index.jade
app.use(methodOverride('_method'));

app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

// remember to place below session ^^
app.use(passport.initialize());
app.use(passport.session());

// logs the # of req or visits per path
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.visits[req.url]++
  console.log(req.session);
  next();
});

app.use(userRoutes);

app.locals.title = '';

// grabs the user.email and displays to '/', otherwise 'Guest'
// locals is available to all renderers, but only during the request
app.use((req, res, next) => {
  console.log(req.user);
  res.locals.user = req.user || { email: 'Guest' };
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

mongoose.connect('mongodb://localhost:27017/c11_node_auth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(chalk.magenta.bold('Node.js server started. ') + chalk.red.bold.bgYellow(`Listening on PORT ${PORT}`));
  });
});
