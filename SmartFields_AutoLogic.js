
/* Acrobat JavaScript to add to the document via Tools > JavaScript > Document JavaScripts.
   Name the script: "SmartFields_AutoLogic"
*/

/* 1) Auto-fill date on open (YYYY-MM-DD) */
function pad(n){return n<10?"0"+n:n;}
var d = new Date();
var datestr = d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
try {
    if(this.getField("date_field")) this.getField("date_field").value = datestr;
} catch(e){}

/* 2) Ref -> Admin mapping (run on open and when ref_field changes) */
function mapRefToAdmin() {
    try {
        var refF = this.getField("ref_field");
        var adminF = this.getField("admin_field");
        if(!refF || !adminF) return;
        var v = refF.valueAsString.toLowerCase();
        if(v.indexOf("treasury") !== -1) adminF.value = "FINANCE UNIT";
        else if(v.indexOf("admin") !== -1) adminF.value = "CENTRAL ADMINISTRATION";
        else if(v.indexOf("secretariat") !== -1) adminF.value = "SECRETARIAT UNIT";
        else adminF.value = "";
    } catch(e){}
}

/* Run mapping on open */
mapRefToAdmin();

/* Also attach to ref_field's Keystroke or Validate event (set via Field Properties > Format/Validate > Run custom JavaScript on Blur):
   Example per-field script (to paste into the ref_field's "Validate" action):
   mapRefToAdmin();
*/

/* 3) Reset button script (assign as Mouse Up action for a button named "Reset") */
function resetFormConfirmed() {
    try {
        if(app.alert("Clear all fields? This cannot be undone.","Reset Confirmation",2) == 4) { // Yes = 4
            var names = ["great_minds_field","secretariat_field","admin_field","date_field","ref_field","headline","details","signature"];
            for(var i=0;i<names.length;i++){
                var f = this.getField(names[i]);
                if(f) f.value = "";
            }
        }
    } catch(e){}
}

/* 4) Validation on Save/Submit - add as 'Will Save' document-level script */
function validateBeforeSave(){
    try {
        var missing = [];
        var headline = this.getField("headline");
        var details = this.getField("details");
        var sign = this.getField("signature");
        if(!headline || String(headline.value).replace(/^\s+|\s+$/g,"") == "") missing.push("Headline");
        if(!details || String(details.value).replace(/^\s+|\s+$/g,"") == "") missing.push("Details");
        if(!sign || String(sign.value).replace(/^\s+|\s+$/g,"") == "") missing.push("Signature");
        if(missing.length>0){
            app.alert("Please fill the required fields before saving:\n\n" + missing.join(", "));
            event.rc = false; // cancel save
        }
    } catch(e){}
}

/* To wire the Will Save event: add a small document-level script named 'WillSaveHook' with:
   validateBeforeSave();
*/

/* Notes:
 - To attach mapRefToAdmin to ref_field validate: open Field Properties -> Actions -> Run a JavaScript -> copy the single line: mapRefToAdmin();
 - To assign Reset button: create a button field named "Reset" and set its Mouse Up action to: resetFormConfirmed();
 - To set the date auto-fill on open, paste this entire script into a Document JavaScript (Tools > JavaScript > Document JavaScripts).
*/
