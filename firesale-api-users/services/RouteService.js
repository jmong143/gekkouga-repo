var formatJSONResponse = function(multi, errorResponse, data){
    var multiResult = multi || true;
    var responseJSON = {};
    if(multi)
        responseJSON.results = data;
    else
        responseJSON.result = data;

    if(errorResponse){
        responseJSON.message = {
          result : "error",
          msg: JSON.stringify(errorResponse)
        }
    }else{
      responseJSON.message = {
        result : "success",
        msg: "SUCCESSFUL"
      }
    }
    return responseJSON;
};

var configureRouting = function(_router, _route, controller, listFields){
 controller.listFields = listFields||{};
  /*
  SEARCH FROM RECORDS WITH GIVEN PARAMETER(s)
  */
  _router.get( "/" + _route + "/search" , function(req, res, next) {
     var fieldsAndData = req.query;
     console.log("CURRENT FIELDS AND DATA:: "  + JSON.stringify(fieldsAndData));
      controller.search(fieldsAndData, function(err, results, count){
           console.log("--->>>>" + JSON.stringify(controller.listFields));
           var JSONResponse = formatJSONResponse(true, err, results) ;
           JSONResponse.count = count;
           res.send(  JSONResponse  );
       });
  });

  /*
  LIST ALL RECORDS
  */
  _router.get( "/" + _route , function(req, res, next) {
    var fieldsAndData = req.query;
      controller.search(fieldsAndData, function(err, results, count){
           var JSONResponse = formatJSONResponse(true, err, results) ;
               JSONResponse.count = count;
           res.send(JSONResponse);
       });
  });

  /*
  CREATE NEW RECORD
  REQUEST TYPE: POST
  */
  _router.post( "/" + _route , function(req, res, next) {
     var fieldsAndData = req.body;//from POST/PUT request
      controller.save(fieldsAndData, function(err, result){
        res.send( formatJSONResponse(false, err, result) );
       });
  });

  /*
  VIEW RECORD WITH GIVEN ID
  REQUEST TYPE: GET
  */
  _router.get( "/" + _route + "/:id" , function(req, res, next) {
      var id = req.params.id;
      controller.view(id, function(err, result){
           res.send( formatJSONResponse(false, err, result) );
      });
  });

  /*
  UPDATE RECORD WITH GIVEN ID
  REQUEST TYPE: PUT
  */
  _router.post( "/" + _route + "/:id" , function(req, res, next) {
    var id = req.params.id;
    var fieldsAndData = req.body;//from POST/PUT request
     //function(id , fieldsAndData , callback){
     console.log("UPDATE/PUT -> " + JSON.stringify(req.body));
     console.log("UPDATE/PUT -> " + JSON.stringify(req.query));
     console.log("UPDATE/PUT -> " + JSON.stringify(req.params));
      controller.update(id, fieldsAndData , function(err, result){
          res.send( formatJSONResponse(false, err, result) );
       });
  });
  /*
  DELETE RECORD WITH GIVEN ID
  REQUEST TYPE: DELETE
  */
  _router.delete( "/" + _route + "/:id" , function(req, res, next) {
      var id = req.params.id;
      controller.delete(id, function(err, result){
           res.send( formatJSONResponse(false, err, result) );
       });

  });


  /*
  LIST ALL RECORDS
  */
  _router.get( "/" + _route + "/record/count", function(req, res, next) {
    var fieldsAndData = req.query;
      controller.count(fieldsAndData, function(err, count){
           res.send({"count": count});
       });
  });

  _router.get( "/" + _route + "/group/month", function(req, res, next) {
    console.log("HERE 11111");
    var fieldsAndData = req.query;
      controller.group(fieldsAndData, function(err, result){

           console.log("HERE 4444 " + JSON.stringify(result) + " --- " + JSON.stringify(err));

           res.send({"count": result});
       });
  });
  return _router;
}

module.exports = configureRouting;
