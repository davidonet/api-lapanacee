requirejs.config({
	paths : {
		d3js : 'http://d3js.org/d3.v3.min',
		cubism : 'lib/cubism.v1.min'
	}
});
require(["jquery", "d3js"], function($, d3js) {
	require(["cubism"], function(cubism) {
		$.get('/ticket/stat', function(data) {

			var svg = d3.select("body").append("svg").attr("width", 640).attr("height", 300).attr('id','scatter');

			var circles = svg.selectAll("circle").data(d3.merge(data.details)).enter().append("circle");
			circles.attr("cx", function(d, i) {
				return (i - 9) % 24 * 40;
			}).attr("cy", function(d, i) {
				return Math.floor(1 + i / 24) * 30;
			}).attr("r", function(d, i) {
				return d / 4;
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
				return 13 * 40;
			}).attr("y", function(d, i) {
				return (1 + i) * 30 + 8;
			});

			svg.selectAll("text").data(data.hours).enter().append("text").text(function(d, i) {
				if ((i < 22) && (9 < i))
					return i;
				else
					return "";
			}).attr("x", function(d, i) {
				return (i - 9) % 24 * 40 - 10;
			}).attr("y", function(d, i) {
				return 240;
			});

		});
	});
});
