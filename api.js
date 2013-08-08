/**
 * Module dependencies.
 */

var express = require('express'), img = require('./routes/img'),textopoly = require('./routes/textopoly'),http = require('http'), path = require('path'),ticket = require('./routes/ticket');

var app = express();

app.configure(function() {
	app.set('port', 5090);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'hjs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('less-middleware')({
		src : __dirname + '/public'
	}));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/pan/logo.svg', img.logo_svg);
app.get('/pan/logo.png', img.logo_png);
app.get('/textopoly/updateMB', textopoly.updateMB);
app.get('/textopoly/pickTxt', textopoly.pickTxt);
app.get('/ticket/stat', ticket.stat);
app.get('/ticket/update', ticket.update);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
