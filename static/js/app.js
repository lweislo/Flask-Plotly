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

function sortData(dataset) {
  var counts = dataset.sample_values;
  var names = dataset.otu_labels;
  var otu_ids = dataset.otu_ids;
  var pie_data = [];
//put values in an array
  for (var i = 0; i < counts.length; i++)
     pie_data.push({'names': names[i], 'counts': counts[i], 'otu_ids': otu_ids[i]});
//sort
   pie_data.sort(function(b,a) {
     return ((a.counts < b.counts) ? -1 : ((a.counts == b.counts) ? 0 : 1));
   });
   //put sorted values back in order
 for (var n = 0; n < pie_data.length; n++) {
 names[n] = pie_data[n].names;
 counts[n] = pie_data[n].counts;
 otu_ids[n] = pie_data[n].otu_ids;
}
  sorted_data = [ {"otu_labels":names, "sample_values":counts, "otu_ids":otu_ids}]
  // console.log(sorted_data)
  return sorted_data
}

function buildCharts(sample) {

  // var colorlist = ['#f44242','#f48941','#efcf40','#b8e83e','#56dd3b','#3ad8bb','#3ba5e2','#3956db','#6639db',
  // '#9f38e0','#da36e2','#93226d','#701339','#510811','#443536','#1c1919']
  // Fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    var chart_data = sortData(response);
    console.log("Sorted data", chart_data[0]);
/*=========Build a bubble plot ==============*/
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      marker:{
        size: response.sample_values,
        color: response.otu_ids
      },
      mode: "markers",
    };
    var data1 = [trace1];
    var layout1 = {
      title: 'Sample bacterial population',
      showlegend: true,
      autosize: true,
      // colorway: colorlist
    };

    Plotly.react('bubble', data1, layout1);
    /*    ========Build a Pie Chart======== */
      var pie_values = chart_data[0].sample_values.slice(0,10);
      var pie_ids = chart_data[0].otu_ids.slice(0,10);
      var pie_labels = chart_data[0].otu_labels.slice(0,10);
      console.log(pie_values);
      var data = [{
        values:pie_values,
        labels: pie_ids,
        hovertext: pie_labels,
        "type":"pie"
        }]

      var layout = {
        title:"Top 10 bacterial species",
        showlegend:true,
        // hoverdistance:10,
        // colorway:colorlist
      };

      Plotly.react("pie", data, layout);
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
