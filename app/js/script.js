//Fields and Global Varibales
var currDate = new Date();
var currentUser;
var ownerID;
var selectedSalesOrder;
var emptyOpt = '<option value="">Please Select</option>'; 
var customerName = document.getElementById("customerName");
var brandTemplate = document.getElementById("brandTemplate"); 
var billingAddress = document.getElementById("billingAddress"); 
var billingCity = document.getElementById("billingCity");  
var billingStreet = document.getElementById("billingStreet");  
var billingState = document.getElementById("billingState");  
var billingCode = document.getElementById("billingCode");  
var billingCountry = document.getElementById("billingCountry"); 
var shippingAddress = document.getElementById("shippingAddress");
var shippingCity = document.getElementById("shippingCity");  
var shippingStreet = document.getElementById("shippingStreet");  
var shippingState = document.getElementById("shippingState");  
var shippingCode = document.getElementById("shippingCode");  
var shippingCountry = document.getElementById("shippingCountry"); 
var salesOrderDate = document.getElementById("salesOrderDate"); 
var orderDueDate = document.getElementById("orderDueDate");
var salesOrderNo = document.getElementById("salesOrderNo"); 
var referenceNo = document.getElementById("referenceNo");
var customerNotes = document.getElementById("customerNotes");
var termsConditions = document.getElementById("termsConditions"); 
var shippingCharges = document.getElementById("shippingCharges"); 
var adjustment = document.getElementById("adjustment"); 
var grandTotal = document.getElementById("grandTotal");
var subTotal = document.getElementById("subTotal");
var itemLis = document.getElementsByName("item");
require([customerName.id,brandTemplate.id,billingAddress.id,shippingAddress.id,salesOrderDate.id,salesOrderNo.id,grandTotal.id,subTotal.id],"id");
var initializeData = () => {
    customerName.innerHTML = emptyOpt;
    brandTemplate.innerHTML = emptyOpt;
    billingAddress.innerHTML = emptyOpt;
    shippingAddress.innerHTML = emptyOpt;
}

var rowCount = 1;
async function addRow(thisVal){
    rowVal = rowCount;   
    let mandatoryCheck = false;
    if(thisVal != "")
    {
        appendTabRow(rowVal);
        rowCount++;
    }
    else{
        mandatoryCheck = false;
        flag = true;
        swal("Invalid Selection","Select ","info");
    }    
    return rowVal;
}

function filterDropdown(input) {
    const filter = input.value.toLowerCase();
    const dropdown = document.getElementsByName('item')[0];
    const options = dropdown.options;
  
    // Loop through all options and hide those that don't match the search
    for (let i = 0; i < options.length; i++) {
      const optionText = options[i].text.toLowerCase();
      if (optionText.indexOf(filter) > -1) {
        options[i].style.display = "";
      } else {
        options[i].style.display = "none";
      }
    }
  }
  
  function selectItem(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const row = selectElement.closest('tr');
    const unitPriceInput = row.querySelector(`input[name="p_unitPrice"]`);
    const unitPriceShowInput = row.querySelector(`input[name="p_unitPriceshow"]`);
    const descriptionTextArea = row.querySelector(`textarea[name="p_description"]`);
    const quantityInput = row.querySelector(`input[name="p_quantity"]`);
    const unitPrice = selectedOption.dataset.price;
    const description = selectedOption.dataset.description;
    unitPriceInput.value = unitPrice; 
    unitPriceShowInput.value = `$${parseFloat(unitPrice).toFixed(2)}`; 
    descriptionTextArea.value = description;
    quantityInput.value = 0;
    calcAmount(null, quantityInput);
}

function calcAmount(event, Input) {    
    const row = Input.closest('tr');    
    const quantityInput = row.querySelector(`input[name="p_quantity"]`);
    const unitPriceInput = row.querySelector(`input[name="p_unitPrice"]`);
    const amountInput = row.querySelector(`input[name="p_amount"]`);
    const amountShowInput = row.querySelector(`input[name="p_amountshow"]`);
    const discountInput = row.querySelector(`input[name="p_discount"]`);    
    const taxInput = row.querySelector(`input[name="p_tax"]`);
   
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const tax = parseInt(taxInput.value) || 0;
    
    const rate = unitPrice * quantity;
    const totalAmount = parseFloat(rate) - parseFloat(discount) + parseFloat(tax);    
    amountInput.value = totalAmount.toFixed(2); 
    amountShowInput.value = `$${totalAmount.toFixed(2)}`; 
    calculateSubTotal();
}

