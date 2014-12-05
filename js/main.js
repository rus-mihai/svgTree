var treeDataRaw = [
	{"name": "Level_1_A", "parent": "Level_0", "fill": "red"},
	{"name": "Level_1_B", "parent": "Level_0", "fill": "yellow"},
	{"name": "Level_1_C", "parent": "Level_0", "fill": "#1dacd6"},
	{"name": "Level_0", "parent": "Level_-1", "fill": "#98ff98"},
	{"name": "Level_-1", "parent": "null", "fill": "#FF0000"},
	{"name": "Level_2_A_1", "parent": "Level_1_A", "fill": "#1dacd6"},
	{"name": "Level_2_A_2", "parent": "Level_1_A", "fill": "#e9967a"},
	{"name": "Level_2_A_3", "parent": "Level_1_A", "fill": "#f0dc82"},
	{"name": "Level_2_B_1", "parent": "Level_1_B", "fill": "#d1bea8"},
	{"name": "Level_2_B_2", "parent": "Level_1_B", "fill": "#f0e130"},
	{"name": "Level_2_B_2", "parent": "Level_1_B", "fill": "#ff004f"},
	{"name": "Level_2_C_1", "parent": "Level_1_C", "fill": "#796878"},
	{"name": "Level_2_C_2", "parent": "Level_1_C", "fill": "#ff9966"},
	{"name": "Level_2_C_3", "parent": "Level_1_C", "fill": "#c08081"}
];

var dataMap = treeDataRaw.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

var treeData = [];
treeDataRaw.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

// ************** Generate the tree diagram  *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
	width = 300 - margin.right - margin.left,
	height = 500 - margin.top - margin.bottom;
var i = 0, root;
root = treeData[0];
var tree = d3.layout.tree().nodeSize([10, 5]).separation(function(a, b) {
	return (a.parent == b.parent ? 2 : 2);
});
var diagonal = d3.svg.diagonal().projection(function(d) {
	return [d.x, d.y];
});
var svgTree = d3.select("body svg").attr("width", width + margin.right + margin.left).attr("style", "background:rgb(251, 255, 240)")
	.attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var svgFoot = d3.select("body svg");
svgFoot.append("rect").attr("class", "foot").attr("height", "50px").attr("width", "20px")
	.attr("transform", "translate(" + (margin.left - 10) + "," + (height - 45) + ")");
svgTree.append("svg:defs");

function createGradient(gradientId, color) {
	var gradient = d3.select("body svg defs").append("svg:linearGradient")
		.attr("id", "gradient" + gradientId)
		.attr("spreadMethod", "reflect");
	var stops = d3.select('body svg defs #gradient' + gradientId).selectAll('stop')
		.data([
			['15%', 'white'],
			['85%', color]
		]);
	stops.enter().append('stop');
	stops
		.attr('offset', function(d) {
			return d[0];
		})
		.attr('stop-color', function(d) {
			return d[1];
		});
};

function update(source) {
	var nodes = tree.nodes(root).reverse(),
		links = tree.links(nodes);
	nodes.forEach(function(d) {
		if (d.name == "Level_-1") {
			d.y = 80;
		} else {
			d.y = d.depth * 120;
		}
	});

	var node = svgTree.selectAll("g.node")
		.data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

	var nodeEnter = node.enter().append("g")
			.attr("class", function(d) {
				if (d.name == "Level_-1") {
					return "top";
				}
				return "node";
			})
			.attr("transform", function(d) {
				var y = d.y;
				if (d.name == "Level_-1") {
					y = d.y - 5;
				} else if (d.name.indexOf("Level_1") > -1) {
					y = d.y + 30;
				} else if (d.name.indexOf("Level_0") > -1) {
					y = d.y + 30;
				} else {
					var randomNumber = Math.floor(Math.random() * (50 - 5)) + 5;
					y = y - randomNumber;
				}
				return "translate(" + d.x + "," + y + ")";
			}
		)
		;

	nodeEnter.append("circle")

		.attr('fill', function(d) {
			createGradient(d.id, d.fill);
			return 'url(#gradient' + d.id + ')'
		})
		.style("stroke", function(d) {
			if (d.name == "Level_-1") {
				return "blue";
			}
			return "red"
		})
		.style("stroke-width", function(d) {
			return "1px"
		}).transition()
		.duration(1000)
		.attr("r", 2)
		.transition()
		.duration(2000)
		.attr("r", 10).attr("r", function(d) {
			if (d.name == "Level_-1") {
				return 12;
			} else if (d.name.indexOf("Level_2") > -1) {
				return Math.floor(Math.random() * (11 - 5)) + 5;
			}
			return 8
		}).ease('sine');


// Declare the links¦
	var link = svgTree.selectAll("path.link")
		.data(links, function(d) {
			return d.target.id;
		});

// Enter the links.
	link.enter().insert("path", "g")
		.attr("class", function(d) {
			if (d.source.name == "Level_-1") {
				return "firstLink";
			}
			return "link"
		})
		.style("stroke", function(d) {
			if (d.source.name == "Level_-1") {
				return "yellow";
			}
			return "#3C8D0D"
		})
		.style("stroke-width", function(d) {
			if (d.source.name == "Level_-1") {
				return "2px";
			} else if (d.source.name.indexOf("Level_1") > -1) {
				return "70px";
			}
			return "45px";
		})
		.style("stroke-linecap", "round")
		.attr("d", diagonal);
}
;

update(root);

