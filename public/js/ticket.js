requirejs.config({
	paths : {
		d3js : 'lib/d3.v3.min',
		cubism : 'lib/cubism.v1.min'
	}
});
require(["jquery", "d3js"], function($, d3js) {
	require(["cubism"], function(cub_ism) {

		var socket = new WebSocket("ws://report.bype.org/1.0/event/get");

		socket.onopen = function() {
			socket.send(JSON.stringify({
				"expression" : "ticketPanacee(name)",
				"start" : new Date()
			}));
			console.log("connected!");
		};

		socket.onmessage = function(message) {
			var event = JSON.parse(message.data);
			$('#lastname').text(event.data.name);
			$('#logo').attr(src, 'http://api.lapan.ac/pan/logo.png');

		};

		socket.onclose = function() {
			console.log("closed");
		};

		socket.onerror = function(error) {
			console.log("error", error);
		};

		$.get('http://report.bype.org/1.0/event?expression=ticketPanacee(name)&limit=1', function(data) {
			$('#lastname').text(data[0].data.name);
		});

		var step = +cubism.option("step", 1e4);
		var context = cubism.context().step(step).size(960), cube = context.cube("http://report.bype.org");
		$('body').append('<h1>Usage temps réel*</h1>');
		d3.select("body").selectAll(".axis").data(["top"]).enter().append("div").attr("class", function(d) {
			return d + " axis";
		}).each(function(d) {
			d3.select(this).call(context.axis().ticks(12).orient(d));
		});
		d3.select("body").insert("div", ".bottom").attr("class", "group").selectAll(".horizon").data(['ticketPanacee', 'laCabine']).enter().append("div").attr("class", "horizon").call(context.horizon().height(40).metric(function(d) {
			return cube.metric("sum(" + d + ")").divide(1);
		}));

		$('body').append('<h1>Fréquentation horaire par jour de la semaine*</h1>');

		$.get('/ticket/stat', function(data) {

			var svg = d3.select("body").append("svg").attr("width", 960).attr("height", 400).attr('id', 'scatter');

			var circles = svg.selectAll("circle").data(d3.merge(data.details)).enter().append("circle");
			circles.attr("cx", function(d, i) {
				return (i - 9) % 24 * 60;
			}).attr("cy", function(d, i) {
				return Math.floor(1 + i / 24) * 45;
			}).attr("r", function(d, i) {
				return d / 2.5;
			}).attr("fill", function(d, i) {

				if (40 < d)
					return '#D9667F';
				if (30 < d)
					return '#FF7D66';
				if (20 < d)
					return '#E6AB7C'
				if (10 < d)
					return '#D6C8A5'
				return '#aaa';
			});

			svg.selectAll("text").data(data.days).enter().append("text").text(function(d, i) {
				switch(i) {
					case 0:
						return 'Mardi';
					case 1:
						return 'Mercredi';
					case 2:
						return 'Jeudi';
					case 3:
						return 'Vendredi';
					case 4:
						return 'Samedi';
					case 5:
						return 'Dimanche';
					case 6:
						return '';
				}
			}).attr("x", function(d, i) {
				return 14 * 60;
			}).attr("y", function(d, i) {
				return (1 + i) * 45 + 6;
			});

			svg.selectAll("text").data(data.hours).enter().append("text").text(function(d, i) {
				if ((i < 22) && (9 < i))
					return i;
				else
					return "";
			}).attr("x", function(d, i) {
				return (i - 9) % 24 * 60 - 10;
			}).attr("y", function(d, i) {
				return 360;
			});
			$('body').append('<p style="text-align:right; font-size:75%;">* Données basées sur l\'impression de billets personnalisés</p>');
		});
	});
});
