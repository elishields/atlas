function ($scope, $location, $http, spUtil, $timeout) {
    var client = this;
    console.log($scope.data);

    var $ = go.GraphObject.make;
    var orgChartDiagram =
        $(go.Diagram, "org-chart",
            {
                "undoManager.isEnabled": true,
                hoverDelay: 0,
                "dragSelectingTool.isEnabled": false

            });

    /**
     * Listen for a change to the search field value.
     * When an employee is searched for, pass their ID
     * to the server script and pull their data. Then
     * append the data to diagram model to display it
     * on the org chart.
     */
    $scope.$on("field.change", function (e, params) {
        client.data.event = "search";
        client.data.searchedEmployeeId = params.field.value;
        client.server.update().then(function (resp) {
            $scope.data.nodes.forEach(function (node) {
                console.log(node);

                var nodeExists = orgChartDiagram.findNodeForKey(node.key);
                if (!nodeExists)
                    orgChartDiagram.model.addNodeData(node);
            });
        });
    });

    // this is shown by the mouseHover event handler
    var nodeHoverAdornment =
        $(go.Adornment, "Spot",
            {
                background: "transparent",
                // hide the Adornment when the mouse leaves it
                mouseLeave: function (e, obj) {setTimeout(function() {
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                },2000);
                }
            },
            $(go.Placeholder,
                {
                    background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                    isActionable: false,  // needed because this is in a temporary Layer
                    click: function (e, obj) {
                        var node = obj.part.adornedPart;
                        node.diagram.select(node);
                    }
                }),
            $("Button", // Expand to parent button
                {alignment: go.Spot.Left, alignmentFocus: go.Spot.Right},
                {
                    click: function (e, obj) {

                        var node = obj.part;
                        var data = node.data;
                        console.log("NODE DATA");
                        console.log(data);

                        if (data.parentExpanded) { // Collapse action
                            node.diagram.startTransaction("clickParentBtn");
                            var old = data.childExpandBtnSymbol;
                            data.parentExpandBtnSymbol = "<";
                            node.diagram.model.raiseDataChanged(data, "parentExpandedBtnSymbol", old, data.parentExpandBtnSymbol);
                            node.diagram.commitTransaction("clickParentBtn");
                            client.data.event = "collapse";
                            client.server.update().then(function (resp) {

                            });
                        } else { // Expand action
                            node.diagram.startTransaction("clickParentBtn");
                            var old = data.parentExpandBtnSymbol;
                            data.parentExpandBtnSymbol = ">";
                            node.diagram.model.raiseDataChanged(data, "parentExpandedBtnSymbol", old, data.parentExpandBtnSymbol);
                            node.diagram.commitTransaction("clickParentBtn");
                            client.data.event = "expand";
                            client.data.expandedUserId = data.key;
                            client.data.expandedUserDirection = "parent";
                            client.server.update().then(function (resp) {
                                console.log($scope.data.nodes);
                                $scope.data.nodes.forEach(function (node) {
                                    console.log(node);

                                    var nodeExists = orgChartDiagram.findNodeForKey(node.key);
                                    if (!nodeExists)
                                        orgChartDiagram.model.addNodeData(node);
                                });
                            });
                        }
                    }
                },
                $(go.TextBlock, new go.Binding("text", "parentExpandBtnSymbol"))),
            $("Button", // Expand to child button
                {alignment: go.Spot.Right, alignmentFocus: go.Spot.Left},
                {
                    click: function (e, obj) {
                        var node = obj.part;
                        var data = node.data;
                        console.log("NODE DATA");
                        console.log(data);

                        if (data.childExpanded) { // Collapse action
                            node.diagram.startTransaction("clickChildBtn");
                            var old = data.childExpandBtnSymbol;
                            data.childExpandBtnSymbol = ">";
                            node.diagram.model.raiseDataChanged(data, "childExpandedBtnSymbol", old, data.childExpandBtnSymbol);
                            node.diagram.commitTransaction("clickChildBtn");
                            client.data.event = "collapse";
                            client.server.update().then(function (resp) {

                            });
                        } else { // Expand action
                            node.diagram.startTransaction("clickChildBtn");
                            var old = data.childExpandBtnSymbol;
                            data.childExpandBtnSymbol = "<";
                            node.diagram.model.raiseDataChanged(data, "childExpandedBtnSymbol", old, data.childExpandBtnSymbol);
                            node.diagram.commitTransaction("clickChildBtn");
                            client.data.event = "expand";
                            client.data.expandedUserId = data.key;
                            client.data.expandedUserDirection = "child";
                            client.server.update().then(function (resp) {
                                console.log($scope.data.nodes);
                                $scope.data.nodes.forEach(function (node) {
                                    console.log(node);

                                    var nodeExists = orgChartDiagram.findNodeForKey(node.key);
                                    if (!nodeExists)
                                        orgChartDiagram.model.addNodeData(node);
                                });
                            });
                        }
                    }
                },
                $(go.TextBlock, new go.Binding("text", "childExpandBtnSymbol")))
        );


// A Node template for a user card
    orgChartDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                click: function (e, obj) {
                    var isVisible = obj.part.findObject("addInfo").visible;
                    obj.part.findObject("addInfo").visible = !isVisible;
                },
                mouseHover: function (e, obj) {
                    var node = obj.part;
                    nodeHoverAdornment.adornedObject = node;
                    node.addAdornment("mouseHover", nodeHoverAdornment);
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
                            row: 3,
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
                            margin: new go.Margin(5, 5, 10, 5)
                        },
                        new go.Binding("text", "location")),


                    //New panel just for phones
                    $(go.Panel, "Table",
                        {
                            defaultAlignment: go.Spot.Left,
                            column: 0,
                            row: 3
                        },

                        //line separator
                        $(go.RowColumnDefinition,
                            {row: 1, separatorStrokeWidth: 1, separatorStroke: "black"}),

                        $(go.Picture,
                            {
                                source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABJCAYAAADL0IO8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk2QTQxOTJDQzdBRDExRThBQ0MyOTk4RUM1MTAzOTY5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk2QTQxOTJEQzdBRDExRThBQ0MyOTk4RUM1MTAzOTY5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTZBNDE5MkFDN0FEMTFFOEFDQzI5OThFQzUxMDM5NjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTZBNDE5MkJDN0FEMTFFOEFDQzI5OThFQzUxMDM5NjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50CLIMAAAJSklEQVR42uxdC5RN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",
                                row: 1,
                                column: 0,
                                margin: new go.Margin(12, 5, 5, 5),
                                width: 15,
                                height: 10
                            }
                        ),

                        $(go.TextBlock,
                            {
                                row: 1,
                                column: 1,
                                margin: new go.Margin(12, 5, 5, 5)
                            },
                            new go.Binding("text", "email")),

                        $(go.Picture,
                            {
                                source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2NURDQjE5QzdCMDExRThBQ0MyOTk4RUM1MTAzOTY5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2NURDQjFBQzdCMDExRThBQ0MyOTk4RUM1MTAzOTY5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTZBNDE5MkVDN0FEMTFFOEFDQzI5OThFQzUxMDM5NjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTY1RENCMThDN0IwMTFFOEFDQzI5OThFQzUxMDM5NjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6+Kl/YAAAIHElEQVR42uydDZBO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",
                                row: 2,
                                column: 0,
                                margin: new go.Margin(5),
                                width: 15,
                                height: 13
                            }
                        ),

                        $(go.TextBlock,
                            {
                                row: 2,
                                column: 1,
                                margin: new go.Margin(5)
                            },
                            new go.Binding("text", "business_phone")),

                        $(go.Picture,
                            {
                                source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACuCAYAAADAkaiGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2NURDQjFEQzdCMDExRThBQ0MyOTk4RUM1MTAzOTY5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2NURDQjFFQzdCMDExRThBQ0MyOTk4RUM1MTAzOTY5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTY1RENCMUJDN0IwMTFFOEFDQzI5OThFQzUxMDM5NjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTY1RENCMUNDN0IwMTFFOEFDQzI5OThFQzUxMDM5NjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ADtQRAAAGFElEQVR42uydW2gc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",
                                row: 3,
                                column: 0,
                                margin: new go.Margin(5),
                                width: 8,
                                height: 15
                            }
                        ),

                        $(go.TextBlock,
                            {
                                row: 3,
                                column: 1,
                                margin: new go.Margin(5)
                            },
                            new go.Binding("text", "mobilePhone")))
                )
            )
        );

    orgChartDiagram.allowDelete = false;
    orgChartDiagram.allowMove = false;
    orgChartDiagram.model = $(go.TreeModel);
    orgChartDiagram.layout = $(go.TreeLayout, {angle: 360, layerSpacing: 100});

    $scope.data.nodes.forEach(function (node) {
        var nodeExists = orgChartDiagram.findNodeForKey(node.key);
        if (!nodeExists)
            orgChartDiagram.model.addNodeData(node);
    });

    orgChartDiagram.model.nodeKeyProperty = "key";
}
