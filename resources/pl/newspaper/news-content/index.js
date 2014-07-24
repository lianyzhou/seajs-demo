define(function(require,exports,module) {
	
	var newsListTpl = require("pl/newspaper/news-content/tpl/newslist.tpl");
	require("pl/newspaper/news-content/css/news-content.css");
	
	var io = require("io/newspaper") , 
		$el ,
		newsList ;
	
	function getNewsList(choosenList) {
		io.getNewsList(choosenList).success(function(list) {
			newsList = list;
			buildTpl();
		}).error(function() {
			
		});
	}
	
	function parseDOM() {
		$el = $("#pl_newspaper_news_content");
	}
	
	function bindEvt() {
		
	}
	
	function buildTpl() {
		var html = new EJS({text : newsListTpl}).render({
			list : newsList
		});
		$el.html(html);
		nodes = $.builder($el);
		initPlugins();
	}
	
	function initPlugins() {
		$(nodes.columns).sortable({
			  connectWith: ".column",
		      handle: ".portlet-header",
		      cancel: ".portlet-toggle",
		      placeholder: "portlet-placeholder ui-corner-all"
		});
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