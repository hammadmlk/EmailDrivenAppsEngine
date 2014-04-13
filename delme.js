// check if value in in array
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] === needle) return true;
   }
   return false;
}

var express = require('express');

var app = express();

app.listen(5011);

console.log('\n\n\n\n\n\n\n* Started *');

var boxes = {"A IMP":{"attribs":["\\HasNoChildren"],"delimiter":"/","children":null},"A Student Events":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"A selfStudy":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"ATS Institute":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Archived by Mailstrom":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"CS 370":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Facebook Notifications":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"FreeLancer":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"G.P Seminar (Tourism-USA)":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"GradSchoolStuff":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"INBOX":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Library":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"MIS Apps":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Migrated":{"attribs":["\\Noselect","\\HasChildren"],"delimiter":"/","children":{"Read":{"attribs":["\\HasNoChildren"],"delimiter":"/"}}},"Notes":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Oweek":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Psi-Fi Old":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"PsiFi 12":{"attribs":["\\HasChildren"],"delimiter":"/","children":{"Academic Events":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Other Depts":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Registerations":{"attribs":["\\HasNoChildren"],"delimiter":"/"}}},"Registerations":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"SPADES":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"SSE":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Smart Grid":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"Study":{"attribs":["\\HasChildren"],"delimiter":"/","children":{"DIP":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"algo":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"databases":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"netcentric":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"soft.engg.":{"attribs":["\\HasNoChildren"],"delimiter":"/"}}},"TA":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"[Gmail]":{"attribs":["\\Noselect","\\HasChildren"],"delimiter":"/","children":{"All Mail":{"attribs":["\\HasNoChildren","\\All"],"delimiter":"/","special_use_attrib":"\\All"},"Drafts":{"attribs":["\\HasNoChildren","\\Drafts"],"delimiter":"/","special_use_attrib":"\\Drafts"},"Important":{"attribs":["\\HasNoChildren","\\Important"],"delimiter":"/"},"Sent Mail":{"attribs":["\\HasNoChildren","\\Sent"],"delimiter":"/","special_use_attrib":"\\Sent"},"Spam":{"attribs":["\\HasNoChildren","\\Junk"],"delimiter":"/","special_use_attrib":"\\Junk"},"Starred":{"attribs":["\\HasNoChildren","\\Flagged"],"delimiter":"/","special_use_attrib":"\\Flagged"},"Trash":{"attribs":["\\HasNoChildren","\\Trash"],"delimiter":"/","special_use_attrib":"\\Trash"}}},"a todo":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"dadz":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"label1":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"label2":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"label3":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"label4":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"matlab projects":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"opeaned":{"attribs":["\\HasNoChildren"],"delimiter":"/"},"socialTV":{"attribs":["\\HasNoChildren"],"delimiter":"/"}};


var arr = makeArray([], "", boxes)

console.log(arr);

for(var key in boxes) {
   //console.log(key, boxes[key]);
}

function makeArray(arr, delimiter, boxes){ 
    if (boxes === null || typeof boxes === 'undefined') return arr;
    
    for(var key in boxes) {
       //(key, boxes[key])
       if(boxes[key].attribs.contains('\\Noselect')){
            var new_delimiter = delimiter+key+boxes[key].delimiter;
            arr = makeArray(arr, new_delimiter, boxes[key].children);
       }
       else{
            arr.push(delimiter+key);
       }
       
    }
    
    return arr;
    
}




