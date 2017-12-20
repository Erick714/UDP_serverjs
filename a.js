const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var stdin = process.openStdin();

var ip = "89.249.82.106" ;
var port = 444;
var ip_local ;
var port_local;

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    var a = d.toString();
    if(a.indexOf("SEND"  ) > -1 && ip != "")
      {
      //  buf.form([0x07,0xfe,0x03,0x00,0x04,0x00,0x01,0xd1,0xc4]);
      buff = new Buffer.from([0x07, 0xfe, 0x03, 0x00, 0x04, 0x00, 0x01, 0xd1, 0xaf, 0xc4]);
        server.send(buff, parseInt(port),ip.toString());
        console.log(parseInt(port)+buff+ip.toString());
      }
    else if( a.indexOf("eee") >- 1)
      {
        server.close();//Hello once more
      }
    else
      {
        buf = new Buffer.from([0x03, 0x18, 0xc0, 0xff, 0x11, 0xe5, 0x1c, 0x06, 0xaf, 0xcd, 0x28, 0x76, 0x58, 0xc5, 0x20, 0x00, 0x11]);
        server.send(buf, 444,"89.249.82.106");
        console.log(`you entered: [" "]`);
      }

  });
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  if(rinfo.port == 444 )
  {
    if(msg.indexOf("connection")> -1)
    {
      var obj = JSON.parse(msg);
          var array = Object.keys(obj)//
          ip = obj[array[1]].ip;
          port = obj[array[1]].port;
     console.log(obj[array[1]].ip+":"+obj[array[1]].port);

  }}
  else
  {
    server.send("Whohoo", parseInt(port),ip.toString());
  }

console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
      address:"192.168.0.100",
      port: 8080,
     exclusive: true
});
