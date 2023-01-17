requirejs.config({
    baseUrl: 'libs',
    paths: {
        app: '../app',
		model : '../app/model'
    }
});



requirejs(['ejs_production','app/page_handler'], function(ejs,pageHandler){

    var slideout = new Slideout({
      'panel': document.getElementById('panel'),
      'menu': document.getElementById('menu'),
      'padding': 256,
      'tolerance': 70,
      'touch' : false
    });


		moment.locale("sv");
		document.addEventListener("deviceready", onDeviceReady, false);
		pageHandler.pageLoad();

		$(".page-link","#main-menu").on("click",function(){
      $("#menu li, #main-menu li").removeClass("active");
      $(this).parent().addClass("active");
			pageHandler.changePage($(this).attr("id"));
		});
    $(".page-link","#menu").on("click",function(){
      $("#menu li, #main-menu li").removeClass("active");
      $(this).parent().addClass("active");
      slideout.close();
      slideout.disableTouch();
      pageHandler.changePage($(this).attr("id"));
    });
    var menuOpen = false;
    $("#slide-menu").on('click',function(){
      slideout.toggle();
      slideout.enableTouch();
      menuOpen = true;
      return false;
    });
    $('#panel').on('click',function(){
      if(menuOpen){
        slideout.close();
        slideout.disableTouch();
        menuOpen = false;
      }
    });
});


function onDeviceReady(){
	document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown(){
	window.history.back();
	return false;
}

function makeId(name){
  if(name)
	 return name.replace(" ","_");
}

function parseId(id){
  if(id)
	 return id.replace("_"," ");
}

function dateToId(date){
  date = moment(date);
  if(date.isValid())
    return date.format("YYYYMMDD");
}

function validateKey(key){
  if(key === null || key === undefined || key === '')
    return false;
  key = key.toString()
  if(key.match(/[.$\[\]#\/]/g))
    return false;
    
  return true;
}
