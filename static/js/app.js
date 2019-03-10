// To convert the table data to proper case
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

function buildMetadata(sample) {
  // Fetch the metadata for a sample
  var meta = d3.select("#sample-metadata");
  // Clear any existing metadata
  meta.html("");
  var url = `/metadata/${sample}`;
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(response) {
      // console.log(response);
      meta.append("ul")
      Object.entries(response).forEach(([key, value]) => {
        key = key.toProperCase();
        if (key === "Wfreq") {
          key = "Washing Frequency"
        }
        else if (key === "Bbtype") {
          key = "Belly Button Type";
          if (value === "I") {
            value = "Innie"
          }
          else if (value === "O") {
            value = "Outie"
          }
        }
        else if (key === "Gender") {
          if (value === "M") {
            value = "Male"
          }
          else if (value === "F") {
            value = "Female"
          }
        }
      var line = meta.append("li");
        line.text(`${key} : ${value}`);
      // }); //end of forEach 2
    }); //end of forEach 1

      });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}

function buildCharts(sample) {
var colorway = ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
  // Fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    console.log(response)
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      marker:{
        size:response.sample_values,
      color:colorway},
      mode: "markers"
    };
    var data1 = [trace1];

    var layout1 = {
      title: 'Belly Button Bubble',
      showlegend: false,
      height: 800,
      width: 1000
    };

    Plotly.newPlot('bubble', data1, layout1);

    // ========Build a Pie Chart========
  var data = [{
    values:response.sample_values.slice(0,10),
    labels:response.otu_labels.slice(0,10),
    "type":"pie"
    }]

  var layout = {
    showlegend:false
  };

  Plotly.plot("pie", data, layout);
  //==============END PIE ==============
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
