var express = require('express') , 
	fs = require("fs") , 
	path = require("path") , 
	_ = require("underscore");

var app = express();

app.set('port', process.env.PORT ||  3000);

app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());

app.use(app.router);

app.get("/service/antrol" , function(req,res) {
	var html = fs.readFileSync("page/main.html");
	res.header("Content-Type" , "html;charset=UTF-8");
	res.send(html);
});

app.get("/news/category" , function(req,res) {
	var fileContent = fs.readFileSync("appdata/category.json");
	var categorys = [];
	try {
		categorys = JSON.parse(fileContent);
	} catch(e){}
	res.json(categorys);
	res.end();
});

app.post("/news/category" , function(req,res) {
	var errorMsg = 'post param categorys format error';
	var categoryStr = req.body.categorys , 
		categorys = [];
	try {
		categorys = JSON.parse(categoryStr);
	} catch(e){}
	
	var savedCategoryStr = fs.readFileSync("appdata/category.json");
	var savedCategoryArr = [];
	try {
		savedCategoryArr = JSON.parse(savedCategoryStr);
	} catch(e){}
	
	var checkMap = {};
	_.each(savedCategoryArr , function(category) {
		var key = category.category + "-" + category.name;
		checkMap[key] = true;
	});
	var passCheck = true;
	if(!categorys.length) {
		passCheck = false;
	} else {
		for(var i = 0 , len = categorys.length ; i < len ; i++) {
			var category = categorys[i];
			var key = category.category + "-" + category.name;
			if(!checkMap[key]) {
				passCheck = false;
				errorMsg = JSON.stringify(category) + " not found";
				break;
			} else {
				if(typeof category["selected"] !== 'boolean') {
						passCheck = false;
					errorMsg = JSON.stringify(category) + " format error";
					break;
				}
			}
		}
	}
	if(!passCheck) {
		res.send(500 , errorMsg);
		res.end();
		return;
	}
	var syncData = [];
	_.each(categorys , function(category) {
		syncData.push(_.pick(category , "name" , "category" , "selected"));
	});
	var syncStr = JSON.stringify(syncData);
	fs.writeFileSync("appdata/category.json" , syncStr);
	res.send("ok");
	res.end();
});

app.get("/news/newslist" , function(req,res) {
	var categorys = req.query.categorys || '';
	categorys = categorys.split(",");
	if(categorys.length === 1 && categorys[0] === '') {
		res.send(500 , "param categorys format error");
		return;
	}
	var newsListStr = fs.readFileSync("appdata/news.json")
		,newsList = [];
	try {
		newsList = JSON.parse(newsListStr);
	} catch(e){}
	
	var orderArr = [];
	if(fs.existsSync("appdata/newsorder.json")) {
		var orderStr = fs.readFileSync("appdata/newsorder.json");
		try {
			orderArr = JSON.parse(orderStr);
		} catch(e){
		}
	}
	if(orderArr.length) {
		//对数据进行排序
		categorys.sort(function(a , b) {
			var aIdx = _.indexOf(orderArr , a);
			var bIdx = _.indexOf(orderArr , b);
			if(aIdx > bIdx) {
				return 1;
			} else if(aIdx < bIdx) {
				return -1;
			} else {
				return 0;
			}
		}); 
	}
	var categoryMap = _.indexBy(newsList , "category");
	var ret = [];
	_.each(categorys , function(category) {
		var data = categoryMap[category];
		if(data) {
			ret.push(data);
		}
	});
	console.log(ret);
	res.json(ret);
	res.end();
});

app.post("/news/categoryorder" , function(req,res) {
	var order = req.body.order || "";
	var orders = order.split(",");
	var errorMsg = "param order format error" ,
		passCheck = true;
	if(orders.length === 1 && orders[0] === '') {
		passCheck  = false;
	} else {
		var savedCategoryStr = fs.readFileSync("appdata/category.json");
		var savedCategoryArr = [];
		try {
			savedCategoryArr = JSON.parse(savedCategoryStr);
		} catch(e){}
		savedCategoryArr = _.filter(savedCategoryArr , function(category) {
			if(category.selected) {
				return true;
			}
		});
		var checkMap = {};
		_.each(savedCategoryArr , function(category) {
			var key = category.category;
			checkMap[key] = true;
		});
		if(savedCategoryArr.length !== orders.length) {
			passCheck = false;
		} else {
			for(var i = 0 , len = orders.length ; i < len ; i++) {
				var category = orders[i];
				if(!checkMap[category]) {
					passCheck  = false;
					break;
				}
			}
		}
	}
	if(!passCheck) {
		res.send(500 , errorMsg);
		res.end();
		return;
	}
	var orderJsonStr = JSON.stringify(orders);
	fs.writeFileSync("appdata/newsorder.json" , orderJsonStr);
	res.send(200 , "ok");
});

app.use(express.static(path.join(__dirname , "resources")));

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});