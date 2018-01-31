var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StationModel = require('./Station');
var SystemModel = require('./System');
var MarketSchema   = new Schema({
  commodity:String,
  station:{type:Schema.ObjectId,  ref :'Station'}
});


MarketSchema.statics.import = function(message){
  let modules = message.modules || [];
  let system = message.systemName;
  let station = message.stationName;
  let model = mongoose.model('Market');
  //let SystemModel = mongoose.model('System');
  //let StationModel = mongoose.model('Station');

  if(system && station){
    SystemModel.createOrSave(system).then((_sys)=>{
  //    console.log(_sys);
      StationModel.createOrSave(station,_sys).then((_sta)=>{
  //      console.log(_sta);
        //_sys.stations.push(_sta);
        //_sys.save();

      })
    }).catch(()=>{
      console.log('error getting system');
    });
  }
}

module.exports = mongoose.model('Market', MarketSchema);
