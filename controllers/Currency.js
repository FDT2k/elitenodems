'use strict';

var Promise = require('bluebird');
var Currency     = require('../models/Currency');
const crypto = require('crypto');
var conf = require('../conf');
var jwt = require('jsonwebtoken');
var controller = {};

controller.createCurrency = function(data){
  var Curr = new Currency();
  for(var key in data){
    Curr[key] = data[key];
  }

  //Curr.ExchangeRates.push({DestinationCurrency:Curr,Rate:1.0})
  return Curr.save();
}

controller.updateCurrency = function(currencyId,ISO,Display,Symbol,ExchangeRates){
  var Curr = new Currency();
  return Currency.findOne({_id:currencyId}).then(function(Curr){
    console.log(Currency.schema.obj);
    Curr.ISO = ISO;
    Curr.Display = Display;
    Curr.Symbol = Symbol;
    return Curr.save();
  }).catch(function(){
    console.log('not found');
  });
}

module.exports = controller;
