var express    = require('express');
var router = express.Router();
var CurrencyController = require('../controllers/Currency');

// more routes for our API will happen here
router.route('/currency')

  .get(function(req, res) {
  res.json({world:'world'});
  })
  .post(function(req,res){

    CurrencyController.createCurrency(req.body).then(function(response){
        res.json({message:'ok'});
    }).catch(function(){
      res.json ('error');
    });

  });

router.route('/currency/:id')
  .put(function(req,res,next){
    var CurrencyId =  req.params.id;
    if(!CurrencyId){
      res.status(500).send('give a parameter');
    }
    CurrencyController.updateCurrency(req.body).then(function(response){
      console.log(response);

    });
    res.json ({hello:'world'});
  });

module.exports = router;
