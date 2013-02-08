$(document).ready(function(){

  //Common Function definition
  var _compareObject = function(obj1, obj2){
  	if(obj1==undefined && obj2!=undefined || obj2==undefined && obj1!=undefined){
  	  return false;
  	}
  	if(obj1==undefined && obj2==undefined){
      return true;
    }
  	for(var attr in obj1){
  	  if(obj1[attr] instanceof Array){
  	  	if(obj2[attr]==undefined || !obj2[attr] instanceof Array){
  	  	  return false;
  	  	}
  	  	if(obj1[attr].length !== obj2[attr].length){
  	  	  return false;
  	  	}
  	  	for(var i=0; i<obj1[attr].length; i++){
  	  	  if(_compareObject(obj1[attr][i], obj2[attr][i])==false){
  	  	  	return false;
  	  	  }
  	  	}  	  	
  	  }else if(typeof(obj1[attr]) == "object"){
  	  	if(obj2[attr]==undefined || !typeof(obj2[attr]=="object")){
  	  	  return false;
  	  	}
  	  	if(_compareObject(obj1[attr], obj2[attr])==false){
  	  	  return false;
  	  	}
  	  }else{
  	  	if(obj1[attr] != obj2[attr]){  //weak equal because: "0" == 0
  	  	  return false;
  	  	};
  	  }  	  
  	}
  	return true;
  };
  
  var compareObject = function(obj1, obj2){
  	return _compareObject(obj1, obj2) && _compareObject(obj2, obj1);
  };
  
  var init = function(){

  };
  
  var buildFormRootFromNothing = function(){
  	formRoot = FormUtil.initFormRoot(null, 'SampleBLAmend');
  };
  
  var buildFormRootFromNothingButConfig = function(config){
  	formRoot = FormUtil.initFormRootWithConfig(config, null, 'SampleBLAmend');
  };
  
  var buildFormRootWithJSON = function(jsonObject){
  	formRoot = FormUtil.initFormRoot(jsonObject, 'SampleBLAmend');
  };
  
  var buildFormRootWithJSONAndConfig = function(config, jsonObject){
  	formRoot = FormUtil.initFormRootWithConfig(config, jsonObject, 'SampleBLAmend');
  };
	
  var resetUI = function(){
  	$("#SampleBLAmend_template").html("");
  	$("#SampleBLAmend_template").html($("#contentSource").html());
  };
	
  var resetUI2 = function(){
  	$("#SampleBLAmend_template").html("");
  	$("#SampleBLAmend_template").html($("#contentSource2").html());
  };
  
  var resetAllUI = function(){
  	$("#SampleBLAmend_template").html("");
  };
  
  //Data
  var myJson = {
	  toOrder:true,
	  fmcNumber: "fmcNumber",
	  shipper:{partyText: "shipper"},
	  consignee: {partyText: "consignee"},
	  containers: [
	    {//container1
	      containerNumber:"container1",
	      bookingNumber: "booking1",
	      shipperOwned: true,
	      containerSizeTypeCode: "20GP",
	      seals: [
	        {
	          sealType:"CA",
	          sealNumber: "seal1"
	        },
	        {
	          sealType:"HS",
	          sealNumber: "seal2"
	        }
	      ],
	      cargoes: [
	        {
	          marksAndNumber: "mark1",
	          quantity: 10,
	          packageType: "BOX"
	        },
	        {
	          marksAndNumber: "mark2",
	          quantity: 20,
	          packageType: "PACK"
	        }
	      ]
	    },
	    {//container2
	      containerNumber:"container1",
	      bookingNumber: "booking1",
	      shipperOwned: false,
	      containerSizeTypeCode: "20GP",
	      cargoes: [
	        {
	          marksAndNumber: "",
	          quantity: "",
	          packageType: ""
	        }
	      ]
	    }
	  ]
  };
  
  
  
  
  var incompleteJson = {
      toOrder:true,
      shipper:{partyText: "shipper"},
      containers: [
        {//container1
          containerNumber:"container1",
          shipperOwned: true,
          containerSizeTypeCode: "20GP",
          cargoes: [
            {
              marksAndNumber: "mark1",
              packageType: "BOX"
            },
            {
              marksAndNumber: "mark2",
              packageType: "PACK"
            }
          ]
        },
        {//container2
          containerNumber:"container1",
          bookingNumber: "booking1",
        }
      ]
  };
  
  
  
  var supplementJson = {
      toOrder:true,
      fmcNumber: "",
      shipper:{partyText: "shipper"},
      consignee: {partyText: ""},
      containers: [
        {//container1
          containerNumber:"container1",
          bookingNumber: "",
          shipperOwned: true,
          containerSizeTypeCode: "20GP",
          seals: [
            {
              sealType:"",
              sealNumber: ""
            }
          ],
          cargoes: [
            {
              marksAndNumber: "mark1",
              quantity: "",
              packageType: "BOX"
            },
            {
              marksAndNumber: "mark2",
              quantity: "",
              packageType: "PACK"
            }
          ]
        },
        {//container2
          containerNumber:"container1",
          bookingNumber: "booking1",
          shipperOwned: false,
          containerSizeTypeCode: "",
          seals: [
            {
              sealType:"",
              sealNumber: ""
            }
          ],
          cargoes: [
            {
              marksAndNumber: "",
              quantity: "",
              packageType: ""
            }
          ]
        }
      ]
  };
  
  
  
  var defaultJson = {
      toOrder:"",
      fmcNumber: "",
      shipper:{partyText: ""},
      consignee: {partyText: ""},
      containers: [
        {//container1
          containerNumber:"",
          bookingNumber: "",
          shipperOwned: "",
          containerSizeTypeCode: "",
          seals: [
            {
              sealType:"",
              sealNumber: ""
            }
          ],
          cargoes: [
            {
              marksAndNumber: "",
              quantity: "",
              packageType: ""
            }
          ]
        }
      ]
  };
  

  
 
  
  
  
  //Test Start
  
 
  
  
  
  
  module("Init Page with Json Data", {
  	setup: function(){
  	  init();
      resetUI();
      buildFormRootWithJSON(myJson);
  	},
  	teardown: function(){
//  	  resetAllUI();
  	}
  });  
   
  test("Init UI with JSON", function()   
  {    
    var jRootDom = $("#SampleBLAmend_template");
    equal($('#SampleBLAmend\\.toOrder', jRootDom)[0].checked,   
      myJson.toOrder,   
      'toOrder value not correct');   
    equal($('#SampleBLAmend\\.fmcNumber', jRootDom).val(),   
      myJson.fmcNumber,   
      'fmcNumber value not correct');  
      
    //----- sub object: shipper consignee   
    equal($('#SampleBLAmend\\.shipper\\.partyText', jRootDom).val(),   
      myJson.shipper.partyText,   
      'shipper value not correct'); 
    equal($('#SampleBLAmend\\.consignee\\.partyText', jRootDom).val(),   
      myJson.consignee.partyText,   
      'consignee value not correct'); 
      
    //------ list container
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length, 
      myJson.containers.length,   
      'should exist '+myJson.containers.length+' containers'); 
    equal($('#SampleBLAmend\\.containers\\.containerNumber_0', jRootDom).val(),   
      myJson.containers[0].containerNumber,   
      '1st container number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.bookingNumber_0', jRootDom).val(),   
      myJson.containers[0].bookingNumber,   
      '1st booking number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.shipperOwned_0', jRootDom)[0].checked,   
      myJson.containers[0].shipperOwned,   
      '1st shipperOwned value not correct');   
    equal($('#SampleBLAmend\\.containers\\.containerSizeTypeCode_0', jRootDom).val(),   
      myJson.containers[0].containerSizeTypeCode,   
      '1st container type value not correct'); 
    
    equal($('#SampleBLAmend\\.containers\\.containerNumber_1', jRootDom).val(),   
      myJson.containers[1].containerNumber,   
      '2nd container number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.bookingNumber_1', jRootDom).val(),   
      myJson.containers[1].bookingNumber,   
      '2nd booking number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.shipperOwned_1', jRootDom)[0].checked,   
      myJson.containers[1].shipperOwned,   
      '2nd shipperOwned value not correct');   
    equal($('#SampleBLAmend\\.containers\\.containerSizeTypeCode_1', jRootDom).val(),   
      myJson.containers[1].containerSizeTypeCode,   
      '2nd container type value not correct'); 
      
    //------- sublist seal
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length, 
      myJson.containers[0].seals.length,   
      'should exist '+myJson.containers[0].seals.length+' seals in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_0', jRootDom).val(),   
      myJson.containers[0].seals[0].sealType,   
      '1st seal type value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_1', jRootDom).val(),   
      myJson.containers[0].seals[1].sealType,   
      '2nd seal type value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0', jRootDom).val(),   
      myJson.containers[0].seals[0].sealNumber,   
      '1st seal number value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_1', jRootDom).val(),   
      myJson.containers[0].seals[1].sealNumber,   
      '2nd seal number value in 1st container not correct');  
    
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_1_"]:visible', jRootDom).length, 
      0,   
      'should not exist seals in 2nd container');  
    
    //------- sublist cargo
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length, 
      myJson.containers[0].cargoes.length,   
      'should exist '+myJson.containers[0].cargoes.length+' cargoes in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_0', jRootDom).val(),   
      myJson.containers[0].cargoes[0].marksAndNumber,   
      '1st cargo marksAndNumber value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_1', jRootDom).val(),   
      myJson.containers[0].cargoes[1].marksAndNumber,   
      '1st cargo marksAndNumber value in 1st container not correct');
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_0_0', jRootDom).val(),   
      myJson.containers[0].cargoes[0].quantity,   
      '1st cargo quantity value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_0_1', jRootDom).val(),   
      myJson.containers[0].cargoes[1].quantity,   
      '1st cargo quantity value in 1st container not correct');
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.packageType_0_0', jRootDom).val(),   
      myJson.containers[0].cargoes[0].packageType,   
      '1st cargo packageType value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.packageType_0_1', jRootDom).val(),   
      myJson.containers[0].cargoes[1].packageType,   
      '1st cargo packageType value in 1st container not correct');
   
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_1_"]:visible', jRootDom).length, 
      myJson.containers[1].cargoes.length,   
      'should exist '+myJson.containers[1].cargoes.length+' cargoes in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_1_0', jRootDom).val(),   
      myJson.containers[1].cargoes[0].marksAndNumber,   
      '1st cargo marksAndNumber value in 2nd container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_1_0', jRootDom).val(),   
      myJson.containers[1].cargoes[0].quantity,   
      '1st cargo quantity value in 2nd container not correct');  
    equal(compareObject(myJson, formRoot.getData()),
      true,
      "getData() get correct data"
    );
    
  }); 
  
  
  test("Delete Button", function()   
  { 
    var jRootDom = $("#SampleBLAmend_template");
    //Delete a cargo
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0_"]:visible', jRootDom).length,   
      myJson.containers[0].cargoes.length,   
      'before delete should have '+myJson.containers[0].cargoes.length+' cargo delete button within contaner 1');  
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].cargoes.length,   
      'before delete should have '+myJson.containers[0].cargoes.length+' cargo UI within container 1'); 
    $("#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_1", jRootDom).click(); // delete 2nd cargo in 1st container
    equal($('[id="SampleBLAmend\\.containers\\.cargoes_deleteButton_0_1"]', jRootDom).length,   
      0,   
      'after delete should have deleted the pressed cargo delete button');  
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].cargoes.length-1,   
      'after delete should have '+myJson.containers[0].cargoeslength-1+'cargoes in 1st container UI'); 
    equal($('[id="SampleBLAmend\\.containers\\.cargoes_template_0_1"]:visible', jRootDom).length,   
      0,   
      'after delete should have deleted the 2nd cargo UI in 1st container'); 
    $("#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_0", jRootDom).click(); // delete 1st cargo in 1st container
    equal($('[id="SampleBLAmend\\.containers\\.cargoes_deleteButton_0_0"]', jRootDom).length,   
      1,   
      'after delete should have not deleted the pressed cargo delete button because it is the last one in the container');  
    equal($('[id="SampleBLAmend\\.containers\\.cargoes_template_0_0"]:visible', jRootDom).length,   
      1,   
      'after delete should NOT have deleted the 1st cargo UI in 1st container because it is the last one'); 
    
    var updateJson = FormUtil.cloneObject(myJson);
    updateJson.containers[0].cargoes.splice(1,1);
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after delete a cargo."
    );
    
    //Delete a container
    equal($('[id^="SampleBLAmend\\.containers_deleteButton_"]:visible', jRootDom).length,   
      myJson.containers.length,   
      'before delete should have '+myJson.containers.length+' container delete button');  
    equal($('[id^="SampleBLAmend\\.containers_template"]:visible', jRootDom).length,   
      myJson.containers.length,   
      'before delete should have '+myJson.containers.length+' container UI'); 
    $("#SampleBLAmend\\.containers_deleteButton_0", jRootDom).click(); // delete first container
    equal($('[id^="SampleBLAmend\\.containers_deleteButton_"]:visible', jRootDom).length,   
      0,   
      'after delete should have '+0+' container delete button');  //only remain 1 container, so hide the delete button
    equal($('[id^="SampleBLAmend\\.containers_template"]:visible', jRootDom).length,   
      myJson.containers.length-1,   
      'after delete should have '+myJson.containers.length-1+' container UI'); 
    equal($('[id^="SampleBLAmend\\.containers_template_0"]:visible', jRootDom).length,   
      0,   
      'after delete should have deleted the 1st container UI'); 
    
    updateJson.containers.splice(0,1);
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after delete a container."
    );
  });
  

  test("Add Button", function()   
  {
    var jRootDom = $("#SampleBLAmend_template");
    
    //add a seal in 1st container
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length,   
      'before add should have '+myJson.containers[0].seals.length+' seal UI within container 1'); 
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length+1,   
      'after add should have '+(myJson.containers[0].seals.length +1) +' seal UI within container 1'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_2', jRootDom).val(),   
      "",   
      'the value of new added seal type not correct'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_2', jRootDom).val(),   
      "",   
      'the value of new added seal number not correct'); 
    var updateJson = FormUtil.cloneObject(myJson);
    updateJson.containers[0].seals.push({sealType:"", sealNumber:""});
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add a seal."
    );
    //add a seal in 1st container
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length+2,   
      'after add should have '+(myJson.containers[0].seals.length +2) +' seal UI within container 1'); 
    updateJson.containers[0].seals.push({sealType:"", sealNumber:""});
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add 2 seals."
    );
    // delete 2 new added seal in 1st container and one original seal, and then add one seal
    $('#SampleBLAmend\\.containers\\.seals_deleteButton_0_2').click();
    $('#SampleBLAmend\\.containers\\.seals_deleteButton_0_3').click();
    $('#SampleBLAmend\\.containers\\.seals_deleteButton_0_1').click();
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    updateJson.containers[0].seals.splice(1, 3, {sealType:"", sealNumber:""});
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add 2 seals."
    );
    
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length,   
      'the numbe of seal after some operations is not correct');
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_0', jRootDom).val(),   
      myJson.containers[0].seals[0].sealType,   
      '1st seal type value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_1', jRootDom).val(),   
      "",   
      '2nd seal type value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0', jRootDom).val(),   
      myJson.containers[0].seals[0].sealNumber,   
      '1st seal number value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_1', jRootDom).val(),   
      "",   
      '2nd seal number value in 1st container not correct');  
      
      
    //add seal in 2nd container, should throw error because of no default model
    try{
      $('#SampleBLAmend\\.containers\\.seals_addButton_1').click();	
    }catch(e){
      equal(e.message,
      'Cannot find a matched model for SampleBLAmend.containers.seals',
      "error message not correct: no default model."
      );
    }
  });
  
 
 
  test("DefaultModel for add empty list", function()   
  {
  	SampleBLAmend.containers.seals.prototype.defaultModel = function(){
  	  return {
  	    sealType:"HS",
  	    sealNumber:"0"
  	  };
  	};
  	
  	var jRootDom = $("#SampleBLAmend_template");
  	//add a seal in 1st container
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length,   
      'before add should have '+myJson.containers[0].seals.length+' seal UI within container 1'); 
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      myJson.containers[0].seals.length+1,   
      'after add should have '+(myJson.containers[0].seals.length +1) +' seal UI within container 1'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_2', jRootDom).val(),   
      "HS",   
      'the value of new added seal type not correct'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_2', jRootDom).val(),   
      "0",   
      'the value of new added seal number not correct'); 
  	
  	$('#SampleBLAmend\\.containers\\.seals_addButton_1').click();
  	equal($('[id^="SampleBLAmend\\.containers\\.seals_template_1_"]:visible', jRootDom).length,   
      1,   
      'after add should have 1 seal UI within container 2'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_1_0', jRootDom).val(),   
      "HS",   
      'the value of new added seal type not correct'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_1_0', jRootDom).val(),   
      "0",   
      'the value of new added seal number not correct'); 
  	
  	var updateJson = FormUtil.cloneObject(myJson);
  	updateJson.containers[0].seals.push({sealType:"HS", sealNumber:0});
    updateJson.containers[1].seals=[{sealType:"HS", sealNumber:0}];
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add a seal."
    );
  	
  });

  
