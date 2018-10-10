function ($scope, $location, $http, spUtil, $timeout) {
    var client = this;
    console.log($scope.data);

    var $ = go.GraphObject.make;
    var myDiagram =
        $(go.Diagram, "org-chart",
            {
                "undoManager.isEnabled": true
            });

// A Node template for a user card
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                click: function (e, obj) {
                    var isVisible = obj.part.findObject("addInfo").visible;
                    obj.part.findObject("addInfo").visible = !isVisible;
                }
            },
            $(go.Shape,
                {
                    fill: $(go.Brush, "Linear", {0: "white"}),
                    stroke: "darkblue", strokeWidth: 2
                }),

            //Panel for entire node
            $(go.Panel, "Table",

                {defaultAlignment: go.Spot.Left, column: 10, minSize: new go.Size(250, 0)},

                //Panel for picture
                $(go.Panel, "Table",
                    {
                        defaultAlignment: go.Spot.Left,
                        column: 0,
                        row: 0
                    },

                    $(go.Picture,
                        {
                            source: "data:image/png;base64,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",
                            row: 0,
                            column: 0,
                            rowSpan: 3,
                            margin: new go.Margin(5),
                            width: 55,
                            height: 55
                        },
                        new go.Binding("source", "photo")
                    ),
                    $(go.Shape,
                        {
                            strokeWidth: 0,
                            stroke: null,
                            geometryString: "f M0 0 L100 0 L100 100 L0 100 z M5,50a45,45 0 1,0 90,0a45,45 0 1,0 -90,0 z",
                            width: 56,
                            height: 56,
                            fill: 'white',
                            margin: new go.Margin(5)
                        })
                ),

                //Panel for Pre-expanded information
                $(go.Panel, "Table",
                    {defaultAlignment: go.Spot.Left, column: 1, row: 0},

                    $(go.TextBlock,
                        {
                            row: 1,
                            column: 0,
                            margin: new go.Margin(5)
                        },
                        new go.Binding("text", "name")),

                    $(go.TextBlock,
                        {
                            row: 2,
                            column: 0,
                            margin: new go.Margin(5),
                            wrap: go.TextBlock.WrapDesiredSize
                        },
                        new go.Binding("text", "title")),
                ),

                //Panel for hidden info
                $(go.Panel, "Table",
                    {
                        name: "addInfo",
                        defaultAlignment: go.Spot.Left,
                        column: 1,
                        row: 1,
                        visible: false
                    },

                    //line separator
                    $(go.RowColumnDefinition,
                        {row: 2, separatorStrokeWidth: 1, separatorStroke: "black"}),

                    $(go.TextBlock,
                        {
                            row: 0,
                            column: 0,
                            margin: new go.Margin(5, 5, 0, 5)
                        },
                        new go.Binding("text", "department")),

                    $(go.TextBlock,
                        {
                            row: 1,
                            column: 0,
                            margin: new go.Margin(0, 5, 10, 5)
                        },
                        new go.Binding("text", "location")),

                    $(go.TextBlock,
                        {
                            row: 2,
                            column: 0,
                            margin: new go.Margin(10, 5, 5, 5)
                        },
                        new go.Binding("text", "email")),

                    //New panel just for phones
                    $(go.Panel, "Table",
                        {
                            defaultAlignment: go.Spot.Left,
                            column: 0,
                            row: 3
                        },

                        $(go.TextBlock, "Direct: ",
                            {
                                row: 0,
                                column: 0,
                                margin: new go.Margin(5)
                            }),

                        $(go.TextBlock,
                            {
                                row: 0,
                                column: 1,
                                margin: new go.Margin(5)
                            },
                            new go.Binding("text", "business_phone")),

                        $(go.TextBlock, "Mobile: ",
                            {
                                row: 1,
                                column: 0,
                                margin: new go.Margin(5)
                            }),

                        $(go.TextBlock,
                            {
                                row: 1,
                                column: 1,
                                margin: new go.Margin(5)
                            },
                            new go.Binding("text", "mobilePhone")))
                )
            )
        );
    
    myDiagram.allowDelete = false;
    myDiagram.allowMove = false;
    myDiagram.model = $(go.TreeModel);
    myDiagram.layout = $(go.TreeLayout, {angle: 360, layerSpacing: 100});
    myDiagram.model.nodeDataArray = $scope.data.nodes;

}
