
mui.init({
	//配置下拉刷新和上拉加载
	pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: { 
			//auto: false,
			//contentdown: "下拉可以刷新",
			//contentover: '释放立即刷新',
			//contentrefresh: '正在刷新...',
			callback: pulldownRefresh
		},
		//上拉加载
		up: {
			//callback: pullupRefresh
		}
	}
});

//下拉刷新
function pulldownRefresh(){
	setTimeout(function(){
		
		//获取数据
		//initData();
		
		//结束下拉刷新
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
	},1000);
}

var search = document.getElementById('search');
search.addEventListener('focus',function(){
	mui.openWindow({
		url: "../searchPage.html",
		id: "../searchPage.html",
		styles: {},
		extras: {},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: 100
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
	
	setTimeout(function(){
		search.blur();
	},500);
	
});

//分类栏目跳转
mui('.classify').on('tap','a',function(){
	var page = this.getAttribute('href');
	var title =  this.getAttribute('title');
	
	//叮咚抢
	if(title == 'ddq'){
		page = '../ddq.html';
	}
	
	mui.openWindow({ 
		url: page,
		id: page,
		extras: {},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
});

//跳转到商品详情
mui('.activity').on('tap','a',function(){
	var page = this.getAttribute('href');
	
	var title = this.getAttribute('title');
	if(title == 'zhutijie'){
		page = '../theme.html';
	}
	
	var id = 1;
	mui.openWindow({
		url: page,
		id: page,
		extras: {
			id: id
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
});

//tabs切换
function tabsAct(ele){
	mui('.goodsTab').on('tap','li',function(){			
		//获取当前的class列表
		var tabs = ele.children;
		for(var i=0;i<tabs.length;i++){
			tabs[i].classList.remove("active");
		}
		this.classList.add('active');
	});
}
var ele = document.querySelector('.goodsTab');
tabsAct(ele);


//回到顶部和返回按钮显示与隐藏
var search = document.querySelector('.search'); //返回
var topStatus = document.querySelector('.topStatus'); //顶部状态栏

//Android上监听原生滚动，IOS上监听div滚动，上拉超过一定距离后显示按钮，否则隐藏，可自行在条件判断中修改
if(mui.os.android){ //android设备
	window.addEventListener('scroll',function(e){
		//返回按钮的显示与隐藏
		//console.log(window.pageYOffset);
		if(window.pageYOffset < 0 && !search.classList.contains('hide')){ //上面
			search.classList.add('hide');
		}else if(window.pageYOffset > 0 && search.classList.contains('hide')){ //开始
			search.classList.remove('hide');
		}
		//返回按钮的变化
		if(window.pageYOffset >= 100 && topStatus.classList.contains('hide')){ //下面
			search.classList.add('searchbg');
			plus.navigator.setStatusBarStyle( "dark" );
			topStatus.classList.remove('hide');
		}else if(window.pageYOffset < 100 && !topStatus.classList.contains('hide')){ //开始
			search.classList.remove('searchbg'); 
			plus.navigator.setStatusBarStyle( "light" );
			topStatus.classList.add('hide'); 
		}
	});
}else{ //ios设备
	//console.log(scrollToTopBox.classList);
	document.querySelector('.wrapper').addEventListener('scroll',function(){
		//mui('.wrapper').pullRefresh().y：获取距离顶部的距离大小
		//搜索的显示与隐藏
		if(mui('.wrapper').pullRefresh().y > 0 && !search.classList.contains('hide')){
			search.classList.add('hide'); 
		}else if(mui('.wrapper').pullRefresh().y <= 0 && search.classList.contains('hide')){
			search.classList.remove('hide');
		}
		//搜索的变化
		if(mui('.wrapper').pullRefresh().y <= -100 && topStatus.classList.contains('hide')){ //下面
			search.classList.add('searchbg');
			plus.navigator.setStatusBarStyle( "dark" );
			topStatus.classList.remove('hide');
		}else if(mui('.wrapper').pullRefresh().y > -100 && !topStatus.classList.contains('hide')){ //开始
			search.classList.remove('searchbg'); 
			plus.navigator.setStatusBarStyle( "light" );
			topStatus.classList.add('hide'); 
		}
	});
}

mui.plusReady(function(){
	
	//判断用户是否联网
	//app.CheckNetwork();
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){ //正常：3 1，断网：1 1
		mui.alert('网络异常，请检查网络设置！');  
	}
	
	//获取数据
	initData();
	
	//滚动到底部 
	//mui('.wrapper.mui-scroll-wrapper').scroll().scrollToBottom(100);
});

//获取数据
function initData(){   
	app.ajax('/plugin.php?mod=wechat&act=app&do=config',{},function(data){
		console.log(JSON.stringify(data)); 
		
		//轮播图  
		var sliders = data.slides;
		var banner = document.querySelector('.mui-slider .mui-slider-group');
		var bannerIndex = document.querySelector('.mui-slider-indicator');
		
		var str = '',strIndex = '';
		str += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+sliders[sliders.length-1].url+'">'+
				'<img src="'+sliders[sliders.length-1].img+'"/>'+
			'</a>'+ 
		'</div>';
		mui.each(sliders,function(index,item){
			str += '<div class="mui-slider-item">'+
				'<a href="'+item.url+'">'+
					'<img src="'+item.img+'"/>'+
				'</a>'+
			'</div>';
			
			if(index == 0){
				strIndex += '<div class="mui-indicator mui-active"></div>';
			}else{
				strIndex += '<div class="mui-indicator"></div>';
			}
			
		});
		str += '<div class="mui-slider-item mui-slider-item-duplicate">'+
			'<a href="'+sliders[0].url+'">'+
				'<img src="'+sliders[0].img+'"/>'+
			'</a>'+
		'</div>';
		banner.innerHTML = str;
		bannerIndex.innerHTML = strIndex;
		
		//必须在这里，不然轮播图无效
		var gallery = mui('.mui-slider'); 
		gallery.slider({ 
			interval: 2000 //自动轮播周期
		});
		
		//分类
		var icon = data.icon;
		var classify = document.querySelector('.classify ul');
		
		var classifyStr = '';
		mui.each(icon,function(index,item){
			classifyStr += '<li>'+
				'<a href="../goodsList.html" title="'+item.type+'">'+
				'<div class="icon">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
				'<p>'+item.name+'</p>'+
				'</a>'+
			'</li>';
		});
		classify.innerHTML = classifyStr;
		
		//专区栏目
		var column = document.getElementById("column"); //栏目父级
		var columnStr = '';
		
		
		//淘宝
		var tbData = data.tb;
		var tb = document.getElementById('tb');
		tb.querySelector('h4').innerHTML = tbData.name; //标题
		var tbUl = tb.querySelector('ul');
		tbData.data.forEach(function(item,i){
			var tbli = document.createElement('li');
			var str = '<a href="../detail.html" title="'+item.type+'">'+
							'<div class="activity-left">'+
								'<p class="title titleColor'+i+'">'+item.name+'</p>'+
								'<p class="name">'+item.name+'</p>'+
								'<div class="img">'+
									'<img src="'+item.img+'" alt="" />'+
								'</div>'+
							'</div>'+
							'<div class="activity-right">'+
								'<img src="'+item.img+'" alt="" />'+
							'</div>'+
						'</a>';
			tbli.innerHTML = str;
			tbUl.appendChild(tbli);
		});
		if(tbData.goodslist.length > 0){
			var tbviewScroll = tb.querySelector('.mui-scroll');
			tbData.goodslist.forEach(function(item){
				var a = document.createElement('a');
				a.className = 'mui-control-item';
				a.setAttribute("href","../detail.html");
				a.setAttribute("title",item.goods_id);
			    var str = '<span class="img">'+
            		'<img src="'+item.pic+'" alt="" />'+
	            	'</span>'+
	            	'<span class="title">'+item.title+'</span>'+
	            	'<div class="title1">'+item.d_title+'</div>';
				a.innerHTML = str;
				tbviewScroll.appendChild(a);
			});
		}else{
			document.querySelector('#tb .view').classList.add('hide');
		}
		
		//京东
		var jdData = data.jd;
		var jd = document.getElementById('jd');
		jd.querySelector('h4').innerHTML = jdData.name; //标题
		var jdUl = jd.querySelector('ul');
		jdData.data.forEach(function(item,i){
			var jdli = document.createElement('li'); 
			var str = '<a href="../detail.html" title="'+item.type+'">'+
				'<div class="activity-left">'+
					'<p class="title titleColor'+i+'">'+item.name+'</p>'+
					'<p class="name">'+item.name+'</p>'+
					'<div class="img">'+
						'<img src="'+item.img+'" alt="" />'+
					'</div>'+
				'</div>'+
				'<div class="activity-right">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
			'</a>';
			jdli.innerHTML = str;
			jdUl.appendChild(jdli);
		});
		if(jdData.goodslist.length > 0){
			var jdviewScroll = jd.querySelector('.mui-scroll');
			jdData.goodslist.forEach(function(item){
				var a = document.createElement('a');
				a.className = 'mui-control-item';
				a.setAttribute("href","../detail.html");
				a.setAttribute("title",item.goods_id);
				var str = '<span class="img">'+
            		'<img src="'+item.pic+'" alt="" />'+
	            	'</span>'+
	            	'<span class="title">'+item.title+'</span>'+
	            	'<div class="title1">'+item.d_title+'</div>';
				a.innerHTML = str;
				jdviewScroll.appendChild(a);
			});
		}else{
			document.querySelector('#jd .view').classList.add('hide');
		}
		
		//拼多多
		var pddData = data.pdd;
		var pdd = document.getElementById('pdd');
		pdd.querySelector('h4').innerHTML = pddData.name; //标题
		var pddUl = pdd.querySelector('ul');
		pddData.data.forEach(function(item,i){
			var li = document.createElement('li');
			var str = '<a href="../detail.html" title="'+item.type+'">'+
				'<div class="activity-left">'+
					'<p class="title titleColor'+i+'">'+item.name+'</p>'+
					'<p class="name">'+item.name+'</p>'+
					'<div class="img">'+
						'<img src="'+item.img+'" alt="" />'+
					'</div>'+
				'</div>'+
				'<div class="activity-right">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
			'</a>';
			li.innerHTML = str;
			pddUl.appendChild(li);
		});
		if(pddData.goodslist.length > 0){
			var pddviewScroll = pdd.querySelector('.mui-scroll');
			pddData.goodslist.forEach(function(item){
				var a = document.createElement('a');
				a.className = 'mui-control-item';
				a.setAttribute("href","../detail.html");
				a.setAttribute("title",item.goods_id);
				var str = '<span class="img">'+
            		'<img src="'+item.pic+'" alt="" />'+
	            	'</span>'+
	            	'<span class="title">'+item.title+'</span>'+
	            	'<div class="title1">'+item.d_title+'</div>';
				a.innerHTML = str; 
				pddviewScroll.appendChild(a);
			});
		}else{ 
			document.querySelector('#pdd .view').classList.add('hide');
		}
		
		//中间横向滚动
		mui('.mui-scroll-wrapper').scroll({
			scrollY: false,
			scrollX: true,
			deceleration: 0.0005,
			//indicators: true, //是否显示滚动条
		});

		
	});
}

/*mui.ajax('http://test.wx.nuozhe8.com/plugin.php?mod=wechat&act=app&do=config',{
//mui.ajax('http://www.mjpai.cn:3100/api/users/code',{
	data:{},
	dataType:'json',//服务器返回json格式数据
	type:'get',//HTTP请求类型
	timeout:10000,//超时时间设置为10秒；
	//crossDomain: true,
	headers:{'Content-Type':'application/json'},	              
	success:function(data,textStatus,xhr){
		//服务器返回响应，根据响应结果，分析是否登录成功；
		//console.log('成功'); 
		//console.log(JSON.stringify(data.icon));
		
		
		
		
	},
	error:function(xhr,type,errorThrown){
		//异常处理；
		console.log('失败');
		console.log(errorThrown);
	}
});*/