//----------------------------------- Test init without initial JSON Data  

  module("Init Page without Json Data", {
    setup: function(){
      init();
      resetUI();
      buildFormRootFromNothing();
    },
    teardown: function(){
//        resetAllUI();
    }
  }); 
 
  test("Init UI without JSON", function()   
  {
    var jRootDom = $("#SampleBLAmend_template");

    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length,   
      0,   
      'default have no containers shown'); 
    
    var updateJson = FormUtil.cloneObject(defaultJson);
    updateJson.containers=undefined;
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data when default init without JSON."
    );
    //add a container
    $('#SampleBLAmend\\.containers_addButton').click();
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length, 
      1,   
      'should added 1 containers'); 
    equal($('#SampleBLAmend\\.containers\\.containerNumber_0', jRootDom).val(),   
      "",   
      '1st container number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.bookingNumber_0', jRootDom).val(),   
      "",   
      '1st booking number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.shipperOwned_0', jRootDom)[0].checked,   
      false,   
      '1st shipperOwned value not correct');   
    equal($('#SampleBLAmend\\.containers\\.containerSizeTypeCode_0', jRootDom).val(),   
      "",   
      '1st container type value not correct'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length, 
      1,   
      'should exist 1 cargoes in added container');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_0', jRootDom).val(),   
      "",   
      '1st cargo marksAndNumber value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_0_0', jRootDom).val(),   
      "",   
      '1st cargo quantity value in 1st container not correct'); 
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.packageType_0_0', jRootDom).val(),   
      "",   
      '1st cargo packageType value in 1st container not correct');  
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length, 
      0,   
      'should not exist seals in the new added container'); 
    updateJson = FormUtil.cloneObject(defaultJson);
    updateJson.containers[0].seals = undefined;
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data when default init without JSON."
    );
    
    //add a seal
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      1,   
      'should be able to add seal'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_0', jRootDom).val(),   
      "",   
      'the value of new added seal type not correct'); 
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0', jRootDom).val(),   
      "",   
      'the value of new added seal number not correct'); 
    updateJson = FormUtil.cloneObject(defaultJson);
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add a seal."
    );
    
    
    //Add a cargo
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      2,   
      'should be able to add cargo'); 
    //Delete a cargo
    $('#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      1,   
      'should be able to add cargo'); 
    updateJson = FormUtil.cloneObject(defaultJson);
    equal(compareObject(formRoot.getData(), updateJson),
      true,
      "getData() doesn't get correct data after add a cargo and delete a cargo."
    );
  });

     
  test("Copy first item in the list and add to list", function(){
    var jRootDom = $("#SampleBLAmend_template");
    $('[id^="SampleBLAmend\\.containers_addButton"]', jRootDom).attr("copyFirstAndAdd", "true");
    $('#SampleBLAmend\\.containers_addButton').click();   
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();   
    
    equal($("#SampleBLAmend\\.containers\\.containerNumber_0").val(), 
        "");
    equal($("#SampleBLAmend\\.containers\\.bookingNumber_0").val(), 
        "");
    equal($("#SampleBLAmend\\.containers\\.seals\\.sealType_0_0").val(), 
        "");
    equal($("#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0").val(), 
        "");
    equal($("#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_0").val(), 
        "");
    
    $("#SampleBLAmend\\.containers\\.containerNumber_0").val("container 1");
    $("#SampleBLAmend\\.containers\\.bookingNumber_0").val("booking 1");
    $("#SampleBLAmend\\.containers\\.seals\\.sealType_0_0").val("CA");
    $("#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0").val("seal 1");
    $("#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_0").val("mark 1");
    
    $('#SampleBLAmend\\.containers_addButton').click();
    
    equal($("#SampleBLAmend\\.containers\\.containerNumber_1").val(), 
        "container 1");
    equal($("#SampleBLAmend\\.containers\\.bookingNumber_1").val(), 
        "booking 1");
    equal($("#SampleBLAmend\\.containers\\.seals\\.sealType_1_0").val(), 
        "CA");
    equal($("#SampleBLAmend\\.containers\\.seals\\.sealNumber_1_0").val(), 
        "seal 1");
    equal($("#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_1_0").val(), 
        "mark 1");
    
  });

 
 
  module("Public Functions ", {
    setup: function(){
      init();
      resetUI();
    },
    teardown: function(){
//        resetAllUI();
    }
  });   
  
  
  test("Multiple Add", function(){
  	
    
    var config = function(){
        SampleBLAmend.containers.prototype.batchAddCount = function(formName){
          if(formName == "SampleBLAmend.containers.cargoes"){
            return 3;    	
          }
          return 1;
        };
    };
    buildFormRootWithJSONAndConfig(config, myJson);
    var jRootDom = $("#SampleBLAmend_template");
    
    var previousLength = $('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length;
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_0').click();
    var currentLength = $('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length;
    equal(currentLength,   
      previousLength + 3,   
      'multi add is not correct'); 
    
    resetUI();
    buildFormRootFromNothingButConfig(config);
    
    var jRootDom = $("#SampleBLAmend_template");
    
    $('#SampleBLAmend\\.containers_addButton').click();
    var previousLength = $('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length;
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_0').click();
    var currentLength = $('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length;
    equal(currentLength,   
      previousLength + 3,   
      'multi add is not correct'); 
  });
  
  
  
  test("Delete Last Item in List", function(){
    var config = function(){
      	SampleBLAmend.containers.cargoes.prototype.isAllowedDeleteLastItem = function(){
          return true;
        };
        SampleBLAmend.containers.prototype.isAllowedDeleteLastItem = function(){
          return true;
        };
    };
    
    buildFormRootWithJSONAndConfig(config, myJson);
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      2,   
      'before delete there are not 2 cargoes in container1'); 
    var jRootDom = $("#SampleBLAmend_template");
    $('#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_0').click();
    $('#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_1').click();

    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no cargo left in container1'); 
    
    $('#SampleBLAmend\\.containers\\.cargoes_deleteButton_1_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_1_"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no cargo left in container2'); 
    
    $('#SampleBLAmend\\.containers_deleteButton_0').click();
    $('#SampleBLAmend\\.containers_deleteButton_1').click();
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no containers left'); 
      
    //init without JSON  
    init();
    resetUI();
    
    var config2 = function(){
        SampleBLAmend.containers.cargoes.prototype.isAllowedDeleteLastItem = function(){
          return true;
        };
        SampleBLAmend.containers.seals.prototype.isAllowedDeleteLastItem = function(){
          return true;
        };
        SampleBLAmend.containers.prototype.isAllowedDeleteLastItem = function(){
          return true;
        };
    };
    buildFormRootFromNothingButConfig(config2);
    $("#SampleBLAmend\\.containers_addButton").click();
    $("#SampleBLAmend\\.containers\\.seals_addButton_0").click();
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length,   
      1,   
      'before delete there should be 1 container'); 
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0"]:visible', jRootDom).length,   
      1,   
      'before delete there should be 1 seal'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0"]:visible', jRootDom).length,   
      1,   
      'before delete there should be 1 cargo'); 
    
    $('#SampleBLAmend\\.containers\\.cargoes_deleteButton_0_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no cargo left'); 
    $('#SampleBLAmend\\.containers\\.seals_deleteButton_0_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no seal left'); 
    $('#SampleBLAmend\\.containers_deleteButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers_template_0"]:visible', jRootDom).length,   
      0,   
      'after delete there should be no container left'); 
    
    $("#SampleBLAmend\\.containers_addButton").click();
    $("#SampleBLAmend\\.containers\\.seals_addButton_0").click();
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length,   
      1,   
      'after delete can also add container'); 
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0"]:visible', jRootDom).length,   
      1,   
      'after delete can also add seal'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0"]:visible', jRootDom).length,   
      1,   
      'after delete can also add cargo'); 
    
  });
  
  
  
  module("Default Setting", {
    setup: function(){
      init();
      resetUI2();
    },
    teardown: function(){

    }
  });   
  
  
  test("InitFormRoot without JSON", function(){
    
    buildFormRootFromNothing();
    var jRootDom = $("#SampleBLAmend_template");
    
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length,   
      1,   
      'default 1 container shows'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length,   
      1,   
      'default 1 cargo shows'); 
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length,   
      1,   
      'default 1 seal shows'); 

    equal($('[id^="SampleBLAmend\\.containers_deleteButton"]:visible', jRootDom).length,   
      0,   
      'default 0 container delete button shows'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0"]:visible', jRootDom).length,   
      0,   
      'default 0 cargo delete button shows'); 
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_0"]:visible', jRootDom).length,   
      0,   
      'default 0 seal delete button shows');   
    
      
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_0').click();

    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0"]:visible', jRootDom).length,   
      2,   
      '2 cargo delete button shows after add cargo'); 
      
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_0').click();

    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0"]:visible', jRootDom).length,   
      3,   
      '3 cargo delete button shows after add cargo'); 
    
      
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_0"]:visible', jRootDom).length,   
      2,   
      '2 seal delete button shows after add seal'); 
      
    $('#SampleBLAmend\\.containers\\.seals_addButton_0').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_0"]:visible', jRootDom).length,   
      3,   
      '3 seal delete button shows after add seal'); 
    
      
    $('#SampleBLAmend\\.containers_addButton').click();
    equal($('[id^="SampleBLAmend\\.containers_deleteButton"]:visible', jRootDom).length,   
      2,   
      '2 container delete button shows after add container'); 
    
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_1"]:visible', jRootDom).length,   
      0,   
      'new added container should have no seal delete button'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_1"]:visible', jRootDom).length,   
      0,   
      'new added container should have no cargo delete button'); 
      
    $('#SampleBLAmend\\.containers_addButton').click();
    equal($('[id^="SampleBLAmend\\.containers_deleteButton"]:visible', jRootDom).length,   
      3,   
      '3 container delete button shows after add container'); 
    
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_2"]:visible', jRootDom).length,   
      0,   
      'new added container should have no seal delete button'); 
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_2"]:visible', jRootDom).length,   
      0,   
      'new added container should have no cargo delete button'); 
    
    
    $('#SampleBLAmend\\.containers\\.cargoes_addButton_1').click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_1"]:visible', jRootDom).length,   
      2,   
      '2 cargo delete buttons will show when add a cargo to 2nd container'); 
    
      
    $('#SampleBLAmend\\.containers\\.seals_addButton_1').click();
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_1"]:visible', jRootDom).length,   
      2,   
      '2 seal delete buttons will show when add a seal to 2nd container'); 
    
    
    $('[id="SampleBLAmend\\.containers.cargoes_deleteButton_1_0"]', jRootDom).click();
    
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_1"]:visible', jRootDom).length,   
      0,   
      'after delete a cargo, 0 cargo delete button shows'); 
      
    
    $('[id="SampleBLAmend\\.containers.seals_deleteButton_1_0"]', jRootDom).click();  
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_1"]:visible', jRootDom).length,   
      0,   
      'after delete a seal, 0 seal delete button shows');  
    
    
    $('[id="SampleBLAmend\\.containers_deleteButton_1"]', jRootDom).click();  
    equal($('[id^="SampleBLAmend\\.containers_deleteButton"]:visible', jRootDom).length,   
      2,   
      'after delete a container, 2 container delete button shows'); 
    
    $('[id="SampleBLAmend\\.containers_deleteButton_2"]', jRootDom).click();  
    equal($('[id^="SampleBLAmend\\.containers_deleteButton"]:visible', jRootDom).length,   
      0,   
      'after delete a container, 0 container delete button shows'); 
      
      
    
    $('[id="SampleBLAmend\\.containers.cargoes_deleteButton_0_0"]', jRootDom).click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0"]:visible', jRootDom).length,   
      2,   
      'after delete a cargo, 2 cargo delete button shows'); 
    
    $('[id="SampleBLAmend\\.containers.cargoes_deleteButton_0_1"]', jRootDom).click();
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_deleteButton_0"]:visible', jRootDom).length,   
      0,   
      'after delete a cargo, 0 cargo delete button shows'); 
      
    
    $('[id="SampleBLAmend\\.containers.seals_deleteButton_0_0"]', jRootDom).click();  
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_0"]:visible', jRootDom).length,   
      2,   
      'after delete a seal, 2 seal delete button shows');  
    
    $('[id="SampleBLAmend\\.containers.seals_deleteButton_0_1"]', jRootDom).click();  
    equal($('[id^="SampleBLAmend\\.containers\\.seals_deleteButton_0"]:visible', jRootDom).length,   
      0,   
      'after delete a seal, 0 seal delete button shows');  
    
  });
  
  
  test("Init UI with Incomplete JSON", function()   
  { 
    buildFormRootWithJSON(incompleteJson);   
    var jRootDom = $("#SampleBLAmend_template");
    equal($('#SampleBLAmend\\.toOrder', jRootDom)[0].checked,   
      incompleteJson.toOrder,   
      'toOrder value not correct');   
    equal($('#SampleBLAmend\\.fmcNumber', jRootDom).val(),   
      "",   
      'fmcNumber value not correct');  
      
    //----- sub object: shipper consignee   
    equal($('#SampleBLAmend\\.shipper\\.partyText', jRootDom).val(),   
      incompleteJson.shipper.partyText,   
      'shipper value not correct'); 
    equal($('#SampleBLAmend\\.consignee\\.partyText', jRootDom).val(),   
      "",   
      'consignee value not correct'); 
      
    //------ list container
    equal($('[id^="SampleBLAmend\\.containers_template_"]:visible', jRootDom).length, 
      incompleteJson.containers.length,   
      'should exist '+incompleteJson.containers.length+' containers'); 
    equal($('#SampleBLAmend\\.containers\\.containerNumber_0', jRootDom).val(),   
      incompleteJson.containers[0].containerNumber,   
      '1st container number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.bookingNumber_0', jRootDom).val(),   
      "",   
      '1st booking number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.shipperOwned_0', jRootDom)[0].checked,   
      incompleteJson.containers[0].shipperOwned,   
      '1st shipperOwned value not correct');   
    equal($('#SampleBLAmend\\.containers\\.containerSizeTypeCode_0', jRootDom).val(),   
      incompleteJson.containers[0].containerSizeTypeCode,   
      '1st container type value not correct'); 
    
    equal($('#SampleBLAmend\\.containers\\.containerNumber_1', jRootDom).val(),   
      incompleteJson.containers[1].containerNumber,   
      '2nd container number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.bookingNumber_1', jRootDom).val(),   
      incompleteJson.containers[1].bookingNumber,   
      '2nd booking number value not correct');   
    equal($('#SampleBLAmend\\.containers\\.shipperOwned_1', jRootDom)[0].checked,   
      false,   
      '2nd shipperOwned value not correct');   
    equal($('#SampleBLAmend\\.containers\\.containerSizeTypeCode_1', jRootDom).val(),   
      "",   
      '2nd container type value not correct'); 
      
    //------- sublist seal
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_0_"]:visible', jRootDom).length, 
      1,   
      'should exist '+1+' seals in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealType_0_0', jRootDom).val(),   
      "",   
      '1st seal type value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.seals\\.sealNumber_0_0', jRootDom).val(),   
      "",   
      '1st seal number value in 1st container not correct');  

    
    equal($('[id^="SampleBLAmend\\.containers\\.seals_template_1_"]:visible', jRootDom).length, 
      1,   
      'should exist seal in 2nd container');  
    
    //------- sublist cargo
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_0_"]:visible', jRootDom).length, 
      incompleteJson.containers[0].cargoes.length,   
      'should exist '+incompleteJson.containers[0].cargoes.length+' cargoes in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_0', jRootDom).val(),   
      incompleteJson.containers[0].cargoes[0].marksAndNumber,   
      '1st cargo marksAndNumber value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_0_1', jRootDom).val(),   
      incompleteJson.containers[0].cargoes[1].marksAndNumber,   
      '1st cargo marksAndNumber value in 1st container not correct');
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_0_0', jRootDom).val(),   
      "",   
      '1st cargo quantity value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_0_1', jRootDom).val(),   
      "",   
      '1st cargo quantity value in 1st container not correct');
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.packageType_0_0', jRootDom).val(),   
      incompleteJson.containers[0].cargoes[0].packageType,   
      '1st cargo packageType value in 1st container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.packageType_0_1', jRootDom).val(),   
      incompleteJson.containers[0].cargoes[1].packageType,   
      '1st cargo packageType value in 1st container not correct');
   
    equal($('[id^="SampleBLAmend\\.containers\\.cargoes_template_1_"]:visible', jRootDom).length, 
      1,   
      'should exist '+1+' cargoes in 1st container');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.marksAndNumber_1_0', jRootDom).val(),   
      "",   
      '1st cargo marksAndNumber value in 2nd container not correct');  
    equal($('#SampleBLAmend\\.containers\\.cargoes\\.quantity_1_0', jRootDom).val(),   
      "",   
      '1st cargo quantity value in 2nd container not correct');  
    equal(compareObject(supplementJson, formRoot.getData()),
      true,
      "getData() get correct data"
    );
    
  });
  
  

});