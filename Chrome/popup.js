function getCurrentTab(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    callback(tabs[0]);
  });
}

function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function json(response) {  
  return response.json()  
}

function setValue(key, value)
{
  localStorage.setItem(key, value);
}

function getValue(key, defaultValue)
{
  return localStorage.getItem(key) || defaultValue;
}

function onSaveClick(e)
{
  var catStr = getValue("categories","");
  var currentVal = document.querySelector("#tags").value;
  if(catStr.indexOf(currentVal) < 0)
  {
    catStr += ","+currentVal;
    setValue("categories", catStr);
  }
  
  e.target.disabled = true;
  e.target.value = "Saving...";
  var sheetWebApp = "https://script.google.com/macros/s/AKfycbwo0ftgCyT7wBSL-8o25BgkJ6V3cNGaVDGjRrAOROQQGyI6rxqJ/exec?";
  var title = document.querySelector("#textTitle").value;
  var url = document.querySelector("#textURL").value;
  var queryStr = "Title="+encodeURIComponent(title) + "&URL="+encodeURIComponent(url)+"&Category="+encodeURIComponent(currentVal);
  fetch(sheetWebApp+queryStr, {mode: 'cors'}).then(status).then(function(){console.log("Successful"); window.close();}).catch(function(error){alert('request failed' + error);window.close();});
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab(function(tab) {
    var availableTags = getValue("categories","").split(",");

    //jQuery context.
    $(function() {
      $("#tags" ).autocomplete({
        source: availableTags
      });
    });

      document.querySelector("#textTitle").value = tab.title;
      document.querySelector("#textURL").value = tab.url;
      document.querySelector("#tags").focus();
      document.querySelector('#buttonSubmit').addEventListener("click", onSaveClick);
  });
});
