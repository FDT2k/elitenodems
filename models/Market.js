var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StationModel = require('./Station');
var SystemModel = require('./System');
var MarketSchema   = new Schema({
  commodity:String,
  station:{type:Schema.ObjectId,  ref :'Station'},
  meanPrice:Number,
  buyPrice:Number,
  stock:Number,
  sellPrice:Number,
  demand:Number,
  last_updated:Date
});

//MarketSchema.index({ station: 1, co: -1 });

MarketSchema.statics.import = function(message){
  let commodities = message.commodities || [];
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
        model.remove({station:_sta}).then(()=>{
          for (comm of commodities){
            let m = new model();
            m.commodity=comm.name;
            m.meanPrice = comm.meanPrice;
            m.buyPrice = comm.buyPrice;
            m.stock = comm.stock;
            m.sellPrice = comm.sellPrice;
            m.station=_sta;
            m.demand= comm.demand;
            m.last_updated= new Date();
            m.save();
          }

        });

      })
    }).catch(()=>{
      console.log('error getting system');
    });
  }
}

module.exports = mongoose.model('Market', MarketSchema);
