var fs          = require('./filesystem.js'),
    MemoryStore = require('connect').session.MemoryStore,
    memory_store= new MemoryStore({reapInterval:  60000 * 10}),
    express     = require('express'),
    http        = require('http'),
    app         = express(),
    server;

app.use(express.cookieParser());
app.use(express.session({ secret: 'asdiuofhas98dhfa9s08dfh394', store: memory_store }));
app.use(httpHandler);

server = http.createServer(app);

//httpHandler);

function httpHandler(req, res){

    var request     = req.url,
        path        = basepath + request
    ;
    
    console.log("Method: " + req.method);
    console.log("URL: " + req.url);
    console.log("Path: " + path);

    req.on('data', function(data){
        console.log(data);
    });

    if(fs.existsSync(path)) {
        if(fs.lstatSync(path).isDirectory()){
            path += 'index.html';
        }
        fs.readFile(
            path, 
            function(err, data) {
                if(err) {
                    console.log('500 naaaaaaaaaa');
                    res.writeHead(500);
                    return res.end('Error loading ' + request);
                }
                //console.log('Session: ');
                //console.log(req.session);
                console.log('ID: ' + req.session.id);
                //req.session.user = {name: 'gimbo'};

                res.writeHead(200, {'Content-type' : 'text/html'});
                res.end(data);
            }
        );
    } else {
        console.log('404 naaaaaaaaaa ' + path);
        res.writeHead(404);
        return res.end('Error loading ' + request);
    }
}

module.exports.http = server;
module.exports.app  = app;
