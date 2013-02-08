FormTree = function(parentForm){
  return {
    parent  : parentForm,
    childs : [],
    addChild : function(childForm){
      this.childs.push(childForm);
    }
  };
};

var FormBase = {
  
//**************** Public Interface *************************//
//**************** could be overridden *************************//
    
  registerEvents: function(){
  },
  
  setupValidations :function(){
  },
  
  init:function(){
  },
  
  beforeAdd:function(formName){
    //This provides the possibility of show sth or alert sth before Adding ListForm.
    //And the return value should be boolean. True means continue to add, and false means not to add.
    return true;
  },
  
  afterAdd:function(formName, newForms){
    //This provides the possibility of show sth or alert sth after Adding ListForm.
    //No return value requried in this function
  },
  
  batchAddCount:function(formName){ 
    //This provides the possibility of Batch Add ListForm. 
    // Should override this function in the form where addButton locates.
    return 1;
  },
  
  isAllowedDeleteLastItem:function(){ 
    //if returns true, means the list item can be deleted even it is the last item in the list.
    // Only can be overriden for ListForm
    // if enable this function, you'd better provide defaultModel to the form.
    
    // By default, the last item of the list cannot be deleted.
    return false; 
  },
  
  beforeDelete : function(){
    //This function returns true to confirm delete, returns false to cancel delete
    //Only can be overridden for ListForm
    return true;
  },
  
  afterDelete : function(){
    //Only can be overridden for ListForm. This function provides the possibility to show something after delete a listForm.
    //Need not provide any return value
  }, 
  
  supplementData:function(dataHolder){  
    //After getData, will invoke this function to supplement some data based on the data got form UI.
    //Can be override. dataHolder is the object of data.      
  },
    


//***************** Public functions **************************//
// Can be used in your program

  
  addChild : function(childFormName, model){
    var emptyData = FormUtil.cloneObject(model);    
    var addedForm = this._addListForm(emptyData, childFormName);    
    addedForm._invokeAllFunctionsInForms();
    return addedForm;
  },

  getAllDescendants : function(descendantFormName){
    var results = [];
    this._getAllDescendants(descendantFormName, results);
    return results;
  },
  
  getChildren : function(childName){
  	var result = [];
  	var children = this._formTree.childs;
    if(children.length === 0){
      return result;
    }
    for(var i=0; i<children.length; i++){
      var currentChild = children[i];
      if(currentChild.name === childName){
        result.push(currentChild);
      }
    }
    return result;
  },
    
  getAncestor : function(ancestorFormName){
    var myParent = this._formTree.parent;
    if(!myParent){
      return null;
    }
    if(myParent.name === ancestorFormName){
      return myParent;
    }
    return myParent.getAncestor(ancestorFormName);
  },
  
  getSiblings : function(){
    var myParent = this._formTree.parent;
    if(!myParent){
      return [];
    }
    var candidates = myParent._formTree.childs;
    var result = [];
    for(var i=0; i<candidates.length; i++){
      var current = candidates[i];
      if(current.name == this.name && current != this){
        result.push(current);
      }
    }
    return result;  
  },
  
  //collect the data from UI and become a Json object, better use getDataIgnoreEmpty
  getData : function() { 
    var dataHolder = {};
    this._putFormDataToDataHolder(dataHolder);
    this.supplementData(dataHolder);
    return dataHolder;
  },
  
  //collect the data from UI and become a Json object
  getDataIgnoreEmpty : function() {
  	
  	var isEmptyData = function(_data){
  		if(_data==null){
            return true;
        }else if(typeof(_data)==="object"){
            for(var prop in _data){
                if(!isEmptyData(_data[prop])){
                	return false;
                }
            }
            return true;
        }else if(_data instanceof Array){
        	if(_data.length === 0){
        		return true;
        	}
            for(var i=0; i<_data.length; i++){
            	if(!isEmptyData(_data[i])){
            		return false;
            	}
            }
            return true;
        }else{
            if(_data === null || $.trim(_data) === ""){
            	return true;
            }
            return false;
        }
  	};
    
    var removeEmptyFields = function(obj){
    	if(FieldUtil.undefinedOrNull(obj)){
    		return;
    	}
    	if(obj instanceof Array){
            for(var j=0; j<obj.length; j++){
                if(isEmptyData(obj[j])){
                    obj.splice(j,1);
                }else{
                    removeEmptyFields(obj[j]);
                }
            }
        }else if(typeof(obj)==="object"){
	    	for(var prop in obj){
	    		if(isEmptyData(obj[prop])){
	    			obj[prop] = undefined;
	    		}else{
	    			removeEmptyFields(obj[prop]);
	    		}
	    	}
    	}
     };
     
     var data = this.getData();
     FormUtil.restoreKeyword(data, this.keywordReplacementMap);
     removeEmptyFields(data);
     return data;
  },
  
  //only set one level fields, not set objects or lists.
  setData : function(data, isOldValueOverriden) { //data should be in correct json format of current form
    FieldUtil.setState(this.fields, data, isOldValueOverriden);
  },
  
  //set json object to UI, if have child object, set it as well. 
  setDataRecursively : function(data, isOldValueOverriden){
    FormUtil.transformKeyword(data, this.keywordReplacementMap);
  	FieldUtil.setState(this.fields, data, isOldValueOverriden);
  	for(var prop in data){
  		var field = data[prop];
  		var subFormName = this.name+"."+prop;
  		if(field instanceof Array){
  		    if(isOldValueOverriden){
  		        
  		        this.removeAllChildren(subFormName);
  		    }
  			for(var i=0; i<field.length; i++){
  				this.addChild(subFormName,field[i]);
  			}
  		}else if(typeof(field) == 'object' && field !== null){
  			var childList = this.getChildren(subFormName);
  			if(childList.length > 0){
  			   childList[0].setDataRecursively(field, isOldValueOverriden);
  			}
  		}
  	}
  },
  
  getDisplaySequence : function(){
    if(this._isListForm){
      return this.displaySequence;
    }
    return 1;
  },
  
  //Get inital Data from Server
  getInitData : function() {
    return this.model;
  },    
    
//**************** Private functions *************************//
//**************** Do NOT change or override them, DO NOT use them in your program *************************//  
    
  _isListForm : false,
  
  _updateModelToFields: function(){
    FieldUtil.setState(this.fields, this.model, true);
  },
  
  _getFieldsInContext : function(domContext, parentPrefix){
    var self = this;  
    var allRelatedFieldElements = $("*[id^='"+parentPrefix+"'].fields", domContext)
        .filter(function(index){
           return self._isCurrentContextField(this, parentPrefix);
         });
    var elements = {};
    var seqenceSuffix = this._buildListSequenceSuffix();
    var self = this;
    allRelatedFieldElements.each(function(i, item){
        var pId = self._removeListSequenceSuffix(item.id, seqenceSuffix);
        pId = self._removeParentIdPrefix(pId, parentPrefix);
        elements[pId] = item; 
    });
    return elements;
  },
  
  _isCurrentContextField :function(domElement, parentPrefix){
    return domElement.id.substring(parentPrefix.length + ".".length).indexOf(".") < 0;
  },
  
  _removeParentIdPrefix : function(id, idPrefix){
    return id.substring(idPrefix.length+".".length); 
  },
  
  _removeListSequenceSuffix : function(elementID, seqenceSuffix){
    var charIndex = elementID.indexOf(seqenceSuffix);
    return elementID.slice(0, charIndex>0?charIndex:elementID.length);
  },
  
  _deduceTemplateID : function(){
    var templateID = this.name + "_template";
    templateID = templateID + this._buildListSequenceSuffix();
    return templateID;
  },
  
  _buildListSequenceSuffix : function(){
    var currentParent = this._formTree.parent;
    var allSuffix = "";
    while(!FieldUtil.undefinedOrNull(currentParent)){
      if(currentParent._isListForm){
        allSuffix = "_" +  currentParent.currentIndex + allSuffix;
      }
      currentParent = currentParent._formTree.parent;
    }
    return allSuffix;
  },
  
  _buildFormTree : function(parent){
    this._formTree = new FormTree(parent);
    if(!FieldUtil.undefinedOrNull(parent)){
      parent._formTree.addChild(this);
    }
  },
  
  _getLastName : function(){
    var fullName = this.name;
    return fullName.substring(fullName.lastIndexOf(".")+1);
  },
  
  _form_init : function(model, name, parent){//form constructor
    this.model = model;
    this.name = name;
    this._buildFormTree(parent);
    
    this.templateID = this._deduceTemplateID();
    this.dom = document.getElementById(this.templateID);
    this.fields = this._getFieldsInContext(this.dom, this.name);
    this._updateModelToFields();
  },
  
  _initChildListFormBy : function(form, model, formName, index, displaySequence){
    FormUtil.inherit(form, FormListBase);
    form._form_init(model, formName, this, index, displaySequence);
    return form;
  },
  
  
  _initChildPlainFormBy : function(form, model, formName){
    FormUtil.inherit(form, FormBase);
    form._form_init(model, formName, this);
    return form;
  },
  
  _initSubFormsBy : function(model, name, listIndex, displaySequence){
    var currentForm = null;
    try{
      currentForm = new Function("return new " + name + "();")();  
    }catch(e){
      //In case no constructor is provided, null is returned.
      return null;
    }
    if(FieldUtil.undefinedOrNull(listIndex)){
      currentForm = this._initChildPlainFormBy(currentForm, model, name);
    }else{
      currentForm = this._initChildListFormBy(currentForm, model, name, listIndex, displaySequence);
    }
  
    for(var property in model){
      var value = model[property];
      if(typeof(value)==="undefined" || value === null){
        continue;
      }
      var subName = name+"."+property;
      if(value.constructor == Object){
        currentForm._initSubFormsBy(value, subName);
      }
      if(value.constructor == Array){
        for(var i=0; i<value.length; i++){
          if(typeof(value[i])=="undefined"){
            continue;
          } 
          if(value[i].constructor != Object){
            continue;
          }
          currentForm._initSubFormsBy(value[i], subName, i, i+1);
        }
      }
    }
    return currentForm;
  },
  
  
  _invokeFunctionInForms : function(functionName){
    if(!this[functionName]){
      throw new Error("_invokeFunctionInForms: form ["+this.name+"] does not have a function named " + functionName);
    }
    this[functionName]();
    var subForms = this._formTree.childs;
  
    for(var i=0; i<subForms.length; i++){
      if(subForms[i]){
        subForms[i]._invokeFunctionInForms(functionName);
      }
    }
  },
  
  _invokeAllFunctionsInForms : function(){
    this._invokeFunctionInForms("registerEvents");
    this._invokeFunctionInForms("setupValidations");
    this._invokeFunctionInForms("init");
  
    this._bindAddButtonEvent();  
    this._bindDeleteButtonEvent();  
  },
  
  _bindAddButtonEvent : function(){
    var self = this;
    $("[id*='_addButton']", $(self.dom)).click(function(){      
      self.addListForm(this);
    });
  },

  _bindDeleteButtonEvent : function(){
    var self = this;
    var jDeleteButtons = $("*[id*='_deleteButton_']", $(self.dom));

    $(jDeleteButtons).each(function(i, buttonDom){
      buttonDom.onclick = function(){
        self.removeListForm(this);
      };
    });
    
// by xiaoer: below 3 line code will have problem in IE7. So use above code instead   
//    $("*[id*='_deleteButton_']", $(self.dom)).bind("click", function(){
//      self.removeListForm(this);
//    });
  },

  _getSubFormByTemplateId : function(templateId){
     //benny fix, add check this.dom not null
    if(this.dom && this.dom.id == templateId){
      return this;
    }
    var childList = this._formTree.childs;
    for(var i=0; i< childList.length; i++){
      var curForm = childList[i];
      var matchedForm = curForm._getSubFormByTemplateId(templateId);
      if (matchedForm) {
        return matchedForm;
      }
    }
    return null;
  },
    
  _getFormByFieldId : function(fieldId){
    var templateID = FormUtil._getTemplateId(fieldId);
    var resultForm = this._getSubFormByTemplateId(templateID);
    return resultForm;
  },

  _getFormByAddButtonId : function(addButtonId){
    var templateID = FormUtil._getTemplateId(addButtonId);
    var resultForm = this._getSubFormByTemplateId(templateID);
    return resultForm;
  },
  
  _getFormByDeleteButtonId : function(deleteButtonId){
    var templateID = FormUtil._getTemplateId(deleteButtonId);
    var resultForm = this._getSubFormByTemplateId(templateID);
    return resultForm;
  },
  
  _getFirstMatchedModel : function(childFormName){
    var childList = this._formTree.childs;
    for(var i=0; i<childList.length; i++){
      var curForm = childList[i];
      if(curForm.name == childFormName){
        return FormUtil.cloneObject(curForm.model); 
      }
    }
    throw new Error("Cannot find a matched model for " + childFormName);
  },
  
  _getFirstSibling : function(parentForm, siblingFormName){
    var childList = parentForm._formTree.childs;
    for(var i=0; i<childList.length; i++){
      var curForm = childList[i];
      if(curForm.name == siblingFormName){
        return curForm;
      }
    }
    return null;
  },
  
  _getDataFromFirstMatchedForm : function(childFormName){
     var childList = this._formTree.childs;
     for(var i=0; i<childList.length; i++){
       var curForm = childList[i];
       if(curForm.name == childFormName){
         return FormUtil.cloneObject(curForm.getData()); 
       }
     }
     throw new Error("Cannot find a matched model for " + childFormName);  
  },
  
  _addListForm : function(model, targetName){
    var index = 0;
    var displaySequence = 1;
    var childList = this._formTree.childs;
    for(var i=0; i<childList.length; i++){
      if(childList[i].name == targetName){
        displaySequence++;
        index= (childList[i].currentIndex+1 > index) ? childList[i].currentIndex+1 : index;
      }
    }
    childList[childList.length] = this._initSubFormsBy(model, targetName, index, displaySequence);
    return childList[childList.length-1];
  },
  
  
  addListForm : function(button){
    if(!button || !button.id){
      throw new Error("addListForm: No button provided or button has no id!");
    }
    var addedFormName = FormUtil._deduceSubFormNameByAddButton(button.id);
    if(this.beforeAdd(addedFormName)){
      var formToBeAddTo = this._getFormByAddButtonId(button.id);
      
      var defaultModel = null;
      try{
       var strFunc = addedFormName+".prototype.defaultModel();";
       defaultModel = eval(strFunc);
      }catch(e){
      	//do nothing in case no default model provided.
      	//alert(addedFormName+".prototype.defaultModel();");
      }
      if ($(button).attr("copyFirstAndAdd") == "true") {
          try{
            defaultModel = formToBeAddTo._getDataFromFirstMatchedForm(addedFormName);
          }catch(e){
            LogUtil.log("_getDataFromFirstMatchedForm wrong", e);
          }
      }
      if(!defaultModel){
        defaultModel = formToBeAddTo._getFirstMatchedModel(addedFormName);
        FormUtil.cleanAllValuesAndRemainArrayOnlyOneElement(defaultModel);
      }

      var howMany = formToBeAddTo.batchAddCount(addedFormName);
      var newForms = [];
      for(var i=0; i<howMany; i++){
        var emptyData = FormUtil.cloneObject(defaultModel);    
        var addedForm = formToBeAddTo._addListForm(emptyData, addedFormName);    
        addedForm._invokeAllFunctionsInForms();
        newForms.push(addedForm);
      }

      this.afterAdd(addedFormName, newForms);
    }
  },
  
  removeMySelf : function(){ //Ignore isAllowedDeleteLastItem, be careful
    this.isAllowedDeleteLastItem = function(){return true;};
    return this.removeListItem(this);  
  },
  
  removeAllChildren : function(formName){ 
    var self = this;
    var children = self.getAllDescendants(formName);
    for(var i=0; i<children.length; i++){
        children[i].removeMySelf();
    }
  },
  
  removeListItem : function(currentForm){
    if(!currentForm.beforeDelete()){
      return false;
    }
    var parentForm = currentForm._formTree.parent;
    var allSiblings = parentForm._formTree.childs;
    var newChildList = [];
    var remainCount = 0;
    var remainForm = null;
    for(var i=0; i<allSiblings.length; i++){
      var curSibling = allSiblings[i];
      if(curSibling.name == currentForm.name && curSibling.currentIndex != currentForm.currentIndex){
        if(curSibling.currentIndex > currentForm.currentIndex){
          curSibling.displaySequence = curSibling.displaySequence-1;
          curSibling._updateDisplaySequenceInDom();
        }
        newChildList.push(curSibling);
        remainCount++;
        remainForm = curSibling;
      }else if(curSibling.name != currentForm.name){
        newChildList.push(curSibling);
      }
    }
    if(!currentForm.isAllowedDeleteLastItem() && remainCount === 0){
      return false; //Not allow to delete if no same name form left after delete currentForm.
    }
    if(!currentForm.isAllowedDeleteLastItem() && remainCount === 1){
      $("[id^='"+remainForm.name+"_deleteButton']", remainForm.dom).hide();
    }
    
    parentForm._formTree.childs = newChildList;
    $(currentForm.dom).remove();
    currentForm.afterDelete();

    return true;
  },

  
  removeListForm : function(button){
    if(!button || !button.id){
      throw new Error("removeListForm: No button provided or button has no id!");
    }
    var currentForm = this._getFormByDeleteButtonId(button.id);
    return this.removeListItem(currentForm);
  },

  
  _getAllDescendants : function(formName, results){
    var children = this._formTree.childs;
    if(children.length === 0){
      return;
    }
    for(var i=0; i<children.length; i++){
      currentChild = children[i];
      if(currentChild.name === formName){
        results.push(currentChild);
      }
      currentChild._getAllDescendants(formName, results);
    }
  },

  
  _putFormDataToDataHolder : function(dataHolder){
    FieldUtil.copyState(dataHolder,FieldUtil.getFieldsState(this.fields));
    var children = this._formTree.childs;
    for(var i=0; i<children.length; i++){
      var currentForm = children[i];
      if(!currentForm){
        continue;
      }
      var fieldName = currentForm._getLastName();
      if(currentForm._isListForm){
        if(!dataHolder[fieldName]){
          dataHolder[fieldName]=[];
        }
        var currentIndex = dataHolder[fieldName].length;
        dataHolder[fieldName][currentIndex] = currentForm.getData();
      }else{
        dataHolder[fieldName] = currentForm.getData();
      }
    }
  }
};




