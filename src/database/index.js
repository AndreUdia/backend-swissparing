const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/swissparingbd', { useMongoCliente: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;