const express = require('express');
const bodyParser = require('body-parser');

// Controllers
const userController = require('./users/user-controller');
const strategyController = require('./strategies/strategy-controller');
const tradeController = require('./trades/trade-controller');
const checklistController = require('./checklist/checklist-controller.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.all('/users', userController);
app.all('/strategy', strategyController);
app.all('/trades', tradeController);
app.all('/checklist/:_strategyId', checklistController); // checklist will always have relationship with strategy
app.all('/checklist/:_fieldId', checklistController);

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));