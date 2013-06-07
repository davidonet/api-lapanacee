var mongo = require('mongoskin');
var moment = require('moment');
moment.lang('fr');
var db = mongo.db('mongodb://cloud.bype.org/textopoly', {
	safe : false
});

db.bind('txt');

var startIdx = 0;
var tCount = 0;

function updateMB(fn) {
	db.txt.update({
		'mb' : true
	}, {
		$unset : {
			'mb' : 1
		}
	}, false, true);
	db.txt.find({
		$where : "this.t && this.t.length > 100 && this.t.length<300"
	}).toArray(function(err, txts) {
		var aIdx = 0;
		var isOk = false;
		var aT;
		for (var aIdx = 0; aIdx < txts.length; aIdx++) {
			aT = txts[aIdx];
			var parts = aT.t.split(' ');
			var longestWord = 0;
			for (var i = 0; i < parts.length; i++)
				if (parts[i].length > longestWord)
					longestWord = parts[i].length;
			if (longestWord < 20) {
				db.txt.update({
					p : aT.p
				}, {
					$set : {
						mb : true
					}
				});
				tCount++;
			}
		}
		startIdx = Math.floor(Math.random() * tCount);
		fn(err);
	});
}

updateMB(console.log);

exports.updateMB = function(req, res) {
	updateMB(function(err) {
		res.json({
			success : err
		});
	});
}

exports.pickTxt = function(req, res) {
	db.txt.find({
		mb : true
	}, function(err, txt) {
		txt.skip(startIdx);
		startIdx = Math.floor(Math.random() * tCount);
		txt.toArray(function(err, result) {
			var aT = result[1];
			aT.mt = moment(aT.d).fromNow();
			res.json(result[1]);
		});
	});
};
