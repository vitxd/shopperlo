var App = function(){
	this.group_id = null;
	this._init();
};

App.prototype.main = function(){
	$('#navbar_insert').hide();
	$.ui.loadContent('#main');
};

App.prototype.insert = function(){
	if(this.group_id !== null){
		$.ui.loadContent('#insert');
	}
};

App.prototype.group = function(id){
	console.log(this.target);
	$('#navbar_insert').show();
	this.group_id = id;
	$.ui.loadContent('#group_' + id);
};

App.prototype.log = function(msg){
	console.log(msg);
//	console.trace();
};

App.prototype.show = function(element){
	switch(element){
		case 'menu':
			$.ui.toggleSideMenu();
			break;
	}
};

App.prototype.insertItem = function(data){
	this.log(data);
	this.socket.emit('insert-item', data);
};

App.prototype._clickHandler = function(target) {
	if($(target).hasClass('button_disabled')) return true;

	app.target = target;
	var   url 		 = $(target).attr('href')
		, args 		 = url.split('/')
		, controller = args[0].replace(/^_/,'')
		;

	try {
		if( typeof app[controller] == 'function' ) {
			if(args.length==1)
				app[controller]();
			else if(args.length==2)
				app[controller](args[1]);
			else if(args.length==3)
				app[controller](args[1],args[2]);
			else if(args.length==4)
				app[controller](args[1],args[2],args[3]);
		} else if( controller != '' ) {
			return false;
		}
	} catch(e) {
		app.log("ERROR IN CLICKHANDLER " + e);
		console.trace();
		return false;
	}
	//returning true prevent default jq.ui event to be handled
	return true;
};

App.prototype._init = function(){
	$('#navbar_insert').hide();
	$.ui.showBackbutton=false
	$.ui.loadContent('#main');

	this.socket = io.connect('http://localhost:3000');

	this.socket.on('news', function(data){alert('yeah!')});

	$('#insertForm').bind('submit', function(e){
		e.preventDefault();
		var data = {};
		$('#insertForm input[type=text]').each(function(){
			data[$(this).attr('name')] = $(this).val();
		});
		this.insertItem(data);
		return false;
	}.bind(this));
};