var _buttons = document.getElementById("parse-buttons");
var buttons = _buttons.innerText.trim().split(";");
if(buttons.length > 0) {
  for(var i = 0; i < buttons.length; i++) {
    var button = buttons[i].trim();
    if(button != null && button != "") {
      var buttonInfo = button.split("|");

      var buttonText = buttonInfo[0];
      var buttonContent = buttonInfo[1];

      $("body").append("<button onclick='showContent(" + i + ")'>" + buttonText + "</button>");
      $("body").append("<div id='content_" + i + "'" + " class='hidden'>" + parseContent(buttonContent) + "</div>");
    }
  }
}
document.body.removeChild(_buttons);

function isImage(str) {
  return str.indexOf("https://") == 0;
}

function parseContent(str) {
  if(!isImage(str)) return str;
  else return "<img src='" + str + "' />"
}

function showContent(id) {
  var $elem = $("#content_" + id);
  if(!$elem.is(":visible")) $elem.hide().slideDown();
  else $elem.show().slideUp();
}
