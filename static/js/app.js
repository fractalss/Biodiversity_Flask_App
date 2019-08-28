function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;

  d3.json(url).then(function (data) {

    //console.log(data);


    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleDiv = d3.select("#sample-metadata");


    //console.log(data);
    // Use `.html("") to clear any existing metadata
    sampleDiv.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      console.log(`Key: ${key} and Value ${value}`);
      d3.select("#sample-metadata")
        .append("p").text(`${key}: ${value}`);
    });


    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  }

  )
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url1 = `/samples/${sample}`;
  d3.json(url1).then(function (data1) {


    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data1.otu_ids,
      y: data1.sample_values,
      text: data1.otu_labels,
      mode: 'markers',
      marker: {
        color: data1.otu_ids,
        size: data1.sample_values
      }
    };

    var bubbleData = [trace1];

    var bubbleLayout = {
      title: `Biodiversity of sample ${sample}`,
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // Convert data object into array of objects
    var itemsArray = [];
    for (var i = 0; i < data1.otu_ids.length; i++) {
      itemsArray.push({
        "sample_values": data1.sample_values[i],
        "otu_ids": data1.otu_ids[i],
        "otu_labels": data1.otu_labels[i]
      })
    }

    // Sort the array based on the second element
    sorted_data = itemsArray.sort(function (first, second) {
      return second.sample_values - first.sample_values;
    });


    console.log(sorted_data.map(d => d.sample_values));
    // otu_ids, and labels (10 each).
    var labels = sorted_data.map(d => d.otu_ids).slice(0, 9);
    var data_values = sorted_data.map(d => d.sample_values).slice(0, 9);
    var data_hover = sorted_data.map(d => d.otu_labels).slice(0, 9);

    var trace2 = [{
      labels: labels.map(String),
      values: data_values,
      text: data_hover,
      hoverinfo: 'text',
      textinfo: 'percent',
      type: "pie"
    }];

    console.log(trace2);
    var pieLayout = {
      title: `Top 10 OTU of sample ${sample}`,
    };


    Plotly.newPlot("pie", trace2, pieLayout);


  }
  )
};


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
