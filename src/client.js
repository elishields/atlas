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
                {
                    fill: $(go.Brush, "Linear", {0: "white"}),
                    stroke: "darkblue", strokeWidth: 2
                }),

            //Panel for entire node
            $(go.Panel, "Table",
                {defaultAlignment: go.Spot.Left, column: 10},
                
                //Panel for picture
                $(go.Panel, "Table",
                {defaultAlignment: go.Spot.Left, column: 0, row: 0},
							
                    $(go.Picture,
                        {
                            row: 0, column: 0, rowSpan: 3,
                            margin: new go.Margin(5), width: 50, height: 50, background: "red"
                        },
                        new go.Binding("source"))      
                ),

                //Panel for Pre-expanded information
                $(go.Panel, "Table",
                {defaultAlignment: go.Spot.Left, column: 1, row: 0},
                                
                    $(go.TextBlock,
                        {row: 1, column: 0, margin: new go.Margin(5), font: "bold 12pt sans-serif"},
                        new go.Binding("text", "name")),

                    $(go.TextBlock,
                        {row: 2, column: 0, margin: new go.Margin(5)},
                        new go.Binding("text", "title")),

                    $("PanelExpanderButton", "addInfo",
                        { column: 2, row: 0}) 
                ),
								
				//Panel for hidden info
                $(go.Panel, "Table",
                    {name: "addInfo", defaultAlignment: go.Spot.Left, column: 1, row: 1, visible: false},
                        
                    //line separator 
					$(go.RowColumnDefinition,
                        { row: 2, separatorStrokeWidth: 2.5, separatorStroke: "black" }),
                
                    $(go.TextBlock,
                        {row: 0, column: 0, margin: new go.Margin(10,5,0,5)}, 
											new go.Binding("text", "department")),
									
					$(go.TextBlock,
                        {row: 1, column: 0, margin: new go.Margin(0,5,10,5)}, 
											new go.Binding("text", "location")),
									
					$(go.TextBlock,
                        {row: 2, column: 0, margin: new go.Margin(10,5,5,5)}, 
											new go.Binding("text", "email")),
									
				//New panel just for phones
				$(go.Panel, "Table",
                    {defaultAlignment: go.Spot.Left, column: 0, row: 3},
									
					$(go.TextBlock, "Direct: ",
                        {row: 0, column: 0, margin: new go.Margin(5)}),
									
                   $(go.TextBlock,
                       {row: 0, column: 1, margin: new go.Margin(5)},
                            new go.Binding("text", "business_phone")),
									
					$(go.TextBlock, "Mobile: ",
                        {row: 1, column: 0, margin: new go.Margin(5)}),
                    
                    $(go.TextBlock,
                        {row: 1, column: 1, margin: new go.Margin(5)}, 
								new go.Binding("text", "mobilePhone")))
                )
            )
        );

    myDiagram.model = $(go.TreeModel);
    myDiagram.layout = $(go.TreeLayout, {angle: 360, layerSpacing: 100});
    myDiagram.model.nodeDataArray = $scope.data.nodes;

}
