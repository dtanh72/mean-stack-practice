var mongoose = require('mongoose');				// for working w/ our database
var Schema = mongoose.Schema;					
var bcrypt = require('bcrypt-nodejs');

// UserSchema
var userSchema = new Schema(
{
	name: String,
	username: 
	{
		type: String, 
		required: true, 
		index:
		{
			unique: true
		}
	},
	password:
	{
		type: String,
		required: true,
		select: false
	}
});

//hash the password before the user is saved
userSchema.pre('save', function(next)
{
	var user = this;
	
	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();
	
	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash)
	{
		if (err) return next(err);
		
		//changed the password to the hashed version
		user.password = hash;
		next();
	});	
});

// method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password)
{
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
};

// return the model
module.exports = mongoose.model('User', userSchema);