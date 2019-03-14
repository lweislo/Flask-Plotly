function buildGauge(wfreq) {
  var level = 0;
  parseInt(wfreq);
  Math.round(wfreq);
  console.log(wfreq);
  if (wfreq < 1) {
    level = 15; }
  else if (wfreq >= 1 && wfreq <= 2) {
    level = 45
  }
  else if (wfreq >= 3 && wfreq <= 4) {
    level = 75
  }
  else if (wfreq >= 5 && wfreq <= 6) {
    level = 105
  }
  else if (wfreq >= 7 && wfreq <= 8) {
    level = 135
  }
  else {
    level = 165
  }

// Trig to calc meter point
var degrees = 180 - level,
	 radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
	 pathX = String(x),
	 space = ' ',
	 pathY = String(y),
	 pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
	marker: {size: 28, color:'850000'},
	showlegend: false,
	name: 'cleanliness',
	text: level,
	hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['Cleanest', 'Cleaner', 'Clean', 'Average',
			'Dirty', 'Filthy'],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
						 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
						 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
						 'rgba(255, 255, 255, 0)']},
  labels: ['9+', '7-8', '5-6', '3-4', '1-2', '0'],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Weekly Washing Frequency',
  // height: 600,
  // width: 600,
  xaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout, {showSendToCloud:true});
}
