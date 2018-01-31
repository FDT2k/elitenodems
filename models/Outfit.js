var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StationModel = require('./Station');
var SystemModel = require('./System');
var OutfitSchema   = new Schema({
  modules:[],
  station:{type:Schema.ObjectId,  ref :'Station'}
});


OutfitSchema.statics.import = function(message){
  let modules = message.modules || [];
  let system = message.systemName;
  let station = message.stationName;
  let model = mongoose.model('Outfit');
  //let SystemModel = mongoose.model('System');
  //let StationModel = mongoose.model('Station');

  if(system && station){
    SystemModel.createOrSave(system).then((_sys)=>{
  //    console.log(_sys);
      StationModel.createOrSave(station,_sys).then((_sta)=>{
  //      console.log(_sta);
        //_sys.stations.push(_sta);
        //_sys.save();
        model.find({station:_sta}).then((_outfits)=>{
          let outfit = null;
          if(_outfits.length == 0){
            outfit = new model();

          }else{
            outfit = _outfits[0];

          }

          outfit.station=_sta;
          outfit.modules = modules;
          return outfit.save();
        });
      })
    }).catch(()=>{
      console.log('error getting system');
    });
  }
}

module.exports = mongoose.model('Outfit', OutfitSchema);
