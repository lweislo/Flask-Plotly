function buildMetadata(sample) {
  // Fetch the metadata for a sample
  var meta = d3.select("#sample-metadata");
  // Clear any existing metadata
  meta.html("");
  var url = `/metadata/${sample}`;
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(response) {
      // console.log(response);
      meta.append("ul");
      meta.classed("list-group list-group-flush");
      Object.entries(response).forEach(([key, value]) => {
      var line = meta.append("li");
        line.text(`${key} : ${value}`);
        line.classed("list-group-item small", true);
    }); //end of forEach
    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);
      });

}

function buildCharts(sample) {

  var colorlist = ['#56dd3b','#3ad8bb','#3ba5e2','#3956db','#6639db',
  '#9f38e0','#da36e2','#93226d','#701339','#510811','#443536','#1c1919']
  // Fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    const otu_ids = response.otu_ids;
    const otu_labels = response.otu_labels;
    const sample_values = response.sample_values;

/*=========Build a bubble plot ==============*/
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: colorlist
      },
      mode: "markers"
    };
    var data1 = [trace1];
    var layout1 = {
      title: 'Sample bacterial population',
      xaxis:{title:"Operational taxonomic unit ID"},
      yaxis:{title:"Bacterial count"},
      showlegend: false,
      autoscale: true,
      colorscale: "Earth",
      margin: { t: 0 },
      hovermode: "closest",
    };

    Plotly.newPlot('bubble', data1, layout1, {responsive: true});
    /*    ========Build a Pie Chart======== */
      var data = [{
        values:sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        "type":"pie"
        }]

      var layout = {
        title:"Top 10 bacterial species",
        showlegend:true,
        hoverdistance:10,
        colorway:colorlist
      };

      Plotly.newPlot("pie", data, layout, {responsive: true});
    /*  ==============END PIE ============== */
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
