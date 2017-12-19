Step 1 : 
task : run the script (scripts/updateSysConf.js)
command : node scripts/updateSysConf.js -r {serverIp of the redis server} -p {serverPort of the redis server}
description : This would add/update the sysConf file for this application

Step2 : 
task : Start the server 
command : node index.js -r {serverIp of the redis server} -p {port on which the application would be hosted} -c {name of the sysConf file}
description : This would initialize the service

Step 3 : 
task : Check if the services are up and running 
Considering the service is started on port 3000, the curl request for the apis are as follows
Login : 
curl -X POST \
  http://localhost:3000/apis/v1/user/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 64f77856-3e4d-278c-3ef6-ca0e00dd6f41' \
  -d '{
"name" : "neha1salian",
"password"  : "12"

}'
Create user : 
curl -X POST \
  http://localhost:3000/apis/v1/user/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 64f77856-3e4d-278c-3ef6-ca0e00dd6f41' \
  -d '{
"name" : "neha1salian",
"password"  : "12"

}' 
Add student : 
 curl -X POST \
  http://localhost:3000/apis/v1/student/create \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 6ccd8df4-83de-88d6-dc90-109a206d8444' \
  -d '{
"name" : "mihika",
"school" : "MIG",
"dob" : "9 May",
"class" : "Second",
"div" : "A",
"status" : "active"
}'

View student : 
curl -X GET \
  http://localhost:3000/apis/v1/student/view \
  -H 'cache-control: no-cache' \
  -H 'postman-token: d373adf9-6cab-e878-e309-e9dcf7cbce60'

Delete student : 
curl -X GET \
  'http://localhost:3000/apis/v1/student/delete?id=vishakha' \
  -H 'cache-control: no-cache' \
  -H 'postman-token: 2e036b84-03ca-e11e-44ce-0f531fcace3c'

