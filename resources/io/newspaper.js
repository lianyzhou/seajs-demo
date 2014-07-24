define(function(require,exports,module) {
	function getNewsCategory() {
		return $.ajax({
			url : "/news/category",
			dataType : "json"
		});
	}
	function setNewsCategory(categoryList) {
		categoryList = categoryList || [];
		var categoryListStr = JSON.stringify(categoryList);
		return $.ajax({
			url : "/news/category",
			type : "POST",
			data : {
				categorys : categoryListStr
			}
		});
	}
	function getNewsList(categoryList) {
		if(!$.isArray(categoryList)) {
			categoryList = [];			
		}
		var list_str = categoryList.join(",");
		return $.ajax({
			url : "/news/newslist",
			dataType : "json",
			data : {
				categorys : list_str
			}
		});
	}
	function setNewsCategoryOrder(newsCategoryOrder) {
		newsCategoryOrder = newsCategoryOrder || [];
		var newsCategoryOrderStr = JSON.stringify(newsCategoryOrder);
		return $.ajax({
			url : "/news/categoryorder",
			type : "POST",
			data : {
				order : newsCategoryOrderStr
			}
		});
	}
	exports.getNewsCategory = getNewsCategory;
	exports.getNewsList = getNewsList;
	exports.setNewsCategoryOrder = setNewsCategoryOrder;
	exports.setNewsCategory = setNewsCategory;
});