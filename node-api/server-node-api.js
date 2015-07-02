// AUTHOR ANH DUONG
// =============================================

// CAL THE PACKAGES
// ---------------------------------------------
var express = require('express');	// call express
var app = express();				// define your app using express
var bodyparser = require('body-parser');		// get body-parser
var mongoose = require('mongoose');				// for working w/ our database
var morgan = require('morgan');					// used to see requests
var port = process.env.port || 56789;			// set the port for our app
var User = require('./app/models/user');
// create authentication with JSON WEB TOKEN
var jwt = require('jsonwebtoken');
var superSecret = 'talanhavodichtrolltrenthegioiaihonta';

mongoose.connect('mongodb://anh.duong:p1234567@192.168.10.125:27017/TEST_NODEJS');

// APP CONFIGURATION
// use body parser so we can grab information from POST requests
app.use(bodyparser.urlencoded(
{
	extended: true
}));
app.use(bodyparser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next)
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =============================================

// get an instance of the express router
var apiRouter = express.Router();

// Route to authenticate a user (POST http://localhost:56789/api/authenticate)
apiRouter.post('/authenticate', function(req, res) 
{
	User.findOne(
	{
		username: req.body.username
	}).select('name username password').exec(function(err, user)
	{
		if (err) throw err;
		
		if (!user)
		{
			res.json(
			{
				success: false,
				message: 'Authentication failed. User not found! '
			});
		}
		else if (user)
		{
			// check if password is matched
			var validPassword = user.comparePassword(req.body.password);
			
			if (!validPassword)
			{
				res.json(
				{
					success: false,
					message: 'Authentication failed. Wrong Password.'
				});
			}
			else 
			{
				// if user is found and password is right
				// create a token
				var token = jwt.sign(
				{
					name: user.name,
					username: user.username
				}, 
				superSecret, 
				{
					expiresInMinutes: 60		//1 hours
				});
				
				//return info included token JSON
				res.json(
				{
					success: true,
					message: 'Enjoy your token',
					token: token
				});
			}
		}
	})
});

// route middleware to verify a token
apiRouter.use(function(req, res, next)
{
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	// decode token
	if (token)
	{
		// verify secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded)
		{
			if (err) 
				return res.json(
				{
					success: false,
					message: 'Failed to authenticate token.'
				});
			else 
			{
				// if everything is good, save to request for use in other routes.
				console.log(decoded);
				
				req.decoded = decoded;
				
				next();
			}
		});
	}
	else 
	{
		// if there is no token
		// return the HTTP response of 403 (access forbidden) and an error message
		return res.status(403).send(
		{
			success: false,
			message: 'No token is provided'
		});
	}
})

// basic route for the home page
app.get('/', function(req, res) 
{
	res.send('Welcome to the home page');
});

// test route to make sure everything is working
// accessed at GET http://localhost:56789/api
apiRouter.get('/', function(req, res)
{
	res.json(
	{
		message: 'HOORAY! Welcome to our api!'
	});
});

// get user infomation
apiRouter.get('/userinfo', function(req, res)
{
	res.send(req.decoded);
});




//more routes for our API will happen here


// REGISTER ROUTES API
// =============================================

// middleware to use for all requests
//apiRouter.use('/', function(req, res, next)
//{
	// do logging
//	console.log('Somebody just came to our app!');
	
	// we'll add more to the middleware in Chapter 10
	// this is where we will authenticate users
	
	//make sure we go the next routes and don't stop here
//	next();
//});

apiRouter.route('/users')
	//create a user (accessed at POST http://localhost:56789/api/users)
	.post(function(req, res)
	{
		//create a new instance of the user model
		var user = new User();
		
		// set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		
		// save the user and check for errors
		user.save(function(err)
		{
			if (err)
			{
				//duplicate entry
				if (err.code == 11000)
					return res.json(
					{
						success: false,
						message: 'A user with that username already exists.'
					});
				else
					return res.send("ERROR: " + err);
			}
			
			res.json(
			{
				message: 'User is created!'
			});
		});
	})
	
	.get(function(req, res) 
	{
		User.find(function(err, users)
		{
			if (err) res.send(err);
			
			//return the users
			res.json(users);
		});
	});

apiRouter.route('/users/:user_id')

	// get user with this id
	// accessed at POST http://localhost:56789/api/users/:user_id
	.get(function(req, res)
	{
		User.findById(req.params.user_id, function(err, user)
		{
			if (err) res.send(err);
			res.json(user);
		});
	})
	
	// Update the user with this id
	// accessed at PUT http://localhost:56789/api/users/:user_id
	.put(function(req, res)
	{
		User.findById(req.params.user_id, function(err, user)
		{
			if (err) res.send(err);
			
			// update the user info only if its new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;
			
			//save the user
			user.save(function(err)
			{
				if (err) res.send(err);
				
				res.json(
				{
					message: 'User Updated!'
				});
			})
		});
	})
	
	// Delete the user with this id
	// accessed at DELETE http://localhost:56789/api/users/:user_id
	.delete(function(req, res)
	{
		User.remove(
		{
			_id: req.params.user_id
		}, function(err, user)
		{
			if (err) res.send(err);
			
			res.json(
			{
				message: 'Successfully deleted!'
			});
		});
	});
	
// all api prefixed with /api
app.use('/api', apiRouter);

// START SERVER
app.listen(port);
console.log('Magic happen on port ' + port);