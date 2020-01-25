const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const userController = require('./users/user-controller');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userController);

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));