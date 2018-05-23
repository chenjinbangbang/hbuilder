
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

mui.plusReady(function(){
	
	//获取数据
	initData();
});

//获取数据
function initData(){
	app.ajax('/plugin.php?mod=wechat&act=app&do=tb&sign=c1c365507cf2c64a6049b5f3ae07355e&timestamp=1&uid=1&get=ppq&page=1',{},function(data){
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
									'<p><span>￥</span>19.9</p>'+
									'<p>月销49118</p>'+
								'</div>'+
								'<div class="price1">'+
									'<p>天猫价  ￥69.9</p>'+
									'<div class="ticket">'+
										'<img src="../imgs/ticket.png" alt="" />'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</a>'+
					'</li>';
		});
		list.innerHTML = str;
	});
}

