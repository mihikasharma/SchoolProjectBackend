var express = require("express");
var router = express.Router();
var Joi = require("joi");

/*
    Would contain all the database connections
*/
const R = require("../../models/dbWrapper.js").get;

/*
    Middleware for both the handlers i.e create and login
*/
router.use("/", (request, reply, next) => {
    /*
        Schema for Joi validation
    */

    const schema = Joi.object().keys({
        name: Joi.string().alphanum().required(),
        password: Joi.string().required()
    }).unknown();
    const result = Joi.validate(request.body, schema);
    /*
        if no error then pass the handle to the route
    */
    if (!result.error) {
        next();
    } else {
        const acknowledgement = {
            result: "Parameter missing"
        }
        reply.status(400).json(acknowledgement);
    }
})
router.post("/login", (request, reply) => {
    /*
        Data from payload
    */
    const name = request.body.name;
    const password = request.body.password;
    /*
        Skeleton of the response
    */
    const acknowledgement = {
            "result": ""
        }
        /*
            Check in the hash set in redis
        */
    R.db.redisMaster.hget("users", name, (err, resp) => {
        if (!err && resp) {
            /*Check authorized user*/
            if (resp == password) {
                acknowledgement.result = "Authorized";
                reply.status(200).json(acknowledgement);
            } else {
                acknowledgement.result = "Not authorized";
                reply.status(401).json(acknowledgement);
            }
        } else {
            acknowledgement.result = "Not a user";
            reply.status(400).json(acknowledgement);
        }
    });

})

router.post("/create", (request, reply) => {
    /*
        Data from payload
    */
    const name = request.body.name;
    const password = request.body.password;
    /*
        Skeleton of the response
    */
    const acknowledgement = {
            "result": "",
            "statusCode": 200
        }
        /*
            Check if the username already exists
        */
    R.db.redisMaster.hget("users", name, (err, resp) => {
        if (!resp) {
            R.db.redisMaster.hset("users", name, password, (err, resp) => {
                if (!err) {
                    acknowledgement.result = "User created";
                    reply.status(200).json(acknowledgement);
                } else {
                    acknowledgement.result = "Error while creating user";
                    acknowledgement.statusCode = 400;
                    reply.status(200).json(acknowledgement);
                }
            });

        } else if (resp) {
            acknowledgement.result = "User with this username already exists";
            acknowledgement.statusCode = 409;
            reply.status(200).json(acknowledgement);
        } else {
            acknowledgement.result = "Error while creating user";
            acknowledgement.statusCode = 400;
            reply.status(200).json(acknowledgement);
        }
    });
})
module.exports = router;
