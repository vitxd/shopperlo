var   db 		= require('./db.js').db
	, Schema	= require('./db.js').Schema
	, UserModel = require('./user.js').User
	, ItemModel	= require('./item.js').Item
	;

Group = new Schema({
	'name': {
		type	: String,
		index	: {
			unique: true
		}
	},
	users 	: [{
		type : Schema.ObjectId,
		ref : 'User'
	}],
	list 	: [{
		type : Schema.ObjectId,
		ref  : 'Item'
	}]
});

module.exports.schema = Group;
module.exports.Group  = db.model('Group', Group);