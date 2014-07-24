define(function(require,exports,module) {
	require("pl/newspaper/news-category/css/news-category.css");
	var categoryTpl = require("pl/newspaper/news-category/tpl/categorys.tpl");
	var io = require("io/newspaper") , 
		$el , 
		categoryList ,
		selectedCategoryList,
		nodes;
	
	function getCategorys() {
		io.getNewsCategory().success(function(list) {
			categoryList = list;
			buildTpl();
		});
	}
	function parseDOM() {
		$el = $("#pl_newspaper_news_category");
	}
	function bindEvt() {
		
	}
	function bindCustEvt() {
		
	}
	function findSelected() {
		selectedCategoryList = _.filter(categoryList , function(item) {
			 return item.selected;
		});
	}
	function initPlugins() {
		$(nodes.listwrap).selectable();
		//选中从接口获取到的数据
		findSelected();
		_.each(selectedCategoryList , function(item) {
			$(nodes['category_' + item.category]).click();
		});
		//告诉新闻列表模块，展示新闻
		var choosenList = _.pluck(selectedCategoryList , 'category');
		$.publish("newspaper.newscontent.loadnews" , choosenList);
	}
	function buildTpl() {
		var html = new EJS({text : categoryTpl}).render({
			list : categoryList
		});
		$el.html(html);
		nodes = $.builder($el);
		initPlugins();
	}
	exports.init = function() {
		parseDOM();
		bindEvt();
		bindCustEvt();
		getCategorys();
	};
});