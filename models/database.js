var Mongo = function (handler, url, collection) {

    this.mongoose   = handler;
    this.db         = this.mongoose.createConnection(url,collection);
    this.schemas    = {};
    this.models     = {};
}

Mongo.prototype.createSchema = function(name, schema) {
    if(typeof schema != 'object')
        throw 'Schema must be an object';
    this.schemas[name] = new this.mongoose.Schema(schema);
};

Mongo.prototype.getModel = function(name) {
    if(this.schemas == undefined || this.schemas[name] == undefined){
        console.log(this.schemas);
        throw "Schema \"" + name + "\" not found";
    }
    if(this.models[name] == undefined)
        this.models[name] = this.db.model(name, this.schemas[name]);

    return this.models[name];
};

Mongo.prototype.find = function(name, filter, cb){
    if(typeof filter == "function") {
        cb = filter;
        filter = {};
    } else if(typeof filter != "object" && typeof cb == "function") {
        throw "Parameter 2 must be an object";
    } else if(typeof filter != "object") {
        filter = {};
    }

    this.getModel(name).find({}, function (err, models) {
        content = [];
        models.forEach(function (model) {
            content.push(model);
        });
        if(typeof cb == "function")
            cb(content);
    });
};

module.exports.Mongo = Mongo;
