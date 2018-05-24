
mui.init({
	//配置下拉刷新和上拉加载
	pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: { 
			callback: function pulldownRefresh(){
				//获取数据
				//initData();
				setTimeout(function(){
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				},1000);
				
			}
		},
		//上拉加载
		/*up: {
			callback: function pullupRefresh(){
				//获取数据
				initData();
			}
		}*/
	}
});

mui.plusReady(function(){
	
	plus.navigator.setStatusBarStyle( "light" );
	
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
		var banner = document.querySelector('.banner');
		var bannerImg = document.createElement('div');
		bannerImg.className = 'mui-slider-group mui-slider-loop';
		var bannerIndex = document.createElement('div');
		bannerIndex.className = 'mui-slider-indicator';
		
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
		bannerImg.innerHTML = str;
		bannerIndex.innerHTML = strIndex;
		banner.appendChild(bannerImg);
		banner.appendChild(bannerIndex);

		//必须在这里，不然轮播图无效
		var gallery = mui('.mui-slider'); 
		gallery.slider({ 
			interval: 2000 //自动轮播周期
		});
		
		//分类
		var icon = data.icon;
		var classify = document.querySelector('.classify');
		var classifyUl = document.createElement('ul');
		
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
		classifyUl.innerHTML = classifyStr;
		classify.appendChild(classifyUl);
		
		
		//专区栏目
		var type = data.type;
		var column = document.getElementById("column"); //栏目父级
		//var columnStr = '';
		
		mui.each(type,function(index,item){
			
			var activity = document.createElement('div');
			activity.className = 'activity';
			
			//标题
			var t = document.createElement('div');
			t.className = 't activityBg'+index;
			t.innerHTML = '<div><h4>'+ item.name +'</h4></div>';
			activity.appendChild(t);
			
			//中间内容
			var data = item.data;
			var activityUl = document.createElement('ul');
			var dataStr = '';
			mui.each(data,function(index,item){
				dataStr += '<li>'+
							'<a href="../../pages/detail.html">'+
								/*'<div class="activity-left">'+
									'<p class="title titleColor0">'+ item.name +'</p>'+
									'<p class="name">'+ item.name +'</p>'+
									'<div class="img">'+
										'<img src="'+ item.img +'" alt="" />'+
									'</div>'+
								'</div>'+*/
								'<div class="activity-right">'+
									'<img src="'+ item.img +'" alt="" />'+
								'</div>'+
							'</a>'+
						'</li>';
			});
			activityUl.innerHTML = dataStr;
			activity.appendChild(activityUl);
			
			//底部内容
			var goodslist = item.goodslist;
			var view = document.createElement('div');
			view.className = 'view';
			
			//今日精选
			var viewTitle = '<div class="view-title">'+
							 '<div>今日精选</div>'+
							 '<div></div>'+
						'</div>';
			view.innerHTML = viewTitle;
			
			//商品信息
			var goodsWrapper = document.createElement('div');
			goodsWrapper.className = 'mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted';
			var goodsWrapperScroll = document.createElement('div');
			goodsWrapperScroll.className = 'mui-scroll';
			
			var goodsStr = '';
			mui.each(goodslist,function(index,item){
				goodsStr += '<a class="mui-control-item" href="../../pages/detail.html">'+
						            '<span class="img">'+
					            		'<img src="'+ item.pic +'" alt="" />'+
						            '</span>'+
						            '<span class="title">'+ item.title +'</span>'+
						            '<div class="title1">#'+ item.title +'</div>'+
						            /*'<div class="price">'+
						            	'<div class="price-top">3元券</div>'+
						            	'<div class="price-foot">券后￥14.90</div>'+
						            '</div>'+*/
						        '</a>';
			});
			goodsWrapperScroll.innerHTML = goodsStr;
			goodsWrapper.appendChild(goodsWrapperScroll);
			view.appendChild(goodsWrapper);
			activity.appendChild(view);
			
			column.appendChild(activity);
			
		});
		
		//中间横向滚动
		mui('.mui-scroll-wrapper').scroll({
			scrollY: false,
			scrollX: true,
			deceleration: 0.0005,
			//indicators: true, //是否显示滚动条
		});

		
	});
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
mui('#column,.goods').on('tap','a',function(){
	
	var page = this.getAttribute('href');
	
	/*var title = this.getAttribute('title');
	if(title == 'zhutijie'){
		page = '../theme.html';
	}*/
	
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