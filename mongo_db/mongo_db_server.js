const Mongod = require('mongod');
 
// Simply pass the port that you want a MongoDB server to listen on.
const server = new Mongod({
  port: 27017,
  bin: ' C:\Program Files\MongoDB\Server\3.4\bin\mongod'
});
 
 
server.open((err) => {
  if (err === null) {
    // You may now connect a client to the MongoDB
    // server bound to port 27017.
  }
});