var FormListBase ={
  _isListForm : true,
 
  _createElementFromTemplate : function(){
    var domTemplate = document.getElementById(this.templateID);
    if(!domTemplate){
        return {};
    }
    var template = $(domTemplate);
  
    var newTemplate = template.clone();
//    $("*[id^='"+this.name+"_displaySequence']", newTemplate).text(self.displaySequence);
    newTemplate.show();
    template.before(newTemplate);
    var elements = this._getFieldsInContext(newTemplate, this.name);
    this._appendIndexToElementIDs(newTemplate, this.currentIndex);
    this.dom = newTemplate[0];
    this._updateDisplaySequenceInDom();
    return elements;
  },
   
  _appendIndexToElementIDs : function(newTemplate, index){
    newTemplate.attr("id", newTemplate.attr("id")+ "_"+index);
    var allContainIDElements = $("*[id]", newTemplate);
    allContainIDElements.each(function(i, item){
        item.id = item.id + "_" + index; 
    });
  },
  
  _updateDisplaySequenceInDom : function(){
    var self = this;
    $("*[id^='" + this.name + "_displaySequence']", $(this.dom)).text(self.displaySequence);
  },
  
  _form_init : function(model, name, parent, index, displaySequence){//form constructor
    this.model = model;
    this.name = name;
    this._buildFormTree(parent);
    
    this.currentIndex = index;
    this.displaySequence = displaySequence;
    this.templateID = this._deduceTemplateID();
    this.fields = this._createElementFromTemplate();
    if(displaySequence == 1 && !this.isAllowedDeleteLastItem()){
        $("[id^='"+this.name+"_deleteButton']", this.dom).hide();
    }
    if(displaySequence == 2 && !this.isAllowedDeleteLastItem()){
        var firstSibling = this._getFirstSibling(this._formTree.parent, this.name);
        $("[id^='"+this.name+"_deleteButton']", firstSibling.dom).show();
    }
    this._updateModelToFields();
  }
};



