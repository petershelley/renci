//this code is for the code.gs on google app script. Not sure if you can pull and push from git to google.

function onOpen() {
  DocumentApp.getUi().createMenu('Picker')
      .addItem('choose documents', 'showPicker')
      .addToUi();
}

/**
 * Displays an HTML-service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showPicker() {
  var html = HtmlService.createHtmlOutputFromFile('dialog.html')
      .setWidth(600)
      .setHeight(425)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showModalDialog(html, 'Select a file');
  
}

/** sendMeeting takes the list of Id and gets the data from the current documents by using .openById().getBody().getText()
*  Once each documents contents is copied the current text (body) is made via a document or email
*  MailApp is used to send the email (you can add recipients via their email, will need to ask sarah about this info and how she wants handled)
*THis funtion does not parse the documents rather, it adds all contents to the var body.
*/
  function sendMeeting(Id) {
      //var body = [];
   var length = Id.length;
   var email = '';
   var todayDate = new Date();
   for(i =0; i<length; i++){
      // body.push(DocumentApp.openById(Id[i]).getBody().getText()+ '\n---------------------------\n');
     
     email += parseNotes(DocumentApp.openById(Id[i]).getBody().getText());
     
   }
   DocumentApp.getActiveDocument().getBody().setText(email);
  MailApp.sendEmail('pricelev@gmail.com',
                    'meeting notes from '+todayDate.getMonth() + ' - ' + todayDate.getDate(),
                    email);
  }

/** CurrentString is the string from the whole text, we will use .split to create a new array of the document tokenized into single line strings
* the for loop itterates through the array of strings and grabs the ones that start with a '['
* returns returnString which is a string of all action items.
*/
function parseNotes(currentString){
      var splitNotes = currentString.split('\n');
      var length = splitNotes.length;
      var returnString = '';
  for(i =0; i<length; i++){
    if(splitNotes[i].charAt(0) === '['){
      returnString += splitNotes[i] + '\n\n';
    }
  }
    return returnString;
}


/**
 * Gets the user's OAuth 2.0 access token so that it can be passed to Picker.
 * This technique keeps Picker from needing to show its own authorization
 * dialog, but is only possible if the OAuth scope that Picker needs is
 * available in Apps Script. In this case, the function includes an unused call
 * to a DriveApp method to ensure that Apps Script requests access to all files
 * in the user's Drive.
 *
 * @return {string} The user's OAuth 2.0 access token.
 */
function getOAuthToken() {
//  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}
