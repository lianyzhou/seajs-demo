define(function(require,exports,module) {
	require("page/newspaper/news-category/css/news-category.css");
	var categoryTpl = require("page/newspaper/news-category/tpl/categorys.tpl");
	var io = require("io/newspaper") , 
		$el , 
		categoryList ,
		selectedCategoryList,
		nodes , 
		$selectable ,
		bakSelected = [];
	
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
	
	function notifyLoadNews() {
		//选中从接口获取到的数据
		findSelected();
		//告诉新闻列表模块，展示新闻
		var choosenList = _.pluck(selectedCategoryList , 'category');
		$.publish("newspaper.newscontent.loadnews" , choosenList);
	}
	
	function selectItemChange() {
		categoryList = [];
		$(nodes.category).each(function(i,dom) {
			var selected = false; 
			if($(dom).hasClass("ui-selected")) {
				selected = true;
			}
			var data = $.getActionData(dom);
			categoryList.push({
				category : data.category,
				name : data.name,
				selected : selected 
			});
		});
		io.setNewsCategory(categoryList).success(function(msg) {
			notifyLoadNews();
		}).error(function(errorMsg) {
			$.showErrorTip(errorMsg);
		});
	}
	
	function initPlugins() {
		$selectable = $(nodes.listwrap).selectable();
		$selectable.on( "selectablestop", selectItemChange);
	}
	function buildTpl() {
		var html = new EJS({text : categoryTpl}).render({
			list : categoryList
		});
		$el.html(html);
		nodes = $.builder($el);
		initPlugins();
		notifyLoadNews();
	}
	exports.init = function() {
		parseDOM();
		bindEvt();
		bindCustEvt();
		getCategorys();
	};
});