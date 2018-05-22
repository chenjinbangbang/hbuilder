
mui.init({
	//配置下拉刷新和上拉加载
	/*pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: { 
			//auto: false,
			contentdown: "下拉可以刷新",
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...',
			callback: pulldownRefresh
		},
		//上拉加载
		up: {
			//callback: pullupRefresh
		}
	}*/
});

//下拉刷新
/*function pulldownRefresh(){
	setTimeout(function(){
		//结束下拉刷新
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
	},1000);
}*/

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

//判断用户是否联网
app.CheckNetwork();

initData();
function initData(){
	app.ajax('/plugin.php?mod=wechat&act=app&do=config',{},function(data){
		console.log(JSON.stringify(data)); 
		
		//轮播图  
		var sliders = data.slides;
		var banner = document.querySelector('.mui-slider .mui-slider-group');
		var bannerIndex = document.querySelector('.mui-slider-indicator');
		sliders.forEach(function(item,index){
			//图片轮播
			var div = document.createElement('div');
			div.className = 'mui-slider-item';
			
			var str = '<a href="'+item.url+'">'+
				'<img src="'+item.img+'"/>'+
			'</a>';
			div.innerHTML = str;
			banner.appendChild(div);
			
			//下面的图片索引
			var indexDiv = document.createElement('div');
			if(index == 0){
				indexDiv.className = 'mui-indicator mui-active';
			}else{
				indexDiv.className = 'mui-indicator';
			}
			
			bannerIndex.appendChild(indexDiv);
			
		});
		//插入第一个节点
		var div1 = document.createElement('div');
		div1.className = 'mui-slider-item mui-slider-item-duplicate';
		var str1 = '<a href="'+sliders[sliders.length-1].url+'">'+
				'<img src="'+sliders[sliders.length-1].img+'"/>'+
			'</a>';
		div1.innerHTML = str1;
		banner.insertBefore(div1); 
		//插入最后一个节点
		var div2 = document.createElement('div');
		div2.className = 'mui-slider-item mui-slider-item-duplicate';
		var str2 = '<a href="'+sliders[0].url+'">'+
				'<img src="'+sliders[0].img+'"/>'+
			'</a>';
		div2.innerHTML = str2;
		banner.appendChild(div2);
		
		//必须在这里，不然轮播图无效
		var gallery = mui('.mui-slider'); 
		gallery.slider({ 
			interval: 2000 //自动轮播周期
		});
		
		//分类
		var icon = data.icon;
		var classify = document.querySelector('.classify ul');
		icon.forEach(function(item){
			var li = document.createElement('li');
			var str = '<a href="../goodsList.html" title="'+item.type+'">'+
				'<div class="icon">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
				'<p>'+item.name+'</p>'+
			'</a>';
			li.innerHTML = str;
			classify.appendChild(li);
		});
		
		//专区栏目
		//淘宝
		var tbData = data.tb;
		var tb = document.getElementById('tb');
		tb.querySelector('h4').innerHTML = tbData.name; //标题
		var tbUl = tb.querySelector('ul');
		tbData.data.forEach(function(item,i){
			var tbli = document.createElement('li');
			/*var str = '<a href="../detail.html" title="'+item.type+'">'+
				'<div class="activity-left">'+
					'<p class="title">'+item.name+'</p>'+
				'</div>'+
				'<div class="activity-right">'+
					'<img src="'+item.img+'" alt="" />'+
				'</div>'+
			'</a>';*/
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
				/*var str = '<span class="img">'+
		            		'<img src="'+item.pic+'" alt="" />'+
			            '</span>'+
			            '<span class="title">'+item.title+'</span>'+
			            '<div class="price">'+
			            	'<div class="price-top">'+item.coupon+'</div>'+
			            	'<div class="price-foot">券后￥'+item.price+'</div>'+
			            '</div>';*/
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