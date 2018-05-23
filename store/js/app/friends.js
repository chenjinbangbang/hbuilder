
mui.init({
	subpages: [{
		url: 'friends_sub.html',
		id: 'friends_sub.html',
		styles: {
			top: '64px',
			bottom: '0px'
		} 
	}]
});

mui.plusReady(function(){ 
	//console.log(plus.navigator.getStatusBarStyle());
	plus.navigator.setStatusBarStyle( "dark" );   
});