// ---------------------------------------------LogUtil-----------------------------------------------
var LogUtil = {
    log : function(msg, e){
        if(window.console){
            window.console.log(msg);
            if(e){
                window.console.log(e);
            }
        }
    }
};


//----------------------------------------------FormUtil-----------------------------------------------


var FormUtil = {
  inherit : function(subObject, baseObject) {
    for(var p in baseObject){
      if(!subObject[p]){
        subObject[p] = baseObject[p];
      }
    }
  },
  
  transformKeyword : function(model, keywordReplacementMap){
     if(FieldUtil.undefinedOrNull(keywordReplacementMap)){
         return;
     }
     for(var attr in model){
         
	  	 if(model[attr] instanceof Array){
            for(var i=0; i<model[attr].length; i++){
                this.transformKeyword(model[attr][i], keywordReplacementMap);
            }
	  	 }else if(typeof(model[attr]) == 'object'){
	  	  	this.transformKeyword(model[attr], keywordReplacementMap);
	     }else{
	        if(attr==null){
	            continue;
	        }
	     }  
	    if(keywordReplacementMap[attr]!=null){
             model[keywordReplacementMap[attr]]=model[attr];
             model[attr]=undefined;
         }
     }
     
  },
  
  restoreKeyword : function(model, keywordReplacementMap){
      
      var _reverseReplacementMap = function(map){
          var newMap = {};
          for(var attr in map){
              if(attr!=null && map[attr]!=null){
                  newMap[map[attr]]=attr;
              }
          }
          return newMap;
      };
      
      if(keywordReplacementMap == null){
          return;
      }
      var reverseMap = _reverseReplacementMap(keywordReplacementMap);
      this.transformKeyword(model, reverseMap);
  },
  
  setupKeywordReplacementMap : function(keywordReplacementMap){
      this.keywordReplacementMap = keywordReplacementMap;
      return this;
  },
  
  initFormRootWithConfig : function(configFunc, model, formRootName, callBack/*optional*/){
    var self = this;
    
    var _getDefaultModelWithoutHiddenValue = function(formRootName, defaultModel){//for add from empty list and default hidden
      var newModel = self.cloneObject(defaultModel);
      var current = formRootName;
      for(var attr in newModel){
        current = formRootName + "." + attr;
        if(newModel[attr] instanceof Array){
          if(self.configMap[current].isDefaultHide){
            newModel[attr] = undefined;
          }else{
            newModel[attr][0] = _getDefaultModelWithoutHiddenValue(current, newModel[attr][0]);
          }
        }else if(typeof(defaultModel[attr]) == 'object'){
          newModel[attr] = _getDefaultModelWithoutHiddenValue(current, newModel[attr]);
        }
      }
      return newModel;
    };
    
    var _buildDefaultModelForForms = function(formRootName, defaultModel){//for add from empty list
      var current = formRootName;
      for(var attr in defaultModel){
        current = formRootName + "." + attr;
        var currentDefault = current+".prototype.defaultModel";
        
          if(defaultModel[attr] instanceof Array){
            eval("var currentDefaultFunc = " + currentDefault +";");
            if(typeof(currentDefaultFunc) == "undefined"){
              var defaultModelWithoutHiddenValue = _getDefaultModelWithoutHiddenValue(current, defaultModel[attr][0]);
              eval(currentDefault + " = function(){ return "+JSON.stringify(defaultModelWithoutHiddenValue)+";}");
              _buildDefaultModelForForms(current, defaultModel[attr][0]);
            }
          }else if(typeof(defaultModel[attr]) == 'object'){
            eval("var currentDefaultFunc = " + currentDefault +";");
            if(typeof(currentDefaultFunc) == "undefined"){
              var defaultModelWithoutHiddenValue = _getDefaultModelWithoutHiddenValue(current, defaultModel[attr]);
              eval(currentDefault + " = function(){ return "+JSON.stringify(defaultModelWithoutHiddenValue)+";}");
              _buildDefaultModelForForms(current, defaultModel[attr]);
            }
          }  
      }
    };
    
    var _fillEmptyFields = function(model, pageModel){ //if some fields in pageModel not found in model, fill it in
      for(var prop in pageModel){
        if(FieldUtil.undefinedOrNull(model[prop])){
          model[prop] = self.cloneObject(pageModel[prop]);
          continue;
        }
        if(pageModel[prop] instanceof Array){
          for(var i=0; i<model[prop].length; i++){
            _fillEmptyFields(model[prop][i], pageModel[prop][0]);
          }
        }else if(typeof(pageModel[prop]) == "object") {
          _fillEmptyFields(model[prop], pageModel[prop]);
        }
      }
    };
    
    this._createFormFunction(formRootName);
    if(configFunc){
        configFunc();
    }
    var defaultModel = this._collectModelFromPage(formRootName);
    _buildDefaultModelForForms(formRootName, defaultModel);
    var pageModel = this._buildPageModel(defaultModel, formRootName);
    if(!FieldUtil.undefinedOrNull(model)){
      _fillEmptyFields(model, pageModel);
      pageModel = model;
    }
    
    this.transformKeyword(model, self.keywordReplacementMap);
    
    var formRoot = this._initRootFormsBy(pageModel, formRootName);
    
    formRoot.keywordReplacementMap = FieldUtil.undefinedOrNull(self.keywordReplacementMap) ? null : self.keywordReplacementMap;
    
    formRoot._invokeAllFunctionsInForms(formRootName);

    if(callBack){
        callBack();
    }
    return formRoot;
  },
    
  initFormRoot : function(model, formRootName, callBack/*optional*/){
  	return this.initFormRootWithConfig(null, model,formRootName, callBack);
  },
  
  _createFormFunction : function(formRootName){
    
    var createFunction = function(functionId, functionMap){
        if(!functionMap[functionId]){
            eval(functionId+"= function(){};");
            functionMap[functionId] = true;
        }
    };  
    
    var jRoot = $("[id='"+formRootName+"_template']");
    if(jRoot.length == 0){
      throw new Error("Cannot find form root with id: "+formRootName+"_template in _collectFormStructure. ");
    }
    var functionMap = {};
    $("[id$='_template']", jRoot).each(function(index){
        var id = this.id;
        var structureStr = id.substring(0, id.indexOf("_template"));
        var parts = structureStr.split(".");
        var currentId = parts[0];
        createFunction(currentId, functionMap);
        for(var i=1; i<parts.length; i++){
            currentId = currentId + "." + parts[i];
            createFunction(currentId, functionMap);
        }
    });  
  },
  
  _collectModelFromPage : function(formRootName){
    var jRoot = $("[id='"+formRootName+"_template']");
    if(jRoot.length == 0){
      throw new Error("Cannot find form root with id: "+formRootName+"_template");
  	}
    var rootDom = jRoot[0];
    return this._buildModel(rootDom, formRootName); 	  
  },
  
  _buildModel : function(templateDom, idPrefix){
  	var self = this;
    var dataHolder = {}; //stores real data model
  	var _sortByLength = function(a, b){
      return a.idWithoutTemplate.length - b.idWithoutTemplate.length;
    };
    
    var _buildFields = function(holder, idPrefix, dom){
      var allFields = $(".fields[id^='"+idPrefix+"']", dom);
      for(var m=0; m<allFields.length; m++){
      	var field = allFields[m];
      	var myId = field.id;
      	var fieldName = myId.substring(idPrefix.length+1);
      	if(fieldName.indexOf(".")<0){
      	  holder[fieldName] = "";
      	}
      }
    };
    
    var allTemplates = $("[id^='"+idPrefix+".'][id$='_template']", templateDom);
    var templateArray = [];
    self.configMap = {};
    for(var i=0; i<allTemplates.length; i++){
      var isMultiple = $(allTemplates[i]).hasClass("multipleTemplate");
      var isDefaultHide = $(allTemplates[i]).attr("defaultHide") == "true";
      var idWithoutTemplate = allTemplates[i].id.substring(0, allTemplates[i].id.indexOf("_template"));
      templateArray.push({item:allTemplates[i], isList:isMultiple, idWithoutTemplate: idWithoutTemplate});
      self.configMap[idWithoutTemplate] = {"isMultiple": isMultiple, "isDefaultHide": isDefaultHide};
    }
    
    templateArray.sort(_sortByLength);
    
    for(var j=0; j<templateArray.length; j++){
      var currentId = templateArray[j].idWithoutTemplate;
      var idParts = currentId.split(".");
      var current = dataHolder;
      var tempId = idParts[0];
      for(var k=1; k<idParts.length; k++){
      	tempId = tempId + "." + idParts[k];
      	if(!current[idParts[k]]){
      	  current[idParts[k]] = self.configMap[tempId].isMultiple ? [{}] : {};
      	}
      	current = self.configMap[tempId].isMultiple ? current[idParts[k]][0] : current[idParts[k]];
      	_buildFields(current, tempId, templateArray[j].item);
      }
    }
    
    return dataHolder;
  },
  
  _buildPageModel : function(defaultModel, formRootName){
  	var self = this;
  	var pageModel = this.cloneObject(defaultModel);
  	
    var removeUselessFields = function(parent, rootName){
      if(parent instanceof Array){
      	for(var i=0; i<parent.length; i++){
      	  removeUselessFields(parent[i], rootName);
      	}
      	return;
      }
      for(var attr in parent){
      	var current = parent[attr];
      	if(typeof(current) == 'object' || current instanceof Array){
      	  var currentId = rootName+"."+attr;
      	  if(self.configMap[currentId].isDefaultHide){
  		    parent[attr] = undefined;
      	  }else{
      	    removeUselessFields(current, currentId);
      	  }
      	}
  	  } 	
    };   	
  	
  	removeUselessFields(pageModel, formRootName);
  	
  	return pageModel;
  },
  
  _initRootFormsBy : function(model, formName){
    var currentForm = this._initRootPlainForm(model, formName);
    
    for(var property in model){
      var value = model[property];
      var subName = formName+"."+property;
      if(value && value.constructor == Object){
        currentForm._initSubFormsBy(value, subName);
      }
      if(value && value.constructor == Array){
        for(var i=0; i<value.length; i++){
          if(value[i].constructor != Object){
            continue;
          }
          currentForm._initSubFormsBy(value[i], subName, i, i+1);
        }
      }
    }
    return currentForm;
  },
  
  _initRootPlainForm : function(model, formName){
    var form = new Function("return new " + formName + "();")();
  
    FormUtil.inherit(form, FormBase);
    form._form_init(model, formName, null);
    return form;
  },
  
  _getTemplateId : function(elementId) {
    var id = elementId;
    var prefix = "";
    var suffix = "";
    if (id.indexOf("_addButton")>0) {
      prefix = id.substring(0, id.lastIndexOf("."));
      suffix = id.substring(id.indexOf("_addButton")+"_addButton".length);
    } else if(id.indexOf("_deleteButton")>0){
      prefix = id.substring(0, id.lastIndexOf("_deleteButton")); 
      suffix = id.substring(id.indexOf("_deleteButton")+"_deleteButton".length);  
    } else {
      prefix = id.substring(0, id.lastIndexOf("."));
      suffix = id.substring(id.indexOf("_"));
    }
    return prefix + "_template" + suffix; 
  },
  
  
  _deduceSubFormNameByAddButton : function(buttonId){
    return buttonId.substring(0, buttonId.indexOf("_"));
  },

  
  cloneObject : function(obj){
    if(obj == null || typeof(obj) != 'object'){
      return obj;
    }
    var temp = new obj.constructor();
    for(var key in obj){
      temp[key] = this.cloneObject(obj[key]);
    }
    return temp;
  },
  
  cleanAllValuesAndRemainArrayOnlyOneElement :function(obj){
    if(obj instanceof Array){
      obj.length = 1;
      this.cleanAllValuesAndRemainArrayOnlyOneElement(obj[0]);
    }else{
      for(var key in obj){
        if(typeof(obj[key]) == 'object'){
          this.cleanAllValuesAndRemainArrayOnlyOneElement(obj[key]);  
        }else{
          if(obj[key] === true || obj[key] === false){
            obj[key] = false;  
          }else{
            obj[key] = "";
          }
        }
      } 
    }  
  }
};


