var express  =require("express");
var router = express.Router();

router.get("/home/:id",(req,reply)=>{
	console.log("req params",Object.keys(req));
	console.log("-----------",req.params,req.query);
	const acknowledgement = {
		id : req.params.id
	}
	reply.status(200).send(acknowledgement);
});

router.post("/home/post",(req,reply)=>{
	console.log("Inside home post request");
	console.log("+++++++++",req.query,req.params);
	console.log("!!!!!",Object.keys(req));
})
module.exports = router;
