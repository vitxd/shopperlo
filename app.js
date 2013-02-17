
/**
 * Module dependencies.
 */

function parseCookie(string){
	var   obj = string.split('; ')
		, cookie = {};
	for(el in obj){
		el = el.trim();
		var tmp = obj[el].split('=');
		cookie[tmp[0]] = tmp[1];
	}
	return cookie;
}

var   express 		= require('express')
    , root			= require('./routes/root.js')
	, create		= require('./routes/create.js')
    , app			= module.exports = express.createServer()
	, MemoryStore 	= express.session.MemoryStore
	, sessionStore 	= new MemoryStore({ reapInterval: 60000 * 10 })
	, io 			= require('socket.io')
;

// Configuration

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	app.use(express.cookieParser());// 'asdiufhaisd7f8asd6fg3645r34'));
	app.use(express.session({
		store	: sessionStore,
		key		: 'shopperlo.sid',
		secret	: 'asdiufhaisd7fh8asd6fg3645r34s'
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
//app.post('/ajax/*', root.router);

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var   sio 		= io.listen(app)
	, Session 	= require('connect').middleware.session.Session;
sio.configure(function(){
	sio.set('transports', ['websocket','flashsocket','xhr-polling']);
	sio.set('authorization', function (data, accept) {
		if (data.headers.cookie) {
			data.cookie = parseCookie(data.headers.cookie);
			data.sessionID = decodeURIComponent(data.cookie['shopperlo.sid']);
			console.log('From WS session id: ', data.sessionID);
			// (literally) get the session data from the session store
			sessionStore.get(data.sessionID, function (err, session) {
				if (err || !session) {
					// if we cannot grab a session, turn down the connection
					accept('Error', false);
				} else {
					// save the session data and accept the connection
//					data.session = session;
					data.session = session;
					accept(null, true);
				}
			});
		} else {
			return accept('No cookie transmitted.', false);
		}
	});
})

var clients = {};
sio.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	console.log('A socket with sessionID ' + hs.sessionID
		+ ' connected!');

	clients[hs.sessionID] = socket;
//	socket.send('YO!');


	socket.on('insert-item', function(data){
		console.log(data);
		console.log(hs.session);
	});


	socket.on('disconnect', function () {
		console.log('A socket with sessionID ' + hs.sessionID
			+ ' disconnected!');
		clients[hs.sessionID] = undefined;
		// clear the socket interval to stop refreshing the session
//		clearInterval(intervalID);
	});

});