define(function(require,exports,module) {
	
	var newsListTpl = require("page/newspaper/news-content/tpl/newslist.tpl");
	require("page/newspaper/news-content/css/news-content.css");
	
	var io = require("io/newspaper") , 
		$el ,
		newsList ,
		$sortable , 
		lastOrder = [] , 
		delegate , 
		nodes;
	
	function getNewsList(choosenList) {
		io.getNewsList(choosenList).success(function(list) {
			newsList = list;
			buildTpl();
		}).error(function(errorMsg) {
			$.showErrorTip(errorMsg);	
		});
	}
	
	function parseDOM() {
		$el = $("#pl_newspaper_news_content");
	}
	
	function toggleContent(e) {
		var $porlet = $(e.target).closest('[node-type="portlet"]');
		if($porlet[0]) {
			var portletNodes = $.builder($porlet);
			$(portletNodes.content).toggle();
		}
	}
	
	var delegateEvt = {
		toggle : function(e) {
			toggleContent(e);
			var $target = $(e.target);
			var cls =  $target.hasClass("ui-icon-plusthick") ? "ui-icon-minusthick":"ui-icon-plusthick";
			$target.removeClass("ui-icon-plusthick ui-icon-minusthick")
				   .addClass(cls);
		}
	};
	
	function bindEvt() {
		delegate = $.delegatedEvent($el);
		delegate.add("fold" , "click" , delegateEvt.toggle);
		delegate.add("expand" , "click" , delegateEvt.toggle);
	}
	
	function buildTpl() {
		var html = new EJS({text : newsListTpl}).render({
			list : newsList
		});
		var $dom = $(html).css("opacity" , 0).animate({opacity:1});
		$el.empty().append($dom);
		nodes = $.builder($el);
		initPlugins();
	}
	
	function getCurrentOrder() {
		nodes = $.builder($el);
		var orders = [[],[],[],[]];
		$(nodes.columns).each(function(i,dom) {
			var nodesList = $.builder(dom);
			if(nodesList.portlet) {
				$(nodesList.portlet).each(function(j , portlet) {
					var data = $.getActionData(portlet);
					orders[i].push(data.category);
				});
			}
		});
		return orders;
	}
	
	function orderChange(event , ui) {
		var orders = getCurrentOrder();
		var lastOrderStr = JSON.stringify(lastOrder);
		var currentOrderStr = JSON.stringify(orders);
		if(lastOrderStr === currentOrderStr) {
			return;
		}
		lastOrder = orders;
		//需要发请求重新设置order
		io.setNewsCategoryOrder(orders).error(function(errorMsg) {
			$.showErrorTip(errorMsg);
		});
	} 
	
	function initPlugins() {
		$sortable = $(nodes.columns).sortable({
		  connectWith: ".column",
	      handle: ".portlet-header",
	      cancel: ".portlet-toggle",
	      placeholder: "portlet-placeholder ui-corner-all"
		});
		$sortable.on("sortupdate" , orderChange);
	}
	
	function bindCustEvt() {
		$.subscribe("newspaper.newscontent.loadnews" , function(evt , categoryList) {
			getNewsList(categoryList);
		});
	}
	
	exports.init = function() {
		parseDOM();
		bindEvt();
		bindCustEvt();
	};
});