function calculateSubTotal() {
  let subTotalVal = 0;   
    $('#itemTable tbody tr').each(function() {
        let total = $(this).find('input[name="p_amountshow"]').val();   
        total = total ? parseFloat(total.replace(/[^0-9.-]+/g, "")) : 0;
        subTotalVal += total;
    });

    var subtotalCalData = document.getElementById("subTotal");
    subtotalCalData.value = subTotalVal;
    CalculateGrandTotal();
}

function CalculateGrandTotal(){
  function parseValidNumber(value) {
    let number = parseFloat(value);
    return isNaN(number) ? 0 : number;  
}
  var STotal = parseValidNumber(document.getElementById("subTotal").value);
  var shippingCharges = parseValidNumber(document.getElementById("shippingCharges").value);
  var adjustment = parseValidNumber(document.getElementById("adjustment").value);
  var grandTotal = STotal + shippingCharges - adjustment;
  document.getElementById("grandTotal").value = grandTotal.toFixed(2);
}  

var appendTabRow = (rowIndex) =>{
	var subTabBody = document.getElementById("itemBody");
	var firstcloneRow = subTabBody.firstElementChild.cloneNode(true);	
	var rowText = replaceAll(firstcloneRow.innerHTML,"###",rowIndex);
  rowText = replaceAll(rowText,"SelExample","SelExample_" + rowIndex);
	var firstRow = document.createElement("tr");
  firstRow.setAttribute('index', rowIndex);
	firstRow.innerHTML = rowText;
	firstRow.style = "display: true;";
  //$(firstRow).find('.hiddenctrl').remove();
  $(firstRow).find('select').prop('disabled', false); 
  $('#SelExample_' + rowIndex).select2(); 
  $(firstRow).find('#SelExample_' + rowIndex).select2({
      templateResult: formatOption, 
      templateSelection: formatOptionSelection
  });
  const firstSelect2Element = document.querySelector('span[data-select2-id]');
  const dataSelect2Id = firstSelect2Element.getAttribute('data-select2-id');
  const select2Element = firstRow.querySelector('[data-select2-id="'+dataSelect2Id+'"]');  
  if (select2Element) {
    select2Element.remove();
  }
	subTabBody.appendChild(firstRow);
	preventNum($('input[type=number]'));
}

function formatOption(option) {          
  if (!option.id) {
      return option.text; 
  }
  var $option = $('<div style="font-size:12px;"><strong>' + option.text + '</strong></div>');
  if(option.disabled == false)
  {
    if(option.element.dataset.favorite == "false")
    {
      $option = $(
        '<div style="font-size:12px;"><strong>' + option.text + '</strong><br>' +
        'Invoice Count: ' + $(option.element).data('count') + '</div>'
    );
    }
   else 
   {
    $option = $(
      '<div style="font-size:12px;"><strong>' + option.text + '</strong><br>' +
      'Favorite' + '<br>' +
      'Invoice Count: ' + $(option.element).data('count') + '</div>'
  );
   }
  }       
  return $option;
}

function formatOptionSelection(option) {
  return option.text;
}

