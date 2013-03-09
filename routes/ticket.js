var moment = require('moment');
var http = require('http');
var parseString = require('xml2js').parseString;
moment.lang("fr");
sunrise = moment("06:00", "HH:mm");
sunset = moment("18:00", "HH:mm");

exports.updateDaylight = function(req, res) {
	http.get({
		host : "www.earthtools.org",
		path : "/sun/43.612809/3.878124/" + moment().date() + "/" + (moment().month() + 1) + "/1/1"
	}).on('response', function(response) {
		response.setEncoding('utf8');
		response.on('data', function(data) {
			parseString(data, function(err, result) {
				sunrise = moment(result.sun.morning[0].sunrise[0], "HH:mm");
				sunset = moment(result.sun.evening[0].sunset[0], "HH:mm");
				res.json({
					sunrise : sunrise,
					sunset : sunset
				});
			});
		});
	});
};

exports.index = function(req, res) {
	var data = {
		date : "Jeudi 18 juillet 2013",
		time : "15h30",
		hello : "Bonjour " + req.params.name,
		context : "Hier soir, dans <em>Delayed</em>, de Matthias Gommel, une femme a dit ceci:",
		what : "«C’est comme à la maison, tu me laisses jamais finir mes phrases».",
		where : "Salle 2 - <em>Delayed</em>, Matthias Gommel (2002)"

	};
	data.date = moment().format("dddd D MMMM YYYY");
	data.time = moment().format("HH:mm");
	res.render('ticket', data);
};

