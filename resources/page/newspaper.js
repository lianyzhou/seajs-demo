define(function(require,exports,module) {
	var newsCategory = require("pl/newspaper/news-category/index");
	var newsContent = require("pl/newspaper/news-content/index");
	exports.init = function() {
		newsCategory.init();
		newsContent.init();
	};
});