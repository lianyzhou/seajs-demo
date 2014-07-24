define(function(require,exports,module) {
	$.builder = function(node) {
		var nodes = $("[node-type]",node) , ret = {};
		nodes.each(function(i , dom) {
			var nodeType = $(dom).attr("node-type");
			var match = ret[nodeType];
			if(match) {
				if(!$.isArray(match)) {
					ret[nodeType] = [match];
					match = ret[nodeType];
				}
				match.push(dom);
			} else {
				ret[nodeType] = dom;
			}
		});
		return ret;
	}
});