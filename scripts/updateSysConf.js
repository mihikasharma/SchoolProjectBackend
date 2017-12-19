var redis = require("redis");
const commandLineArgs = require("command-line-args");
const sysConf = require("./sysConf.js").sysConf;
const optionDefinitions = [{
    name: 'redis',
    alias: 'r',
    type: String,
    defaultValue: "127.0.0.1"
}, {
    name: 'redisPort',
    alias: 'p',
    type: String,
    defaultValue: 6379
}];
const args = commandLineArgs(optionDefinitions);


const client = redis.createClient({
    host: args.redis,
    port: args.redisPort
})
client.set("6c656164207363686f6f6c_sysConf", JSON.stringify(sysConf), (err, resp) => {
    if (err) {
        console.log("Error while setting key in redis", err);
        process.exit(0);
    } else {
        console.log("Response while setting key in redis", resp);
        process.exit(0);
    }
})