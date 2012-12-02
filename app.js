
/**
 * Module dependencies.
 */

var   express 		= require('express')
    , root			= require('./routes/root.js')
	, create		= require('./routes/create.js')
    , app			= module.exports = express.createServer()
	, MemoryStore 	= express.session.MemoryStore
	, sessionStore 	= new MemoryStore({ reapInterval: 60000 * 10 })
	, io 			= require('socket.io')
	, parseCookie 	= require('connect').utils.parseCookie
;

// Configuration

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.cookieParser( 'asdiufhaisd7fh8asd6fg3645r34'));
	app.use(express.session({
		store	: sessionStore,
		key		: 'shopperlo.sid',
		secret	: 'asdiufhaisd7fh8asd6fg3645r34'
	}));
	app.register(".html", require('handlebars'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', root.router);
app.post('/*', root.router);
app.get('/create/*', create.router);

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var sio = io.listen(app);
sio.set('authorization', function (data, accept) {
	if (data.headers.cookie) {
		data.cookie = parseCookie(data.headers.cookie);
		data.sessionID = data.cookie['express.sid'];
		// (literally) get the session data from the session store
		sessionStore.get(data.sessionID, function (err, session) {
			if (err || !session) {
				// if we cannot grab a session, turn down the connection
				accept('Error', false);
			} else {
				// save the session data and accept the connection
				data.session = session;
				accept(null, true);
			}
		});
	} else {
		return accept('No cookie transmitted.', false);
	}
});

sio.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID
		+ ' connected!');
	// setup an inteval that will keep our session fresh
	var intervalID = setInterval(function () {
		// reload the session (just in case something changed,
		// we don't want to override anything, but the age)
		// reloading will also ensure we keep an up2date copy
		// of the session with our connection.
		hs.session.reload( function () {
			// "touch" it (resetting maxAge and lastAccess)
			// and save it back again.
			hs.session.touch().save();
		});
	}, 60 * 1000);
	socket.on('disconnect', function () {
		console.log('A socket with sessionID ' + hs.sessionID
			+ ' disconnected!');
		// clear the socket interval to stop refreshing the session
		clearInterval(intervalID);
	});

});