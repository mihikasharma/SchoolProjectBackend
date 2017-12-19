var express = require("express");
var router = express.Router();
var Joi = require("joi");



/*
    Would contain all the database connections
*/
const R = require("../../models/dbWrapper.js").get;

/*
    Middleware for create student
    Would validate the payload and on its successful validation,it would pass the request to 
    respective route
*/
router.use("/create", (request, reply, next) => {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            dob: Joi.string().required(),
            school: Joi.string().required(),
            class: Joi.string().required(),
            div: Joi.string().required(),
            status: Joi.string().required()
        }).unknown();
        const result = Joi.validate(request.body, schema)
        if (!result.error) {
            next();
        } else {
            const acknowledgement = {
                result: "Parameter missing"
            }
            reply.status(400).send(acknowledgement);

        }
    })
    /*
        Handler for create student 
    */
router.post("/create", (request, reply) => {
    const name = request.body.name;
    const data = {
        index: "students",
        type: 1,
        id: name,
        body: {
            name: name,
            dob: request.body.dob,
            school: request.body.school,
            class: request.body.class,
            div: request.body.div,
            status: request.body.status
        }
    }
    const acknowledgement = {
        "result": "",
	"statusCode" : 200

    }

    R.db.elasticClient.index(data, (err, resp) => {
        if (err) {
            acknowledgement.result = "Error while adding user";
	    acknowledgement.statusCode = 400;
            reply.status(200).json(acknowledgement);

        } else {
            acknowledgement.result = "Student added";
            reply.status(200).json(acknowledgement);
        }

    })
});

/*
    Handler for view students
*/
router.get("/view", (request, reply) => {
    /*
        Data from uri
    */
    const size = request.query.size || 10;
    const page = request.query.page || 0;
    /*
        Skeleton of response
    */
    const acknowledgement = {
        "result": "",
	"statusCode" : 200
    };

    R.db.elasticClient.search({
        "index": "students",
        "type": 1,
        "body": {
            "query": {
                "match_all": {}
            }
        },
        "from": page * 10,
        "size": size
    }, (err, resp) => {
        if (err) {
            acknowledgement.result = "Error";
	    acknowledgement.statusCode=400;
            reply.status(200).json(acknowledgement);
        } else {
            acknowledgement.result = resp.hits.hits;
	    console.log("+++++++++",acknowledgement.result);
            reply.status(200).json(acknowledgement);
        }
    });

});

/*
    Middleware for delete student
*/
router.use("/delete", (request, reply, next) => {
    const schema = Joi.object({
        id: Joi.string().required()
    }).unknown();
    const result = Joi.validate(request.query, schema);
    if (!result.error) {
        next();
    } else {
        const acknowledgement = {
            result: "Parameter missing"
        }
        reply.status(400).send(acknowledgement);

    }
});
/*
    Handler for delete student 
*/
router.get("/delete", (request, reply) => {
        /*
            Data from uri
        */
        const id = request.query.id;
        /*
            Skeleton of response
        */
        const acknowledgement = {
            "result": "",
	    "statusCode" : 200

        };
        R.db.elasticClient.delete({
            index: "students",
            type: 1,
            id: id
        }, (err, resp) => {
            if (err) {
                acknowledgement.result = "Error while deleting student";
		acknowledgement.statusCode=400;
                reply.status(200).json(acknowledgement);
            } else {
                acknowledgement.result = "Student deleted";
                reply.status(200).json(acknowledgement);
            }
        });
    })
    /*
        Middleware for searching a student based on multiple parameters
    */
router.use("/search", (request, reply, next) => {
    const schema = Joi.object({
        data: Joi.object().required()
    }).unknown();
    const result = Joi.validate(request.body, schema);
    if (!result.error) {
        next();
    } else {
        const acknowledgement = {
            result: "Parameter missing"
        }
        reply.status(400).send(acknowledgement);

    }
});

router.post("/search", (request, reply) => {
    /*
        Data from payload
    */
    const data = request.body.data;
    /*
        Skeleton of response
    */
    const acknowledgement = {
        "result": ""
    }


    let arrKeys = Object.keys(data);
    var options = {
        "name": "students",
        "type": 1,
        "body": {
            "query": {
                "bool": {
                    "must": []
                }
            }
        }
    };
    let i;
    for (i of arrKeys) {
        let jsonToPush = {
            match: {}
        };
        jsonToPush.match[i] = data[i]
        options.body.query.bool.must.push(jsonToPush);
    }
    R.db.elasticClient.search(options, (err, resp) => {
        if (err) {
            acknowledgement.result = err;
            return reply.status(400).json(acknowledgement);
        } else {
            if (resp.hits.hits.length > 0) {
                acknowledgement.result = resp.hits.hits;
                return reply.status(200).json(acknowledgement);
            } else {
                return reply.status(204).json(acknowledgement);
            }
        }
    })

});

module.exports = router;
