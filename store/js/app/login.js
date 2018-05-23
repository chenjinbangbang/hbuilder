
//账号密码登录
var check = true;
document.getElementById('login').addEventListener('tap',function(){
	 
	mui('#normalLogin input').each(function(){
		if(!this.value || this.value.trim() == ""){
			var label = this.previousElementSibling;
			mui.alert(label.innerText + '不允许为空');
			check = false;
			return false;
		}else{ 
			check = true; 
		}
	});
	if(check){
		console.log('验证通过');
		
		var username = document.getElementById("usernamee").value;
		var password = document.getElementById("password").value;
		//mui.ajax();
	}
});

//手机号快捷登录
//点击获取验证码
document.querySelector('.sendCode').addEventListener('tap',function(){
	mui.ajax(
			'GEThttp://test.wx.nuozhe8.com/plugin.php?mod=wechat&act=app&do=sms_code',
			{mobile: '13360502844'},
			function(result){
				console.log(result);
			}
		);
});

var check1 = true;
document.getElementById('loginBtn').addEventListener('tap',function(){
	 
	mui('#phoneLogin input').each(function(){
		if(!this.value || this.value.trim() == ""){
			var label = this.previousElementSibling;
			mui.alert(label.innerText + '不允许为空');
			check1 = false;
			return false;
		}else{ 
			check1 = true; 
		}
	});
	if(check1){
		console.log('验证通过');
		
		var user = document.getElementById("user").value;
		var pwd = document.getElementById("pwd").value;
		//mui.ajax();
	}
});

//跳转到注册页面
mui('.login-foot').on('tap','a',function(){
	var page = this.getAttribute('href');
	console.log(page);
	mui.openWindow({ 
		url: page,
		id: page,
		show: {
			autoShow: true,
			aniShow: 'slide-in-bottom',
			duration: 500
		},
		waiting: {
			autoShow: false,
		}
	}); 
});

/*mui.plusReady(function(){
	console.log(plus.runtime.appid);
});*/ 