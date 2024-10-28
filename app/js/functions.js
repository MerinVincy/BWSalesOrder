// Refer script.js global varibales for any unkown variables
var selectData = {};
var apiSpecs = "";
var subCustomData = [];
// General Functions - start
var getSuffix = (suf,str) => str.substring(str.indexOf(suf)+1,str.length);
var getPrefix = (prf,str) => str.substring(0,str.indexOf(prf));
var hide = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).hide();
}
var show = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).show();
}
var mapFilter = obj => {
	let filteredMap = {};
  Object.keys(obj).forEach(key =>{
	  if(obj[key] && obj[key] != "-None-"){
		  filteredMap[key] = obj[key];
	  }
  });
  return filteredMap;
}
// Prevent char like e,+,- in number field
var preventNum = fieldList =>{
	for(let numField of fieldList){
		var invalidChars = ["-","+","e"];
		numField.addEventListener("keydown", function(e) {
			if (invalidChars.includes(e.key)) {
			  e.preventDefault();
			}
		  });
	}
	}
	preventNum($('input[type=number]'));
//ReplaceAll function
var replaceAll = (text,search,replaceWith) => text.split(search).join(replaceWith);	

var clearTabRow = tabBodyId => {
	tabBody = document.getElementById(tabBodyId);
	var firstcloneRow = tabBody.firstElementChild.cloneNode(true).outerHTML;
	tabBody.innerHTML = firstcloneRow;
} 

function delRow(thisValue){	
	var parNode = thisValue.closest("tr");	
	parNode.remove();
}

function roundToOne(num) {
    return +(Math.round(num + "e+1")  + "e-1");
}
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

var require = (values,by) => {
	for(value of values){
		if(by == "id"){
			let field = document.getElementById(value);
			field.required = true;
			field.className = field.className + " important";
		}
		else if(by == "name"){
			let fields = document.getElementsByName(value);
			for(i=1; i < fields.length; i++){
				field = fields[i];
				field.required = true;
				field.className = field.className + " important";
			}
		}
}
}
var notRequire = (values,by) => {
	for(value of values){
		if(by == "id"){
			let field = document.getElementById(value);
			field.required = false;
			field.className = field.className.replace(" important","");
		}
		else if(by == "name"){
			let fields = document.getElementsByName(value);
			for(i=1; i < fields.length; i++){
				field = fields[i];
				field.required = false;
				field.className = field.className.replace(" important","");
			}
		}
}
}
var getRecords = async entity =>{
	let responseData = [], pageVal = 1, boolVal=false;
	do {
		let response = await ZOHO.CRM.API.getAllRecords({Entity:entity,page:pageVal,per_page:200});
		if(response.data){
		responseData = [...responseData,...response.data];
		pageVal++;
		boolVal = response.info.more_records;
		}
	}
	while (boolVal);
	return responseData;
}
var getSingleRecord = async (entity,RecID) =>{
	var response = await ZOHO.CRM.API.getRecord({Entity:entity,RecordID:RecID});
	return response.data[0];
}
var getRelatedRecords = async (entity,recId,relatedList) =>{
	var response = await ZOHO.CRM.API.getRelatedRecords({Entity:entity,RecordID:recId,RelatedList:relatedList});
	return response.data;
}
var searchRecord = async (entity,searchQuery) =>{
	let responseData = [], pageVal = 1, boolVal=false;
	do {
		var response = await ZOHO.CRM.API.searchRecord({Entity:entity,Type:"criteria",Query:searchQuery,page:pageVal,per_page:200});
	//return response.data;
		if(response.data){
			responseData = [...responseData,...response.data];
			pageVal++;
			boolVal = response.info.more_records;
		}
	}
	while (boolVal);
	return responseData;
}
var getFields = async entity =>{
	var response = await ZOHO.CRM.META.getFields({Entity:entity});
	return response.fields;
}

function addCommas(x) {
    return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
}
