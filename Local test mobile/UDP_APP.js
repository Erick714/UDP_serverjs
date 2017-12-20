const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var stdin = process.openStdin();

var ip ;
var port;
var ip_local ;
var port_local;

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    var a = d.toString();
    if(a.indexOf("SEND"  ) > -1 && ip != "")
      {
        server.send(a.trim(), parseInt(port),ip.toString());
        console.log(parseInt(port)+"   "+ip.toString());
      }
      else if( a.indexOf("S_LOC") >- 1)
        {
          server.send(a.trim(), parseInt(port_local),ip_local.toString());
          console.log(parseInt(port_local)+"   "+ip_local.toString());
        }
      else if( a.indexOf("LOCAL") >- 1)
          {
            server.send(a.trim(), 443,"192.168.0.100");
            console.log("you entered: [" +a.trim() + "]");
          }
    else if( a.indexOf("eee") >- 1)
      {
        server.close();
      }
    else
      {
        server.send(a.trim(), 444,"89.249.82.106");
        console.log("you entered: [" +a.trim() + "]");
      }

  });
//server.send(msg, rinfo.port, rinfo.address);
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  if(rinfo.address == "89.249.82.106" )
  {
    if(msg.indexOf("connection")> -1)
    {
      var obj = JSON.parse(msg);
          var array = Object.keys(obj)
          ip = obj[array[1]].ip;
          port = obj[array[1]].port;
     console.log(obj[array[1]].ip+":"+obj[array[1]].port);

  }}
  else if(rinfo.address == "192.168.0.100" )
  {
    if(msg.indexOf("connection")> -1)
    {
      var obj = JSON.parse(msg);
          var array = Object.keys(obj)
          ip = obj[array[1]].ip;
          port = obj[array[1]].port;
     console.log(obj[array[1]].ip_local+":"+obj[array[1]].port_local);

  }}
console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
     address: '192.168.0.100',
      port: 4022,
     exclusive: true
});
