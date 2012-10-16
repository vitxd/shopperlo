var mongoose    = require('mongoose'),
    mongo       = require('./database.js').mongo;
    cose        = new mongo(mongoose, 'localhost', 'git');

cose.createSchema('Commit', {hash: String});

try {
    var CommitModel = cose.getModel('Commit'),
        model       = {hash : 'asdf'};

    try {
        CommitModel.update({hash : model.hash }, model, {upsert : true}, function (err) {
            if (err) throw err;
            console.log('saved "' + model.id + '"');
        });
        cose.find('Commit', function(data){
            console.log(data);
        });
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log('Exception: ');
    console.log(err);
}

