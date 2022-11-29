$(function () {

	app.init();
})


var app = {

	init: function () {
		this.toggleAside();
		this.deleteComfirm()
		this.resizeIframe()

	},
	deleteComfirm: function () {
		$('.delete').click(function () {
			var flag = confirm("您确定要删除吗？");
			return flag;
		})
	},

	resizeIframe:function(){
		var heights= document.documentElement.clientHeight-100;
		if(document.getElementById('rightMain')){ 
			document.getElementById('rightMain').height = heights
		};
	},
	toggleAside: function () {

		$('.aside h4').click(function () {
			if($(this).find('span').hasClass('nav_close')){
				$(this).find('span').removeClass('nav_close').addClass('nav_open');
			}else{
				$(this).find('span').removeClass('nav_open').addClass('nav_close');
			}
			$(this).siblings('ul').slideToggle();
		})
	},

	changeStatus: function (el, model, attr, id) {
		console.log("=========123456=====456")
		$.get('/admin/changeStatus', { model: model, attr: attr, id: id }, function (data) {
			console.log("data", data);
			if (data.success) {
				if (el.src.indexOf('yes') != -1) {
					el.src = '/public/admin/images/no.gif';
				} else {
					el.src = '/public/admin/images/yes.gif';
				}
			}
		})
	},
	editNum: function (el, model, attr, id) {
		var val = $(el).html();
		var input = $("<input value='' />");
		$(el).html(input);
		//input 获取焦点
		$(input).trigger('focus').val(val)
		//点击input 的时候阻止冒泡
		$(input).click(function () {
			return false;
		})
		//鼠标离开的时候给span赋值
		$(input).blur(function () {
			console.log("123456");
			// $(el).html($(this).val());
			var num = $(this).val()
			$(el).html(num)
			$.get('/admin/editNum', { model: model, attr: attr, id: id, num: num }, function (data) {
				console.log("data", data);
			})
		})

	}
}
$(window).resize(function(){

	app.resizeIframe();
})
