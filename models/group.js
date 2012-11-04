var   db = require('./db.js').db
	, Schema = require('./db.js').Schema
	;

Group = new Schema({
	'name': {
		type	: String,
		index	: {
			unique: true
		}
	},
	users 	: [String],
	list 	: [{
		name 	: String,
		qty 	: Number,
		bought 	: Boolean,
		updated : {
			type	: Date,
			default : Date.now
		}
	}]
});

module.exports.Group = db.model('group', Group);