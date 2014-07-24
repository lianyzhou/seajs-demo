define("page/newspaper", [ "page/newspaper/news-category/index", "page/newspaper/news-category/css/news-category.css", "page/newspaper/news-category/tpl/categorys.tpl", "io/newspaper", "page/newspaper/news-content/index", "page/newspaper/news-content/tpl/newslist.tpl", "page/newspaper/news-content/css/news-content.css" ], function(require, exports, module) {
    var newsCategory = require("page/newspaper/news-category/index");
    var newsContent = require("page/newspaper/news-content/index");
    exports.init = function() {
        newsCategory.init();
        newsContent.init();
    };
});