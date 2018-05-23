
//跳转页面
mui('.mui-content').on('tap','a',function(){
	var page = this.getAttribute('href');
	
	//获取title，新手攻略，官方公告，常见问题列表页面需要
	//console.log(this.getAttribute('title'));
	if(this.getAttribute('title')){
		var title = this.getAttribute('title');
	}
	
	
	mui.openWindow({
		url: page,
		id: page,
		styles: {},
		extras: {
			title: title ? title : ''
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: 200
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	});
	plus.navigator.setStatusBarStyle( "dark" );
});