const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const userController = require('./users/user-controller');
const strategyController = require('./strategies/strategy-controller');
const tradeController = require('./trades/trade-controller');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.all('/users', userController);
app.all('/strategy', strategyController);
app.all('/trades', tradeController);

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));