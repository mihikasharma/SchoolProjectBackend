var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const commandLineArgs = require('command-line-args')

const optionDefinitions = [{
        name: 'redis',
        alias: 'r',
        type: String,
        defaultValue: "127.0.0.1"
    }, {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: 3000
    }, {
        name: 'confFile',
        alias: 'c',
        type: String,
        defaultValue: "6c656164207363686f6f6c_sysConf"
    }

]
const args = commandLineArgs(optionDefinitions);


/*
	This would initialize the database connections for all future requests
*/
require("./models/dbWrapper.js").init(args);


app.use(bodyParser.json()); //supports json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); //supports json bodies


/*
	Require the apis for which routes would be created
*/
const user = require("./apis/v1/user.js");
const student = require("./apis/v1/student.js");


/*
	Create routes
*/
app.use("/apis/v1/user", user);
app.use("/apis/v1/student", student);

app.listen(args.port);
