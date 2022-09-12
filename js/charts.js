function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var biosampleData = data.samples
    console.log("biosampleData: ", biosampleData)

    var metadata = data.metadata;
    console.log("metadata: ", metadata)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = biosampleData.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray: ", resultArray);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the 
    // desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("metadataArray: ", metadataArray);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];
    console.log("firstSample: ", firstSample);
    
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataArray[0];
    console.log("metadataResult: ", metadataResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids
    var otu_labels = firstSample.otu_labels
    var sample_values = firstSample.sample_values

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(metadataResult.wfreq)
 
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    console.log("yticks", yticks);

    var xticks = sample_values.slice(0, 10).map(id => id).reverse();
    console.log("xticks", xticks);

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks,
        y: yticks,
        text: otu_labels,
        type: "bar",
        orientation: 'h'
        }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData, barLayout);


    // Deliverable 2: Bubble Charts
    // 1. Create the trace for the bubble chart.

    var trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      hovertext: otu_labels,
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    };

    var bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis:{title: "OTU ID"},
      hovermode: 'closest',
      width:1145
    };

    // 3. Use Plotly to plot the trace object and layout.
  
    Plotly.newPlot('bubble',bubbleData, bubbleLayout);



    // Deliverable 3: 4. Create the trace object for the gauge chart.
    // 1. Create the trace for the bubble chart.

    var trace2 = {
        type: "indicator",
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Washing Frequency" },
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickwidth: 2, tickcolor: "black"},
          steps: [
            { range: [0, 2], color: "lightseagreen" },
            { range: [2, 4], color: "wheat" },
            { range: [4, 6], color: "purple" },
            { range: [6, 8], color: "blue" },
            { range: [8, 10], color: "palegreen" },
          ],   
          bar: { color: "yellow" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "black",
      }

        }

    var gaugeData = [trace2];

   
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 }
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