//----------------------------------------------FieldUtils-----------------------------------------------


var FieldUtil = {
  undefinedOrNull : function(value) {
    return (typeof value == "undefined") || (value == null);
  },
  setState: function(elements, state, doNotUpdateFieldIfHasValue){
    this._doSetState(elements, state, doNotUpdateFieldIfHasValue);
    return this;
  },
  getState: function(){
    return this._doGetState(this.fields);
  },
  getFieldsState: function(fields){
    return this._doGetState(fields);
  },
  copyState: function(copyTo, copyFrom){
    for(var fieldName in copyFrom){
      copyTo[fieldName]=copyFrom[fieldName];
    }
  },
  
  _doSetState: function(elements, state, doNotUpdateFieldIfHasValue){
  	if(this.undefinedOrNull(state)){
  		return;
  	}
    var confirmBackup = window.confirm;
    window.confirm = function(){return true;};

    try{
        for(var name in elements){
          var value = state[name];
          if(state[name] != undefined){
            this._setFieldValue(elements[name], value, doNotUpdateFieldIfHasValue);
          }
        }
    }
    finally{
        window.confirm = confirmBackup;
    }
  },
  
  _doGetState: function(fields){
    var state = {};
    for(var p in fields){
      var field = fields[p];
      if(field){
          if(field instanceof Array){
            state[p] = [];
            for(var i = 0, len = field.length; i < len; i++){
              state[p].push(this._doGetState(field[i]));
            }
          }
          else{
            state[p] = this._getFieldValue(typeof(field) == "function" ? field() : field);
          }
      }
    }
    return state;
  },

  _setFieldValue: function(fieldDom, value, doNotUpdateFieldIfHasValue){

     var jQueryDom = $(fieldDom);
     var valueChanged = false;
     if(fieldDom.type === "checkbox"){
       if(value===""){
       	  if(fieldDom.checked == true){
       	  	jQueryDom.click();
            valueChanged = true;
       	  }
       }else if(fieldDom.checked !== value){
         jQueryDom.click();
         valueChanged = true;
       }
     }
     else if(fieldDom.type === "radio"){
       if(value === true){
         jQueryDom.click();
         valueChanged = true;
       }
     }
     else if(fieldDom.tagName === "SELECT" && (!fieldDom.size || fieldDom.size == 1)){
       if(fieldDom.value !== value){
         if(value===""){
           fieldDom.selectedIndex = 0;
         }else{
           fieldDom.value = value;
         }
         jQueryDom.change();
         valueChanged = true;
       }
     }
     else if(fieldDom.tagName === "SELECT" && (fieldDom.size || fieldDom.size > 1)) {
         $(fieldDom).empty();
         if(value.constructor == Array) {
             for(var i = 0; i < value.length; i++) {
                 $(fieldDom).append("<option value = '" + value[i] + "'>" + value[i] + "</option>");
             }
         }
         jQueryDom.change();
         valueChanged = true;
     }
     else if(fieldDom.tagName === "INPUT" && $(fieldDom).hasClass("Wdate")) {
         if(value != "") {
           fieldDom.value = value;
           valueChanged = true;
         }else{
           fieldDom.value = "dd mmm yyyy";
         }
     }
     else if(fieldDom.tagName === "INPUT" || fieldDom.tagName === "TEXTAREA"){
       if(fieldDom.value !== value){
         fieldDom.value = value;
         valueChanged = true;
       }
     }
     else if(fieldDom.innerHTML !== value){
       fieldDom.innerHTML = value;
       valueChanged = true;
     }
    
     if(valueChanged){
       jQueryDom.blur();
     }
  },
  
  _getFieldValue: function(fieldDom){
    if(fieldDom.type === "checkbox" || fieldDom.type === "radio"){
      return fieldDom.checked;
    }
    else if(fieldDom.tagName === "INPUT" && $(fieldDom).hasClass("Wdate")){
      if($.trim(fieldDom.value) == "dd mmm yyyy"){
        return "";
      }
      return $.trim(fieldDom.value);
    }
    else if(fieldDom.tagName === "INPUT"){
      return $.trim(fieldDom.value);
    }
    else if(fieldDom.tagName === "TEXTAREA"){
      return fieldDom.value;
    }
    else if(fieldDom.tagName === "SELECT" && !(fieldDom.size && fieldDom.size > 1)){
      if(typeof(fieldDom.selectedIndex)==="undefined" || fieldDom.selectedIndex===null || fieldDom.selectedIndex < 0){
//        throw new Error("The select list ["+fieldDom.id+"] doesn't have any option selected."); //have problem in IE
        return "";
      } 
      var selectedOption = fieldDom.options[fieldDom.selectedIndex];
      if(selectedOption.getAttribute("value")){
        return selectedOption.getAttribute("value");
      }
      return "";
    } else if(fieldDom.tagName === "SELECT" && fieldDom.size && fieldDom.size > 1) {
        var arr = [];
        var options = fieldDom.options;
        if(options && options.length > 0) {
            for(var i = 0; i < options.length; i++) {
                if(options[i].value != "") {
                    arr.push(options[i].value);
                }
            }
        }
        return arr;
    }
    else {
      return fieldDom.innerHTML;
    }
  }
};


//----------------------------------------------Inherits-----------------------------------------------
FormUtil.inherit(FormListBase, FormBase);