function submitFun(submitType){   
    currentUser = currentUser || [];
    if(currentUser.length > 0){
      OwnerIDValue = currentUser[0].id; 
    }
    else{
      OwnerIDValue = ownerID;
    } 
    const custID = $('#customerName').val();
     let tableData = [];
     const rows = document.querySelectorAll('#itemBody tr');
     rows.forEach((row) => {
      const rowIndex = row.getAttribute('index');      
      if(rowIndex != "###")
      {
        let rowObject = {
          product: {"id":document.getElementById("SelExample_"+rowIndex).value},
          product_description: document.getElementById("p_description_"+rowIndex).value,
          unit_price: parseFloat(document.getElementById("p_unitPrice_"+rowIndex+"_show").value),
          quantity: parseInt(document.getElementById("p_quantity_"+rowIndex).value),
          total: parseFloat(document.getElementById("p_amount_"+rowIndex+"_show").value)
        };       
        tableData.push(rowObject);    
      } 
    });
  var samplesalesorder = false;
  if(submitType == "saveAsDraftBtn")
  {
    samplesalesorder = true;
  }
  let salesOrderData = {
    id: selectedSalesOrder,
    Subject: $('#customerName').text(),
		Account_Name: custID,
		Product_Details:tableData,
		Shipping_Address:{"id":$('#shippingAddress').val()},	
		Billing_Address:{"id":$('#billingAddress').val()},
		Sub_Total:parseFloat($('#subTotal').val()),
		Customer_Notes:$('#customerNotes').val(),
		Terms_and_Conditions:$('#termsConditions').val(),
		Sales_Order_Date:$('#salesOrderDate').val(),
		Reference:$('#referenceNo').val(),
		Grand_Total:parseFloat($('#grandTotal').val()),
		Adjustment:parseFloat($('#adjustment').val()),
		Owner:{"id":OwnerIDValue},
    Status:"Draft",
    Sample_Sales_Order: samplesalesorder
	};
  salesOrderData = mapFilter(salesOrderData);
  console.log(salesOrderData);  
	currentUser = currentUser || [];
	let redirectUrl ="https://crm.zoho.com/crm/org843559655/tab/Accounts/";
  if(!salesOrderData.id){
    ZOHO.CRM.API.insertRecord({Entity:"Sales_Orders",APIData:salesOrderData}).then(function(data){
        let respData = data.data;
        if(respData){				
            swal(respData[0].code,respData[0].message,"success");
            window.parent.parent.window.location = redirectUrl+custID + "/canvas/6119486000000493867";
            location.reload();
        }
        else{
            swal("Failed","Unknown Error","error");
        }
        },function(err){
            console.log(err);
            swal(err.data[0].code,JSON.stringify(err.data[0].details),"error");
        });
      }
      else{
        var config={
          Entity:"Sales_Orders",
          APIData:salesOrderData
          }
          console.log(config);
          ZOHO.CRM.API.updateRecord(config)
          .then(function(data){
            let respData = data.data;
           if(respData){
            swal(respData[0].code,respData[0].message,"success");
            window.parent.parent.window.location = redirectUrl+custID + "/canvas/6119486000000493867";
            location.reload();
           }
           else{
             swal("Failed","Unknown Error","error");
           }
          },function(err){
          console.log(err);
          swal(err.data[0].code,JSON.stringify(err.data[0].details),"error");
        });
      }
    return false;
}

document.getElementById("salesForm").onsubmit = function(thisVal){
  return submitFun(thisVal.submitter.id);
}

function dropDownSort(ddID){
	var dropdown = $('#' + ddID);
	// Get the options and sort them
	var options = dropdown.find('option');
	options.sort(function(a, b) {
		return a.text.localeCompare(b.text);
	});
	// Clear the dropdown
	dropdown.empty();
	// Add the sorted options to the dropdown
	$.each(options, function(i, option) {
		dropdown.append(option);
	});
}

