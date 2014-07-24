/*! Tiny Pub/Sub - v0.7.0 - 2013-01-29
* https://github.com/cowboy/jquery-tiny-pubsub
* Copyright (c) 2013 "Cowboy" Ben Alman; Licensed MIT */
define(function(require,exports,module) {
	(function($) {
	
	  var o = $({});
	  
	  var slice = Array.prototype.slice;
	  
	  $.subscribe = function() {
	    o.on.apply(o, arguments);
	  };
	
	  $.unsubscribe = function() {
	    o.off.apply(o, arguments);
	  };
	
	  $.publish = function(evtName) {
	  	var args = [evtName];
	  	if(arguments.length > 1) {
	  		var params = slice.call(arguments , 1);
	  		args.push(params);
	  	}
	    o.trigger.apply(o, args);
	  };
	  
	}(jQuery));
});