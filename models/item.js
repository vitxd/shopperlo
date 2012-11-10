var   db = require('./db.js').db
	, Schema = require('./db.js').Schema
	;

Item = new Schema({
	name 	: String,
	qty 	: Number,
	bought 	: Boolean,
	updated : {
		type	: Date,
		default : Date.now
	}
});

module.exports.schema = Item;
module.exports.Item   = db.model('Item', Item);