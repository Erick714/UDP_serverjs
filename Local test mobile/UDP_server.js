
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var C6_ID=[];
var C6_IP=[];
var C6_PORT=[];


server.on('error', (err) =>
  {
      console.log(`server error:\n${err.stack}`);
      server.close();
  });
//--------------------------------------------------------------------------------------------------------
server.on('message', (msg, rinfo) =>
  {
    if      (msg.indexOf("C6"   )  > -1)
        {
            msg = msg.slice(msg.indexOf("C6"),msg.indexOf("C6") + 19);
            var temp_ID = msg.slice(3,19);
          //  var temp_ID = msg.slice(3,19).toString('hex');
          //  var hex = temp_ID.toString('hex')
          //  console.log(hex);
          //  console.log(`${hex.slice(0,8)},${hex.slice(8,16)},${hex.slice(16,24)},${hex.slice(24,32)}`);
        //    console.log(`${parseInt(hex.slice(0,8), 16)},${parseInt(hex.slice(8,16), 16)},${parseInt(hex.slice(16,24), 16)},${parseInt(hex.slice(24,32), 16)}`);


                if (C6_ID.indexOf(`${temp_ID}`) > -1)
                  {
                    if (C6_IP[C6_ID.indexOf(`${temp_ID}`)] != rinfo.address ||C6_PORT[C6_ID.indexOf(`${temp_ID}`)] != rinfo.port )
                      {
                          console.log("Ip or Port has been changed");
                          C6_IP[C6_ID.indexOf(`${temp_ID}`)] = rinfo.address;
                          C6_PORT[C6_ID.indexOf(`${temp_ID}`)] = rinfo.port;
                      }
                    else {console.log("already exist");}
                  }
                else
                  {
                    C6_ID.push(temp_ID);
                    C6_IP.push(rinfo.address);
                    C6_PORT.push(rinfo.port);
                    console.log("added");
                  }

        }
    else if (msg.indexOf("APP"  )  > -1)
        {
            msg = msg.slice(msg.indexOf("APP"),msg.indexOf("APP") + 14);
            var temp_ID = msg.slice(4,14).toString();

                if (C6_ID.indexOf(`${temp_ID}`) > -1)
                  {
                      var i = C6_ID.indexOf(`${temp_ID}`);
                      var JSON_obj =
                      {
                        "device info":
                        {"c6 id":C6_ID[i],"version":"0.01v"},
                        "connection":
                        {"ip":C6_IP[i],"port":C6_PORT[i]}
                      };

                      var message = Buffer.from(JSON.stringify(JSON_obj));
                      server.send(message, rinfo.port, rinfo.address);
                      var JSON_obj =
                      {
                        "device info":
                        {"app":"android","version":"0.01v"},
                        "connection":
                        {"ip":rinfo.address,"port":rinfo.port}
                      };
                      message = Buffer.from(JSON.stringify(JSON_obj));
                      server.send(message, C6_PORT[i], C6_IP[i]);
                  }
                else
                  {
                      const message = Buffer.from('Sorry no such device');
                      server.send(message, rinfo.port, rinfo.address);
                  }
        }
    else if (msg.indexOf("list" )  > -1)
       {
            for (var i = 0; i < C6_ID.length; i++)
              {
                var JSON_obj = {"num":i,"ID":C6_ID[i],"IP":C6_IP[i],"PORT":C6_PORT[i]};
                var message = Buffer.from(JSON.stringify(JSON_obj));
                server.send(message, rinfo.port, rinfo.address);
              }
       }
	  else if (msg.indexOf("exit" )  > -1)
        {
            console.log("the server is closing");
            server.close();
        }
    else if (msg.indexOf("print")  > -1)
        {
            for (var i = 0; i < C6_ID.length; i++)
            {console.log(`${i}ID - ${C6_ID[i]} IP - ${C6_IP[i]} PORT - ${C6_PORT[i]}`);}
        }
    else
        {
          const message = Buffer.from('Error');
 	        server.send(message, rinfo.port, rinfo.address);
        }
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
//------------------------------------------------------------------------------------------
server.on('listening', () =>
  {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
  });

server.bind({
     address: '192.168.0.100',
      port: 443,
     exclusive: true
});
