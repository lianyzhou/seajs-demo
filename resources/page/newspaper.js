define(function(require,exports,module) {
	var newsCategory = require("page/newspaper/news-category/index");
	var newsContent = require("page/newspaper/news-content/index");
	exports.init = function() {
		newsCategory.init();
		newsContent.init();
	};
});