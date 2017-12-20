const dgram = require('dgram');
//const server = dgram.createSocket('udp4');
var stdin = process.openStdin();
var ip;
var prot;

var proxy = require('udp-proxy'),
	options = {
		address: '192.168.0.100',
		port: 4022,
		ipv6: true,
		localaddress: '0.0.0.0',
		localport: 53535,
		localipv6: false,
		proxyaddress: '192.168.10.15:8080',
		timeOutTime: 10000
	};
  // This is the function that creates the server, each connection is handled internally
  var server = proxy.createServer(options);
  server.on('listening', function (details) {
  	console.log('DNS - IPv4 to IPv6 proxy }>=<{ by: ok 2012');
  	console.log('udp-proxy-server ready on ' + details.server.family + '  ' + details.server.address + ':' + details.server.port);
  	console.log('traffic is forwarded to ' + details.target.family + '  ' + details.target.address + ':' + details.target.port);
  });

  // 'bound' means the connection to server has been made and the proxying is in action
  server.on('bound', function (details) {
  	console.log('proxy is bound to ' + details.route.address + ':' + details.route.port);
  	console.log('peer is bound to ' + details.peer.address + ':' + details.peer.port);
  });

  // 'message' is emitted when the server gets a message
  server.on('message', function (message, sender) {
  	console.log('message from ' + sender.address + ':' + sender.port);
  });

  // 'proxyMsg' is emitted when the bound socket gets a message and it's send back to the peer the socket was bound to
  server.on('proxyMsg', function (message, sender) {
  	console.log('answer from ' + sender.address + ':' + sender.port);
  });

  // 'proxyClose' is emitted when the socket closes (from a timeout) without new messages
  server.on('proxyClose', function (peer) {
  	console.log('disconnecting socket from ' + peer.address);
  });

  server.on('proxyError', function (err) {
  	console.log('ProxyError! ' + err);
  });

  server.on('error', function (err) {
  	console.log('Error! ' + err);
  });


/*
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
*/
