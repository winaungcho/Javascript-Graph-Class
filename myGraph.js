
/******
 * Javascript Graph class
 *
 * This class is free for the educational use as long as maintain this header together with this class.
 * Author: Win Aung Cho
 * Contact winaungcho@gmail.com
 * version 1.0
 * Date: 27-11-2020
 *
 ******/
 
class Graph {
	constructor(dir) {
		this.adjacencyList = {};
		this.directed = dir;
	}
	addVertex(vertex) {
		if(!this.adjacencyList[vertex]) {
			this.adjacencyList[vertex] = [];
		}
	}
	addEdge(source, destination, value) {
		if(!this.adjacencyList[source]) {
			this.addVertex(source);
		}
		if(!this.adjacencyList[destination]) {
			this.addVertex(destination);
		}
		this.adjacencyList[source][destination] = value;
		if(!this.directed) this.adjacencyList[destination][source] = value;
	}
	removeEdge(source, destination) {
		delete this.adjacencyList[source][destination];
		if(!this.directed) delete this.adjacencyList[destination][source];
	}
	removeVertex(vertex) {
		var adjacentVertex;
		if(this.adjacencyList[vertex]) {
			adjacentVertex = this.adjacencyList[vertex];
			for(var key in adjacentVertex) this.removeEdge(vertex, key);
		}
		delete this.adjacencyList[vertex];
		for(var key in this.adjacencyList) {
			adjacentVertex = this.adjacencyList[key];
			if(adjacentVertex[vertex]) delete adjacentVertex[vertex];
		}
	}
	edgeProperty(v1, v2) {
		return this.adjacencyList[v1][v2];
	}
	Draw(ctx, Nprop) {
		//alert("Draw");
		var offsetX = 30;
		var offsetY = 3;
		if(!this.directed) offsetY = 0;
		for(var key in this.adjacencyList) {
			drawnode(ctx, Nprop[key].location, key);
			for(var x in this.adjacencyList[key]) {
				//alert("Edge"+key+"->"+x);
				var edgev = this.adjacencyList[key][x].value;
				drawOffsetArrows(ctx, Nprop[key].location[0], Nprop[key].location[1], Nprop[x].location[0], Nprop[x].location[1], 5, 8, false, true, offsetX, offsetY, edgev);
			}
		}
	}
	getEdgesHtml() {
		var keyI, keyJ;
		var html = "";
		for(keyI in this.adjacencyList) {
			for(keyJ in this.adjacencyList[keyI]) {
				html += keyI + "->" + keyJ + "->" + this.adjacencyList[keyI][keyJ].value + "<br/>";
			}
		}
		return html;
	}
}
Graph.prototype.bfs = function(start) {
	const queue = [start];
	const result = [];
	const visited = {};
	visited[start] = true;
	let currentVertex;
	while(queue.length) {
		currentVertex = queue.shift();
		result.push(currentVertex);
		for(var neighbor in this.adjacencyList[currentVertex]) {
			if(!visited[neighbor]) {
				visited[neighbor] = true;
				queue.push(neighbor);
			}
		}
	}
	return result;
}
Graph.prototype.dfsRecursive = function(start) {
	const result = [];
	const visited = {};
	const adjacencyList = this.adjacencyList;
	(function dfs(vertex) {
		if(!vertex) return null;
		visited[vertex] = true;
		result.push(vertex);
		Object.keys(adjacencyList[vertex]).forEach(function(neighbor, index) {
			//console.log(this[neighbor]);
			if(!visited[neighbor]) {
				return dfs(neighbor);
			}
		}, adjacencyList[vertex]);
	})(start);
	return result;
}
Graph.prototype.dfsIterative = function(start) {
	const result = [];
	const stack = [start];
	const visited = {};
	visited[start] = true;
	let currentVertex;
	while(stack.length) {
		currentVertex = stack.pop();
		result.push(currentVertex);
		for(var neighbor in this.adjacencyList[currentVertex]) {
			if(!visited[neighbor]) {
				visited[neighbor] = true;
				stack.push(neighbor);
			}
		}
	}
	return result;
}
Graph.prototype.dijkstra = function(s) {
	var solutions = {};
	solutions[s] = [];
	solutions[s].dist = 0;
	while(true) {
		var parent = null;
		var nearest = null;
		var dist = Infinity;
		for(var n in solutions) {
			if(!solutions[n]) continue
			var ndist = solutions[n].dist;
			//alert(n+":ndist:"+ndist);
			var adj = this.adjacencyList[n];
			for(var a in adj) {
				if(solutions[a]) continue;
				var d = adj[a].value + ndist;
				if(d < dist) {
					parent = solutions[n];
					nearest = a;
					dist = d;
				}
				//alert(n + "->" + a + ":" + d);
			}
		}
		if(dist === Infinity) {
			break;
		}
		solutions[nearest] = parent.concat(nearest);
		solutions[nearest].dist = dist;
	}
	return solutions;
	//var finish = solutions[f];
	//return {results:solutions,path:finish,distance:finish.dist};
}
Graph.prototype.Prime = function(s) {
	//const result = [];
	const visited = {};
	visited[s] = true;
	var noedges = 7; //this.adjacencyList.length;
	var noedge = 0;
	var G = new Graph(this.directed);
	//alert("Vs:"+this.adjacencyList);
	while(noedge < noedges - 1) {
		var min = 999999;
		var V1 = "",
			V2 = "",
			keyI, keyJ;
		for(keyI in this.adjacencyList) {
			if(visited[keyI] !== undefined && visited[keyI] === true) {
				for(keyJ in this.adjacencyList[keyI]) {
					if((visited[keyJ] === undefined) && this.adjacencyList[keyI][keyJ] !== undefined) {
						var edgev = this.adjacencyList[keyI][keyJ].value;
						if(min > edgev) {
							min = edgev;
							V1 = keyI;
							V2 = keyJ;
						}
					}
				}
			}
		}
		G.addEdge(V1, V2, this.edgeProperty(V1, V2));
		//result.push([V1, V2]);
		visited[V2] = true;
		noedge++;
	}
	return G;
}

