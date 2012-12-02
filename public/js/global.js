$.ui.ready(function(){
	app = new App();
	$.ui.customClickHandler=app['clickHandler'];
});
