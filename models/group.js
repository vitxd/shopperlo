var   db 			= require('./db.js').db
	, Schema		= require('./db.js').Schema
	, UserSchema 	= require('./user.js').schema
	, ItemSchema	= require('./item.js').schema
	;

Group = new Schema({
	'name': {
		type	: String,
		index	: {
			unique: true
		}
	},
	users 	: [UserSchema],
	list 	: [ItemSchema]
});

module.exports.schema = Group;
module.exports.Group  = db.model('Group', Group);