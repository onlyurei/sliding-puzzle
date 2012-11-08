// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.copy = function(from, to) {
	for (var i = 0; i < from.length; i++) {
		to.push(from[i]);
	}
	return to;
};