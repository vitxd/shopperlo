var mongoose    = require('mongoose'),
    Mongo       = require('./models/database.js').Mongo;
    db          = new Mongo(mongoose, 'localhost', 'shopper'),
    http        = require('./models/httpServer.js').http, 
    app         = require('./models/httpServer.js').app, 
    io          = require('socket.io').listen(http);
    HOST        = '0.0.0.0',
    basepath    = __dirname + '/html',
    PORT_HTTP   = 3001
    ;


db.createSchema('List', {
    description : String,
    qty         : Number,
    bought      : Boolean,
    user        : String,
    price       : Number
});


http.listen(PORT_HTTP, HOST);

var connect = require('connect');

io.sockets.on('connection', function (socket) {
    console.log('WTF?');
    console.log(socket);
/*
    try {
        var cookie_string = socket.request.headers.cookie;
        var parsed_cookies = connect.utils.parseCookie(cookie_string);
        var connect_sid = parsed_cookies['connect.sid'];
        
        console.log(connect_sid);
        
        if (connect_sid) {
            session_store.get(connect_sid, function (error, session) {
                //HOORAY NOW YOU'VE GOT THE SESSION OBJECT!!!!
            });
        }
    } catch (err) {
        console.log('Fffffffuck');
        console.log(err);
    }*/
    socket.on('checkin', function(incoming) {
       console.log('yeah'); 
    });

    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.on('stuff', function(data) {
        console.log(data);
    });
});

console.log('HTTP Server listening on ' + HOST +':'+ PORT_HTTP);

