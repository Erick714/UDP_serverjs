const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var stdin = process.openStdin();

function myFunc() {
  server.send("C6 0123456789", 444,"89.249.82.106");
}

setInterval(myFunc, 10000);

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    var a = d.toString();

     if( a.indexOf("eee") >- 1)
      {
        server.close();
      }
      server.send(a, 444,"89.249.82.106");

    console.log("you entered: [" +d.toString().trim() + "]");
  });

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  if(rinfo.address != "89.249.82.106")
  {server.send(msg, rinfo.port, rinfo.address);}
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
     address: '192.168.0.100',
      port: 123,
     exclusive: true
});