var CRMDataHandler = {};
ZOHO.embeddedApp.on("PageLoad",function(data){
	asyncFun = async () =>{
		$('#loader').fadeIn('slow');
    	$('#content').hide();
		currentUser = (await ZOHO.CRM.CONFIG.getCurrentUser()).users;
		console.log(currentUser);
        if (data && data.data.customer_id) {
            CRMDataHandler.getEntityData = () => {
              return data;
            };
          } else{
            CRMDataHandler.getEntityData = () => {
              console.log("data - " + data);
              return {};
            };
          }
          var custData = CRMDataHandler.getEntityData().data;          
          customerName.innerHTML ='<option value="'+custData.customer_id+'">'+custData.customer_name+'</option>';   
          var crmCustData = await getSingleRecord("Accounts", custData.customer_id);      
          ownerID = crmCustData.Owner.id;
          var crmBrand = await getSingleRecord("Brands", custData.brand);      
          brandTemplate.innerHTML ='<option value="'+custData.brand+'">'+crmBrand.Name+'</option>';    
          billingAddress.onchange = event => {		
            crmBillingAddress.map(data => {
                if(data.id == billingAddress.value){				
                    billingCity.value = data.City_Town;
                    billingCode.value = data.Zip; 
                    billingCountry.value = data.Country; 
                    billingState.value = data.State_Province; 
                    billingStreet.value = data.Address_Title;
                }
            });		            
        }
        shippingAddress.onchange = event => {		
            crmShippingAddress.map(data => {
                if(data.id == shippingAddress.value){				
                    shippingCity.value = data.City_Town;
                    shippingCode.value = data.Zip; 
                    shippingCountry.value = data.Country; 
                    shippingState.value = data.State_Province; 
                    shippingStreet.value = data.Address_Title;
                }
            });	
        }
          var queryBillString = "(Customer:equals:" + custData.customer_id + ") and (Address_Type:equals:Billing) or (Address_Type:equals:Billing and Shipping)";    
          var crmBillingAddress = await searchRecord("Address", queryBillString);    
          if(crmBillingAddress.length == 1)
            {
                billingAddress.innerHTML = crmBillingAddress.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");  
                $("#billingAddress").val(crmBillingAddress[0].id).change();
            }
            else{
              billingAddress.innerHTML = emptyOpt+crmBillingAddress.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");  
              var defaultBilling = crmBillingAddress.filter(data => data.Preferred_Billing_Address == true).map(data => data.id);
              if(defaultBilling != "")
              {
                $("#billingAddress").val(defaultBilling).change();
              }              
            }
          var queryShipString = "(Customer:equals:" + custData.customer_id + ") and (Address_Type:equals:Shipping) or (Address_Type:equals:Billing and Shipping)";
          var crmShippingAddress = await searchRecord("Address", queryShipString);    
          if(crmShippingAddress.length == 1)
          {
            shippingAddress.innerHTML = crmShippingAddress.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");  
            $("#shippingAddress").val(crmShippingAddress[0].id).change();
          }
          else 
          {
            shippingAddress.innerHTML = emptyOpt+crmShippingAddress.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join(""); 
            var defaultShipping = crmShippingAddress.filter(data => data.Preferred_Shipping_Address == true).map(data => data.id);
            if(defaultShipping != "")
            {
              $("#shippingAddress").val(defaultShipping).change(); 
            }             
          }        
        $("#SelExample").select2({
          templateResult: formatOption, 
          templateSelection: formatOptionSelection 
      });        
      let Products = await searchRecord("Products", "(Product_Active:equals:true)") || [];
      let salesOrders = await getRecords("Sales_Orders") || [];
      console.log(salesOrders);
      let productCounts = [];
      
      for (let items of Products) {
          var count = salesOrders.filter(function(order) {
              return order.Product_Details.some(function(productDetail) {
                  return productDetail.product.id === items.id;
              });
          }).length;     
          productCounts.push({
              product: items,
              count: count,
              favorite: items.Favorite
          });
      }
      
      productCounts.sort(function(a, b) {
        if (a.favorite === b.favorite) {
            return b.count - a.count; 
        }
        return a.favorite ? -1 : 1; 
    });

      
      for (let items of productCounts) {	
        for (let productvalue of itemLis) {        
          // let divider = document.createElement("option");
          // divider.disabled = true; 
          // divider.setAttribute("class", "divider"); 
          // let dividerText = "_".repeat(85); 
          // divider.text = dividerText;
          // productvalue.add(divider);    
          let opt = document.createElement("option");
          opt.text = items.product.Product_Name;
          opt.value = items.product.id;                  
          opt.setAttribute("data-count", items.count || "0");           
          opt.setAttribute("data-price", items.product.Unit_Price || 0);
          opt.setAttribute("data-description", items.product.Description || "");
          opt.setAttribute("data-favorite", items.favorite);
          productvalue.add(opt); 
      }   
    }
    
    
      //  const itemData = document.querySelector('.itemdropdown');
      //  itemData.appendChild(itemList);
        // updateOptions();
	// var crmDeals = await getRecords("Deals");
	// enquiryName.innerHTML =emptyOpt+crmDeals.map(data => '<option value="'+data.id+'">'+data.Deal_Name+'</option>').join("");
	// var getAllQuotes = await getRecords("Quotes");
	// $("#quoteBody")[0].innerHTML =getAllQuotes.map(data => {
	// 	if(data.Quote_Stage == "Draft"){
	// 		let tabRow = '<tr>';
	// 		tabRow += '<td><i class="fa fa-pen btn" data-dismiss="modal" id='+data.id+' onclick="editMode(this.id)"></i></td><td>'+data.Quote_Date+'</td><td>'+data.Subject+'</td><td>'+data.Quote_Stage+'</td><td>'+((data.Deal_Name || {}).name || "")+'</td><td> ₹ '+data.Grand_Total+'</td>';
	// 		tabRow += '</tr>';
	// 		return tabRow;
	// 	}
	// }).join("");
	
	$('#loader').fadeOut('slow');
    $('#content').fadeIn('slow');	
}
asyncFun();
});
//initialize the widget
ZOHO.embeddedApp.init();