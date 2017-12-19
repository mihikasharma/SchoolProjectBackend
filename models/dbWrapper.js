var redis = require("redis");
var elasticsearch = require("elasticsearch");
var elastic = require("elasticsearch");
var runtime = {
    db: {}
};
module.exports.init = function(args) {
    var client = redis.createClient({
        host: args.redis,
        port: 6379
    });
    client.get(args.confFile, (err, resp) => {
        if (err) {
            console.log("Error while initializing database connections", err);
            process.exit(0);
        } else {
            resp = JSON.parse(resp);
            runtime.db.redisMaster = redis.createClient(resp.redisMaster);
            runtime.db.elasticClient = new elasticsearch.Client(resp.elasticClient);
            console.log("Database connections established");
            console.log("Listening on port :", args.port);
        }
    });
}
module.exports.get = runtime;