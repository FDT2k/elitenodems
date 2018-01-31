const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Outfit = require('./models/Outfit');
const System = require('./models/System');
const Market = require('./models/Market');

init = function (){
  sock.connect('tcp://eddn.edcd.io:9500');
  console.log('Worker connected to port 9500');

  sock.subscribe('');
  sock.on('close', ()=>{
    console.log('connection lost');
  });
  sock.on('message', topic => {
    let message = JSON.parse(zlib.inflateSync(topic));

    console.log (message.$schemaRef);
    let ref = message.$schemaRef;
    if(ref == "https://eddn.edcd.io/schemas/outfitting/2"){
    //  console.log(message.message);
      Outfit.import(message.message);
    }else if(ref == "https://eddn.edcd.io/schemas/journal/1"){
  //    console.log(message.message.StarPos);
      System.import(message.message.StarSystem,message.message.StarPos).then((sys)=>{
        System.findOne({name:'Sol'}).then((sol)=>{
          if(sys){
            console.log('Distance from SOL '+sys.distance(sol));
          }
        });
      }).catch((err)=>{
        console.log('error importing StarSystem');
        console.log(err);
      });

    }else if(ref == "https://eddn.edcd.io/schemas/commodity/3"){
      Market.import(message.message);
    
    }
  });
}

module.exports= init;
