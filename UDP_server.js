
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
            msg = msg.slice(msg.indexOf("C6"),msg.indexOf("C6") + 13);
            var temp_ID = msg.slice(3,13).toString();

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
                      var message = Buffer.from(`IP:${C6_IP[i]};PORT:${C6_PORT[i]}`);
                      const client = dgram.createSocket('udp4');
                      client.send(message, rinfo.port, rinfo.address);
                      message = Buffer.from(`IP:${rinfo.address};PORT:${rinfo.port} `);
                      client.send(message, C6_PORT[i], C6_IP[i], (err) => {client.close();});
                  }
                else
                  {
                      const message = Buffer.from('Sorry no such device');
                      const client = dgram.createSocket('udp4');
                      client.send(message, rinfo.port, rinfo.address, (err) => {client.close();});
                  }
        }
    else if (msg.indexOf("list" )  > -1)
       {
            for (var i = 0; i < C6_ID.length; i++)
              {
                const message = Buffer.from(`${i}ID - ${C6_ID[i]} IP - ${C6_IP[i]} PORT - ${C6_PORT[i]}`);
                const client = dgram.createSocket('udp4');
                client.send(message, rinfo.port, rinfo.address, (err) => {client.close();});
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
 	        const client = dgram.createSocket('udp4');
 	        client.send(message, rinfo.port, rinfo.address, (err) => {client.close();});
        }
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
//------------------------------------------------------------------------------------------
server.on('listening', () =>
  {
      const address = server.address();
    //  server.setBroadcast(true);//?
      console.log(`server listening ${address.address}:${address.port}`);
  });

server.bind({
    //  address: '192.168.0.100',
      port: 1022
    //  exclusive: true
});
