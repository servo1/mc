# mc - as in Master of Ceremonies

"Event emitting" with chained and sequential event lists

largely based off of: https://github.com/jeromeetienne/microevent.js
and some of https://github.com/primus/eventemitter3

methods:

`on('eventname', function)`
-set function for event name

`emit('eventname', param1, param2, etc...)`
-triggers all associated on functions in sequence they were provided

`once('eventname', function)`
-triggers only once and then destroyed

`removeAllListeners()`
-destroys all events and associated data  

`removeListener('event', fn)`  the function is optional but will match function if included  
-completely removes event and/or associated function(s)

`chain('event', param1, param2, param3, cb)`
-goes through associated event list and passes results from one to the next until hitting the CB

`listeners(event, exists)`  exists is optional  
if exists, returns boolean if exists  
if exists is not supplied, then returns array of associated functions  

`mixin(obj)`
takes an object or function and appropriately adds functions to it.  

For use int the browswer or server side.

Totally vanilla javascript, minimal and still has a few lingering comments but works.

Example implementation:    
```javascript
var telephone = {};  
mc.mixin(telephone);  
// or just var telephone = new mc();  
  
function joespeaks(heard, cb){  
  console.log(heard);  
  cb(null, "i heard you said this");  
}  
function bobspeaks(heard, cb){  
  console.log(heard);  
  cb(null, "i heard you say fish");  
}  
function tinaspeaks(heard, cb){  
  console.log(heard);  
  cb(null, "i hear you did it");  
}  
function jamiespeaks(heard, cb){  
  console.log(heard);  
  cb(null, "what did I do?");  
}  
  
telephone.on('listen', jospeaks);  
telephone.on('listen', bobspeaks);  
telephone.on('listen', tinaspeaks);  
telephone.on('listen', jamiespeaks);  
  
telephone.chain('listen', 'I heard you say dis', function(er, res){  
  console.log(er, res);  
});  
  
telephone.emit('listen', 'I hear you need this');  
```
==  
  
* Chain simply runs down the list passing from one to the next and also delivers the end result to the callback.
* It automatically detects the number of arguments at each event level. Anytime a callback is called with the first argument, it stops running through the event list and delivers the error to the event callback.  
* It is written in a long form to pick up the number of arguments with no use of call or apply type function.  

  This is totally vanilla js context drive - or you can say "contextless".  This is because there is no binding to objects used.  
  
In some instances, you would use .bind or set a context which you can do on your own.  Although, this is just plain vanilla with no additions and is apart of utilizing more of the native engine optimization and plain JS.  
