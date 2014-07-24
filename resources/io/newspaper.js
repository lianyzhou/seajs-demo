define(function(require,exports,module) {
	function getNewsCategory() {
		return $.ajax({
			url : "/news/category",
			dataType : "json"
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
	exports.getNewsCategory = getNewsCategory;
	exports.getNewsList = getNewsList;
});