
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ID";
var date = new Date();


/*
MongoClient.connect(url, function(err, db) {
  // Paste the following examples here

  db.close();
});
*/
//--------------------------------------------------------------------------------------------------DB_functions
function insertToDb(myobj)
{

  MongoClient.connect(url, function(err, db)
  {
    db.collection("C6").insertOne(myobj).then(function(result)
    {
      date = Date();
      console.log(`${date} ID ${myobj.device_info.c6_id} added`);
      db.close();
    })
  });

}
function findSome(limit,ip,port)
{
  MongoClient.connect(url, function(err, db)
    {
        db.collection('C6').find().limit(limit).toArray(function(err, result)
          {
              if (err) throw err;
              db.close();
              if(ip ==  0 || port ==  0){console.log(result);}
              else
                {
                result.forEach(function(element)
                  {
                    server.send(JSON.stringify(element), port, ip);
                  });
                }
            //add random here
          });
      });
}
function FindByID(idid,JSon_app,ip,port)
{
  MongoClient.connect(url, function(err, db)
  {
    db.collection('C6').find({"device_info.c6_id":idid},
    { _id: false, "device_info.c6_id": true,"device_info.version": true,"connection.ip": true, "connection.port": true, })
    .toArray(function(err, result)
      {
        if (err) throw err;
        try
        {

          server.send(JSon_app,result[0].connection.port ,result[0].connection.ip  )
          server.send(JSON.stringify(result[0]), port, ip);

        }
        catch(e){server.send("Sorry, No such device", port, ip);}
        db.close();
      });
    });
}
function C6_insert(ID, ip ,port)
{
  var ret;
  MongoClient.connect(url, function(err, db)
    {
        db.collection('C6').find({"device_info.c6_id":ID},
        { _id: false, "device_info.c6_id": true,"connection.ip": true, "connection.port": true, })
        .toArray(function(err, result)
          {
              if (err) throw err;
              try
              {
                  if(result[0].connection.ip  != ip || result[0].connection.port != port )
                    {
                      date = Date();
                      console.log(`${date} The ip or port for "ID - ${ID}" was changed`);

                        var newvalues = { $set: { "connection.ip": ip, "connection.port" :port } };
                        db.collection("C6").updateOne({"device_info.c6_id":ID}, newvalues, function(err, res) {
                        if (err) throw err;

                    });}

                }
              catch(e)
              {
                var JSON_obj =
                  {
                    "device_info":
                    {"c6_id":ID.toString(),"version":"0.01v"},
                    "connection":
                    {"ip":ip,"port":port}
                  };//can be created, and passed to the function
                insertToDb(JSON_obj)
              }
              db.close();
          });
      });

}

server.on('error', (err) =>
  {
     date = Date();
      console.log(`${date} server error:\n${err.stack}`);
      server.close();
  });
  //
//--------------------------------------------------------------------------------------------------------
server.on('message', (msg, rinfo) =>
  {
    if      (msg.indexOf("C6"   )  > -1)
        {
          msg = msg.slice(msg.indexOf("C6"),msg.indexOf("C6") + 13);
          var temp_ID = msg.slice(3,13).toString()
          C6_insert(temp_ID,rinfo.address,rinfo.port);
        }
    else if (msg.indexOf("APP"  )  > -1)
        {
            msg = msg.slice(msg.indexOf("APP"),msg.indexOf("APP") + 14);
            var temp_ID = msg.slice(4,14);
            var JSON_app =
            {
              "device info":
              {"app":"android","version":"0.01v"},
              "connection":
              {"ip":rinfo.address,"port":rinfo.port}
            };
            FindByID(temp_ID.toString(),JSON.stringify(JSON_app),rinfo.address,rinfo.port);
        }
    else if (msg.indexOf("list" )  > -1)
       {
           findSome(10,rinfo.address, rinfo.port);
       }
    else if (msg.indexOf("exit" )  > -1)
        {
            date =  Date();
            console.log(`${date} the server is closing`);
            server.close();
        }
    else if (msg.indexOf("print")  > -1)
        {var print = findSome(10,0,0);}
    else
        {
          const message = Buffer.from('Error');
 	        server.send(message, rinfo.port, rinfo.address);
        }
    if (msg.indexOf("C6") < 0)
    {
      date =  Date();
      console.log(`${date} server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    }

  });
//------------------------------------------------------------------------------------------
server.on('listening', () =>
  {
      const address = server.address();
      console.log(`${date} server listening ${address.address}:${address.port}`);
  });

server.bind({
      port: 444,
     exclusive: true
});
