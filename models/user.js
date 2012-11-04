var   db = require('./db.js').db
	, Schema = require('./db.js').Schema
	, crypto = require('crypto')
	;

User = new Schema({
	'username': {
		type: String,
		index: {
			unique: true
		}
	},
	'email': String,
	'hashed_password': String,
	'salt': String
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

User.method('getGroups', function(callback){
	var GroupSchema = require('./group.js').Group;
	GroupSchema.find({users: this.id}, function(err, results){
		callback(results);
	})
});

User.pre('save', function(next) {
	if (!this.password) {
		console.log('Dio cane');
		next(new Error('Invalid password'));
	} else {
		next();
	}
});

module.exports.User 	= db.model('user', User);