function drawnode(ct2, xy, str) {
	//alert("Drawnode:"+str+xy[0]);
	ct2.font = '20px Helvetica';
	ct2.textAlign = 'center';
	ct2.textBaseline = 'middle';
	ct2.beginPath();
	ct2.arc(xy[0], xy[1], 30, 0, Math.PI * 2);
	ct2.stroke();
	ct2.closePath();
	ct2.fillText(str, xy[0], xy[1]);
}

function drawOffsetArrows(ctx, x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd, offsetX, offsetY, str) {
	var dx = x1 - x0;
	var dy = y1 - y0;
	var angle = Math.atan2(dy, dx);
	var length = Math.sqrt(dx * dx + dy * dy);
	x0 = x0 + offsetX / length * dx;
	x1 = x1 - offsetX / length * dx;
	y0 = y0 + offsetX / length * dy;
	y1 = y1 - offsetX / length * dy;
	x0 = x0 - offsetY / length * dy;
	x1 = x1 + offsetY / length * dy;
	y0 = y0 + offsetY / length * dx;
	y1 = y1 - offsetY / length * dx;
	length -= 2 * offsetX;
	ctx.translate(x0, y0);
	ctx.rotate(angle);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(length, 0);
	if(arrowStart) {
		ctx.moveTo(aLength, -aWidth);
		ctx.lineTo(0, 0);
		ctx.lineTo(aLength, aWidth);
	}
	if(arrowEnd) {
		ctx.moveTo(length - aLength, -aWidth);
		ctx.lineTo(length, 0);
		ctx.lineTo(length - aLength, aWidth);
	}
	//
	ctx.stroke();
	ctx.font = '20px Helvetica';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(str, length / 2, 10);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function Test(Ss) {
	var Nprop = {};
	var G = new Graph(true);
	G.addVertex('Aa');
	Nprop['Aa'] = {
		location: [100, 100]
	};
	G.addVertex('B');
	Nprop['B'] = {
		location: [300, 100]
	};
	G.addVertex('C');
	Nprop['C'] = {
		location: [320, 180]
	};
	G.addVertex('D');
	Nprop['D'] = {
		location: [140, 300]
	};
	G.addVertex('E');
	Nprop['E'] = {
		location: [240, 330]
	};
	G.addVertex('F');
	Nprop['F'] = {
		location: [420, 230]
	};
	G.addVertex('G');
	Nprop['G'] = {
		location: [420, 380]
	};
	G.addEdge('Aa', 'D', {
		"value": 5
	});
	G.addEdge('Aa', 'C', {
		"value": 8
	});
	G.addEdge('B', 'Aa', {
		"value": 4
	});
	G.addEdge('B', 'D', {
		"value": 10
	});
	G.addEdge('C', 'B', {
		"value": 2
	});
	G.addEdge('E', 'F', {
		"value": 8
	});
	G.addEdge('E', 'C', {
		"value": 5
	});
	G.addEdge('G', 'C', {
		"value": 2
	});
	G.addEdge('E', 'G', {
		"value": 2
	});
	G.addEdge('D', 'Aa', {
		"value": 6
	});
	G.addEdge('D', 'E', {
		"value": 6
	});
	G.addEdge('C', 'E', {
		"value": 4
	});
	G.addEdge('C', 'F', {
		"value": 3
	});
	
	var can = document.getElementById("canvas");
	var ctx = can.getContext('2d');
	G.Draw(ctx, Nprop);
	var startnode = Ss;
	var visited = G.dfsRecursive(startnode);
	var html = "DFS from " + startnode + "<br/>";
	for(x in visited) html += visited[x] + "<br/>";
	document.getElementById("dfsrecursive").innerHTML = html;
	
	var visited = G.bfs(startnode);
	var html = "BFS from " + startnode + "<br/>";
	for(x in visited) html += visited[x] + "<br/>";
	document.getElementById("bfs").innerHTML = html;
	
	var paths = G.dijkstra(startnode);
	//alert("found");
	var html2 = "Dijkstra from " + startnode + "<br/>";
	for(var key in paths) {
		html2 += startnode;
		for(var x in paths[key]) {
			html2 += "->" + paths[key][x];
		}
		html2 += "<br/>";
	}
	document.getElementById("dijkstra").innerHTML = html2;
	
	var mst = G.Prime(startnode);
	var html3 = "Prime's MST<br/>";
	html3 += mst.getEdgesHtml();

	document.getElementById("prime").innerHTML = html3;
}