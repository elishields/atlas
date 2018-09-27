function ($scope, $location, $http, spUtil, $timeout){ 
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