
var page = 1; //页数

mui.init({
	//配置下拉刷新和上拉加载
	pullRefresh: {
		container: '#refreshContainer',
		//下拉刷新
		down: {
			callback: function pulldownRefresh(){
				page = 1;
				//获取数据
				initData();
			}
		},
		//上拉加载
		up: {
			callback: function pullupRefresh(){
				page++;
				//获取数据
				initData();
			}
		}
	}
});
 
mui.plusReady(function(){ 
	plus.navigator.setStatusBarStyle( "dark" );
	plus.navigator.setStatusBarBackground('#ffffff');
	
	//获取数据
	initData();
});

//获取数据
function initData(){
	app.ajax('/plugin.php?mod=wechat&act=app&do=tb&sign=c1c365507cf2c64a6049b5f3ae07355e&timestamp=1&uid=1&get=ppq&page='+page,{},function(data){
		console.log(JSON.stringify(data)); 
		
		var listData = data.list;
		var list = document.getElementById("list");
		var str = '';
		mui.each(listData,function(index,item){
			str += '<li>'+
				'<a href="detail.html">'+
					'<div class="like-left">'+
						'<img src="'+ item.pic +'" alt="" />'+
					'</div>'+
					'<div class="like-right">'+
						'<div class="name">'+ item.title +'</div>'+
						'<div class="commission">预估佣金:￥'+ item.yongjin +'</div>'+
						'<div class="price">'+
							'<p><span>￥</span>'+ item.price +'</p>'+
							'<p>月销'+ item.sales +'</p>'+
						'</div>'+
						'<div class="price1">'+
							'<p>天猫价  ￥'+ item.o_price +'</p>'+ 
							'<div class="ticket">'+
								'<span class="coupon">券￥'+ item.coupon +'</span>'+
								'<span class="iconfont icon-couponss"></span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</a>'+
			'</li>';
		});
		
		if(page == 1){
			list.innerHTML = str;
			//结束下拉刷新
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();	
		}else{
			//判断是否有数据，没有就不添加数据
			if(str){
				list.appendChild(str);
				return;
			}

			//上拉加载结束
			mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);	
		}
		
	});
}



var likeLi = document.querySelectorAll('.like ul li');
var likeLeft = document.querySelectorAll('.like .like-left');

document.querySelector('.menuIcon').addEventListener('tap',function(){
	
	if(this.classList.contains('mui-icon-list')){
		this.classList.remove('mui-icon-list');
		this.classList.add('mui-icon-bars'); 
		
		for(var i=0;i<likeLi.length;i++){
			likeLi[i].style.width = '50%';
			likeLi[i].querySelector('.name').style.marginBottom = '20px';
			likeLeft[i].style.width = '100%';
		}	
	}else{
		this.classList.add('mui-icon-list');
		this.classList.remove('mui-icon-bars');
		
		for(var i=0;i<likeLi.length;i++){
			likeLi[i].style.width = '100%';
			likeLi[i].querySelector('.name').style.marginBottom = '40px';
			likeLeft[i].style.width = '140px';
		}	
	}
});

//分类栏目跳转
mui('#list').on('tap','a',function(){
	var page = this.getAttribute('href');
	//var title =  this.getAttribute('title');
	
	//叮咚抢
	/*if(title == 'ddq'){
		page = '../ddq.html';
	}*/
	
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