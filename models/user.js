var   db = require('./db.js').db
	, Schema = require('./db.js').Schema
	, crypto = require('crypto');

User = new Schema({
	username		: {
		type	: String,
		index	: {
			unique: true
		}
	},
	email			: String,
	hashed_password : String,
	salt			: String,
	groups 			: [{
		type : Schema.ObjectId,
		ref  : 'Group'
	}]
});

User.virtual('id')
	.get(function() {
		return this._id.toHexString();
	});

User.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function() { return this._password; });

User.method('authenticate', function(plainText) {
	return this.encryptPassword(plainText) === this.hashed_password;
});

User.method('makeSalt', function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

User.pre('save', function(next) {
	if (!this.salt || !this.hashed_password) {
		next(new Error('Invalid password'));
	} else {
		next();
	}
});

module.exports.schema	= User;
module.exports.User 	= db.model('User', User);
