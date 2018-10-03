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
            $(go.Panel, "Table",
                {defaultAlignment: go.Spot.Left, margin: 4},
                $(go.Picture,
                    {
                        row: 1, column: 0, rowSpan: 3, alignment: go.Spot.Center,
                        margin: 10, width: 50, height: 50, background: "red"
                    },
                    new go.Binding("source")),
                $(go.TextBlock, "Name: ",
                    {row: 1, column: 2, margin: 10, font: "bold 12pt sans-serif"}),
                $(go.TextBlock,
                    {row: 1, column: 4, margin: 10},
                    new go.Binding("text", "name")),

                $(go.TextBlock, "Title: ",
                    {row: 2, column: 2, font: "bold 12pt sans-serif"}),
                $(go.TextBlock,
                    {row: 2, column: 4, margin: 10},
                    new go.Binding("text", "title")),

                $("PanelExpanderButton", "addInfo",
                    { column: 5 , row: 0}),
                $(go.Panel, "Table",
                    { name: "addInfo", row: 5, column: 1, columnSpan: 4, visible: false},
                    $(go.TextBlock, "Email: ",
                        {row: 6, column: 2, margin: 10, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock,
                        {row: 6, column: 4, margin: 10},
                        new go.Binding("text", "email")),
                    $(go.TextBlock, "Phone: ",
                        {row: 8, column: 2, margin: 10, font: "bold 12pt sans-serif"}),
                    $(go.TextBlock,
                        {row: 8, column: 4, margin: 10},
                        new go.Binding("text", "business_phone")))

            )
        );

    myDiagram.model = $(go.TreeModel);
    myDiagram.layout = $(go.TreeLayout, {angle: 360, layerSpacing: 100});
    myDiagram.model.nodeDataArray = $scope.data.nodes;

}
