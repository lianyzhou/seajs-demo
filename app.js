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
	//还要重写newsorder.json
	if(fs.existsSync('appdata/newsorder.json')) {
		var newsorderStr = fs.readFileSync("appdata/newsorder.json");
		var newsorder = [];
		try {
			newsorder = JSON.parse(newsorderStr);
		} catch(e){}
		var got_list = _.chain(syncData)
					  .filter(function(item){ return item.selected; })
					  .pluck('category')
					  .value();
  
		var flatten = _.flatten(newsorder);
		//删除掉已经不存在的
		for(var i = 0 , len = newsorder.length ; i < len ; i++) {
			for(var j = 0 , jLen = newsorder[i].length ; j < jLen ; j++) {
				if(_.indexOf(got_list , newsorder[i][j]) === -1) {
					//删掉这个值
					newsorder[i].splice(j , 1);
					j--;
					jLen--;
				}
			}
		}
		//添加没有的
		for(var i = 0 , len = got_list.length ; i < len ; i++) {
			//看是不是在newsorder里没有
			if(_.indexOf(flatten , got_list[i]) === -1) {
				//这种就是要添加到newsorder里面的
				//找newsorder里面最少的那个数组，添加之
				var min = _.chain(newsorder).map(function(item) {return item.length}).min().value();
				var idx = 3;
				_.find(newsorder , function(arr,i) {
					if(arr.length === min) {
						idx = i;
						return true;
					}
				});
				newsorder[idx].push(got_list[i]);
			}
		}
		fs.writeFileSync("appdata/newsorder.json" , JSON.stringify(newsorder));
	}
	res.send("ok");
	res.end();
});

app.get("/news/newslist" , function(req,res) {
	var categorys = req.query.categorys || '';
	if(!categorys) {
		res.json([],[],[],[]);
		res.end();
		return;
	}
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
	var categoryMap = _.indexBy(newsList , "category");
	if(!orderArr.length) {
		/*
		 * 初始化orderArr,每一个平均放入
		 * [
		 * [],
		 * [],
		 * [],
		 * [],
		 * ]中，顺时针放入
		*/
		orderArr = [
			[],[],[],[]
		];
		var idx = -1;
		_.each(categorys,function(category) {
			if(categoryMap[category]) {
				idx ++;
				if(idx >= 4) {
					idx = 0;
				}
				orderArr[idx].push(category);	
			}
		});
	}
	
	var ret = [];
	
	for(var i = 0 , len = orderArr.length ; i < len ; i++) {
		ret[i] = [];
		for(var j = 0 , jLen = orderArr[i].length ; j < jLen ;  j++) {
			ret[i].push(categoryMap[orderArr[i][j]]);
		}
	}
	res.json(ret);
	res.end();
});

app.post("/news/categoryorder" , function(req,res) {
	var orderQuery = req.body.order || "";
	var order = [];
	try {
		order = JSON.parse(orderQuery);
	} catch(e){}
	var orders = _.flatten(order);
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
	var orderJsonStr = JSON.stringify(order);
	fs.writeFileSync("appdata/newsorder.json" , orderJsonStr);
	res.send(200 , "ok");
});

app.use(express.static(path.join(__dirname , "resources")));

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});