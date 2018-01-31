var mongoose     = require('mongoose');
var System = require('./System');
var Schema       = mongoose.Schema;

var StationSchema   = new Schema({
  name:String,
  system:{type:Schema.ObjectId,  ref :'System'}
});

StationSchema.post('save',function(next){
  // let's also add the station to the SystemModel
  console.log('station post save hook '+this.system);
  System.findOne({_id:this.system}).then((system)=>{

    if(system){
      let found = false;
      for (station of system.stations){
        console.log(station);
        if(station == this._id){
          found = true;
          break;
        }
      }

      if(!found){
        system.stations.push(this._id);
        system.save();
      }

      console.log('total stations in system '+system.stations.length);
      System.update({_id:this.system},{ $inc: {stationCount:1} } );
    }

  });
});
StationSchema.pre('delete',function(next){
  System.update( {cn: this.system}, { $pullAll: {stations: [this._id] } } );
  next();
});
StationSchema.statics.createOrSave = function(name,system) {

  var model = mongoose.model('Station');

  return model.find({ name: new RegExp(name, 'i'), system:system }).then((stations)=>{
    //console.log(systems);
    if(stations.length >0){
      return stations[0];
    }else{
      let station = new model();
      station.name = name;
      station.system = system;
      return station.save();
    }
  }).catch((err)=>{
    console.log('error creating system');
  });

};

module.exports = mongoose.model('Station', StationSchema);
