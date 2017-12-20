const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var stdin = process.openStdin();
var ip;
var prot;
function myFunc() {
  buffer = new Buffer.from([0x01, 0x18, 0xc0, 0xff, 0x11, 0xe5, 0x1c, 0x06, 0xaf, 0xcd, 0x28, 0x76, 0x58, 0xc5, 0x20, 0x00, 0x12]);
server.send(buffer, 444,"89.249.82.106");
//  server.send("C6 0123456789", 444,"89.249.82.106");
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
     server.send(a, 9000,"192.168.0.100");
      //  server.send("C6 0123456789", 444,"89.249.82.106");

    console.log("you entered: [" +d.toString().trim() + "]");
  });

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  switch (msg[0]) {
            case 0x04:
              console.log(`server got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
              ip = msg[1].toString()+'.'+msg[2].toString()+'.'+msg[3].toString()+'.'+msg[4].toString();
              porthex = msg[5]*256 +msg[6];
              console.log(ip);
              console.log(porthex);
              server.send("Hello world", porthex,ip);
              break;
        case 0x07:
              console.log(`server got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
              break;
        case 0x08:
               findSome(10,rinfo.address, rinfo.port);
              break;
        default:
                date =  Date();
                console.log(`${date} server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
              break;
  }

});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind({
      port: 4022,
     exclusive: true
});
