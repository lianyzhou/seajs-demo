define(function(require,exports,module) {
	require("lib/sea/plugin-style");
	require("lib/sea/plugin-text");
	require("lib/jquery/asyncbox/asyncbox");
	require("lib/ejs");
	require("lib/underscore");
	require("lib/jquery/jquery-ui/jquery-ui");
	require("kit/builder");
	require("kit/pubsub");
	var globalConfig = require("common/config");
	$.showErrorTip = function(msg) {
		asyncbox.tips(msg , "error" , globalConfig.tipTimer);
	};
	$.getActionData = function(node) {
		var $dom = $(node);
		var ret = {};
		var actionData = $dom.attr("action-data") || '';
		if(actionData) {
			var arr = actionData.split("&");
			$(arr).each(function(i , param) {
				var obj = param.split("=");
				ret[obj[0]] = obj[1];
			});
		}
		return ret;
	};
	$.delegatedEvent = function(node) {
		var that = {} , map = {} , $node = $(node);
		that.add = function(actType , evtName , func) {
			$node.on(evtName , '[action-type="' + actType + '"]' , func);
			if(!map[actType]) {
				map[actType] = {};
			}
			if(!map[actType][evtName]) {
				map[actType][evtName] = [];
			}
			map[actType][evtName].push(func);
		};
		that.remove = function(actType , evtName , func) {
			$node.off(evtName , '[action-type="' + actType + '"]' , func);
			if(map[actType]) {
				if(map[actType][evtName]) {
					var list = map[actType][evtName] , idx = -1;
					for(var i = 0 , len = list.length ; i <  len ; i++) {
						if(list[i] === func) {
							idx = i;
							break;
						}
					}
					if(idx != -1) {
						list.splict(idx , 1);
					}
				}
			}
		};
		that.destroy = function() {
			for(var evtName in map) {
				var evtList = map[evtName];
				for(var actName in evtList) {
					var funcList = evtList[actName];
					for(var i = 0 , len  = funcList.length ; i < len ; i++) {
						$node.off(evtName , '[action-type]' , funcList[i]);
					}
				}
			}
			map = {};
		};
		return that;
	};
});