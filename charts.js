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

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
var allData = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
var filterData = allData.filter(function(ID){
  return ID.id == sample;
});
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
var allMeta = data.metadata;
var filterMeta = allMeta.filter(function(ID){
  return ID.id == sample;
});
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
var firstSelected = filterData[0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
var firstMeta = filterMeta[0];
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
var otu_ID = firstSelected.otu_ids;
var otu_labels = firstSelected.otu_labels;
var sample_values = firstSelected.sample_values; //use for part 2

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
var washFreq = firstMeta.wfreq;
console.log(washFreq);
    // Deliverable 1: 7. Create the yticks for the bar chart.
    var barXData = sample_values.slice(0,10).reverse();
    var yticks = otu_ID.slice(0,10).reverse();
    var ytickNames = yticks.map(a => "OSU "+a+"#");
    var barHoverNames = otu_labels.slice(0,10).reverse();
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    console.log(barXData);
    console.log(ytickNames);

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = {
      x: barXData,
      y: ytickNames,
      type:"bar",
      orientation:"h",
      text: barHoverNames

    };
    var barGraph = [barData];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top Ten Bacteria Cultures Found"

    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot("bar",barGraph, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData ={
      x: otu_ID,
      y:sample_values,
      text: otu_labels,
      mode:"markers",
      marker:{
        color:otu_ID,
        size:sample_values
      }

    };
    var bubbleChart = [bubbleData];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
 
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleChart, bubbleLayout);    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain:{x:[0,1],y:[0,1]},
      value:washFreq,
      type:"indicator",
      title:{text:"Belly Button Washes Per Week"},
      mode:"gauge+number",
      gauge:{
        axis:{range:[null,10]},
        steps:[
          {range:[0,2],color:"red"},
          {range:[2,4],color:"orange"},
          {range:[4,6], color:"yellow"},
          {range:[6,8], color:"lightgreen"},
          {range:[8,10], color:"darkgreen"}
        ],
        bar:{color:"black"}
      }
    };
    var gaugeChart = [gaugeData];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width:500,
      height:400,
      margin:{t:0,b:0}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge",gaugeChart,gaugeLayout);
  });
}
