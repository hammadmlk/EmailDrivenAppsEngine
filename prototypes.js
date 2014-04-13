//subtract days from a date
Date.prototype.subtractDays=function(days){
    if (arguments.length===1){
        if (typeof days !== 'number') return;
        this.setDate(this.getDate() - days);
        return this;
    }
    return this;
}


// check if value in in array
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] === needle) return true;
   }
   return false;
}