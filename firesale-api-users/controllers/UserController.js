//Sample Implementation
  var BaseController = require('../controllers/BaseCRUDController')("user");

  var UserController = {
      method1 : function(){
        console.log("ako ay isang MerchantController at may method 1");
      }
  };

  UserController.__proto__ = BaseController;
  module.exports = UserController;
