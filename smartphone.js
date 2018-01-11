var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ci sono solo 3 data type: Object, String e Number.
var SmartphoneSchema = new Schema({
	brand: String,
	model: String,
	price: Number
});

module.exports = mongoose.model('Smartphone', SmartphoneSchema);
