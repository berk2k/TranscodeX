const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const express = require('express');

const fs = require('fs');



const app = express();

app.use(express.json());

const jobRoutes = require('./routes/process.route');
app.use('/', jobRoutes);

module.exports = app;