// Client Script global objects:
//     data - serialized data object received from Server Script
//     options - options used to invoke the widget on the server
// Client Script global functions:
//     this.server.get(): calls Server Script and passes custom input
//     this.server.update(): calls the server and posts this.data to the Server Script
//     this.server.refresh(): calls the server and automatically replaces the current options and data from the server response
function ($scope, $location, $http, spUtil, $timeout) {
  var client = this;
  console.log($scope.data);
  
	var $ = go.GraphObject.make;
	var myDiagram =
	  $(go.Diagram, "org-chart",
	    {
	      "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
	    });

// define a simple Node template
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape,
        { fill: $(go.Brush, "Linear", { 0: "white" }),
          stroke: "darkblue", strokeWidth: 2 }),
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left, margin: 4 },
        $(go.Picture,
        { row: 1, column: 0, rowSpan: 3,  alignment: go.Spot.Center,
        	margin: 10, width: 50, height: 50, background: "red" },
        new go.Binding("source")),
        $(go.TextBlock, "Name: ",
          { row: 1, column: 2, margin: 10, font: "bold 12pt sans-serif" }),
        $(go.TextBlock,
          { row: 1, column: 4, margin: 10 },
          new go.Binding("text", "prop1")),
        $(go.TextBlock, "Position: ",
          { row: 2, column: 2, font: "bold 12pt sans-serif" }),
        $(go.TextBlock,
          { row: 2, column: 4, margin: 10 },
          new go.Binding("text", "prop2"))
      )
    );

  myDiagram.model.nodeDataArray = [
    { source: "img_temp/default.png", key: "", prop1: "John Doe", prop2: "CEO" }
  ];

}
