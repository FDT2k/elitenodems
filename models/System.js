var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Station = require('./Station');
var SystemSchema   = new Schema({
  name: {type:String, unique:true},
  x:Number,
  y:Number,
  z:Number,
  loc:[],
  stationCount: Number,
  stations:[{type:Schema.ObjectId,  ref :'Station'}]
});

SystemSchema.methods.distance = function(to){
  let dist = -1;
//  console.log(this);
  //console.log(to);
if(to!=null){
  if(typeof to.x !=undefined && typeof to.y != "undefined" && typeof to.z != "undefined" ){

    dist = Math.sqrt(Math.pow(this.x-to.x,2)+Math.pow(this.y-to.y,2)+Math.pow(this.z-to.z,2));
  }
  }
  return dist;
}

SystemSchema.statics.createOrSave = function(name) {

  var model = mongoose.model('System');

  return model.find({ name: new RegExp(name, 'i') }).then((systems)=>{
    //console.log(systems);
    if(systems.length >0){
      return systems[0];
    }else{
      let system = new model();
      system.name = name;
      return system.save();
    }
  }).catch((err)=>{
    console.log('error creating system ');
    console.log(err);
  });

};

SystemSchema.statics.import = function(name,pos){
  var model = mongoose.model('System');
  return model.createOrSave(name).then((sys)=>{
    sys.x = pos[0];
    sys.y = pos[1];
    sys.z = pos[2];
    sys.loc = pos;
    return sys.save();
  });
}

module.exports = mongoose.model('System', SystemSchema);
