var mongo = require('mongoskin');
var async = require('async');
var moment = require('moment');
moment().format();
moment().lang('fr');
//var cube = require('cube');
//var emitter = cube.emitter("ws://log.bype.org:80");

var db = mongo.db("mongodb://dbserver/lapanacee", {
	safe : false
})

db.bind('tickets');

var stat;

var update = function(done) {
	async.parallel({
		week : function(callback) {
			var b = moment().day(-6).hour(3);
			var l = moment().day(1).hour(3);
			db.tickets.find({
				time : {
					$gt : b._d,
					$lt : l._d
				}
			}).count(callback);
		},
		month : function(callback) {
			var d = new Date();
			d.setDate(1);

			db.tickets.find({
				time : {
					$gt : d
				}
			}).count(callback);
		},
		begin : function(callback) {
			db.tickets.find({}).count(callback);
		},
		cumul : function(callback) {
			db.tickets.find({
				time : {
					$gt : new Date('2013-06-23')
				}
			}).toArray(function(err, tickets) {
				var hours = [];
				var days = [];
				var details = [];

				var sum = 0;
				for (var h = 0; h < 24; h++)
					hours[h] = 0;
				for (var d = 0; d < 7; d++) {
					days[d] = 0;
					details[d] = [];
					for (var h = 0; h < 24; h++)
						details[d][h] = 0
				}

				async.each(tickets, function(ticket, fn) {
					hours[ticket.time.getHours()]++;
					days[(ticket.time.getDay() + 5) % 7]++;
					details[(ticket.time.getDay()+5)%7][ticket.time.getHours()]++;
					sum++;
					fn();
				}, function() {

					for (var d = 0; d < 7; d++) {
						for (var h = 0; h < 24; h++)
							if (100 < days[d])
								details[d][h] = Math.floor(250 * details[d][h] / days[d]);
							else
								details[d][h] = 0;
					}

					callback(null, {
						hours : hours,
						days : days,
						details : details
					});

				});
			});
		}
	}, function(err, results) {
		stat = results;
	});
}

exports.update = function(req, res) {
	update(function() {
		res.json({
			success : true
		});
	});
}

exports.stat = function(req, res) {
	res.json(stat);
}
update(function() {
});
