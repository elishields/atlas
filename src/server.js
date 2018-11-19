(function () {
    /** An array of objects containing employee records that will be displayed on the chart. */
    data.nodes = [];

    /**
     * If "input" is defined the client script has invoked a server update.
     * If an update is requested we look at what event was sent from the client
     * and take the correct action (e.g. expanding a level, resetting).
     *
     * Otherwise, the widget has loaded for the first time and we load
     * in the initial employees to display.
     *
     * @param input {Object} - input data passed from the client
     *
     * @param input.event (String) - the type of event that invoked server.update()
     *                               search: an employee was searched for and their first degree of data will be returned
     *                               expand: an expand button on a node of the chart was clicked and the correct level of
     *                                       data will be returned
     *                                    reset: a reset view button was clicked and the view will be reset to the correct
     *                                       data for the clicked button
     *
     * @param input.searchedEmployeeId {String} - the ID of the employee entered in the search field
     *
     * @param input.expandedUserId {String} - the ID of the employee that had an expansion button clicked on their node
     *
     * @param input.expandedUserDirection {String} - the direction to expand the graph
     *                                               parent: expand up a level from the clicked employee (direct reports)
     *                                                child: expand down a level from the clicked employee (manager and team)
     *
     * @param input.resetAction {String} - the reset action to take
     *                                      me: reset the view to the logged in user
     *                                     ceo: reset the view to the ceo (top)
     */
    if (input) { // server.update called
        console.log('server.update called!');
        console.log(input);

        // An employee has been searched for.
        // Get their record, their reports and manager (if they exist)
        // and send the data back to the client via the data.nodes array.
        if (input.event === "search") {
            var gr = new GlideRecord('sys_user');
            gr.get(input.searchedEmployeeId);
            var searchedEmployee = getUser(gr);

            if (searchedEmployee.hasReports) {
                var reports = getReports(gr.getValue('sys_id'));
                reports.forEach(function (report) {
                    data.nodes.push(report);
                });
            }

            // Since fetching an employee's manager's reports will also fetch the employee, we only add the
            // searched employee's record explicitly if they do not have a manager to avoid duplicates.
            if (searchedEmployee.hasManager) {
                gr.get(gr.getValue('manager'));
                data.nodes.push(getUser(gr));

                var reports = getReports(gr.getValue('sys_id'));
                reports.forEach(function (report) {
                    data.nodes.push(report);
                });
            } else {
                data.nodes.push(searchedEmployee);
            }

            // An expand button was clicked.
            // Determine the direction of expansion and load in the correct level of data.
        } else if (input.event === "expand") {
            if (input.expandedUserDirection === "parent") {
                console.log("FETCHING PARENT.");
                var gr = new GlideRecord('sys_user');

                var user = input.expandedUserId;
                gr.get(user);

                var manager = gr.getValue('manager');
                gr.get(manager);
                data.nodes.push(getUser(gr));

                var reports = getReports(manager);
                reports.forEach(function (report) {
                    data.nodes.push(report);
                });
            } else if (input.expandedUserDirection === "child") {
                console.log("FETCHING CHILD.");
                var reports = getReports(input.expandedUserId);
                reports.forEach(function (report) {
                    data.nodes.push(report);
                });
            }
            // One of the reset view buttons was clicked.
            // Determine which one ("me" or "top") was clicked and display the
            // correct data.
        } else if (input.event === 'reset') {
            var gr = new GlideRecord('sys_user');

            if (input.resetAction === 'me') {
                gr.get(gs.getUserID());
            } else if (input.resetAction === 'ceo') {
                gr.addQuery('title', "Chief Executive Officer");
                gr.query();

                if (gr.getRowCount() > 1) {
                    gr = null;
                } else {
                    // Loop to get to the record.
                    // The assumption is this is moving some sort of iterator to the end of a resultset.
                    while (gr.next()) {
                    }
                }
            }

            // If the GlideRecord was set to null we found more than 1 record for the CEO and will display an error
            if (gr !== null) {
                var resetToEmployee = getUser(gr);

                if (resetToEmployee.hasReports) {
                    var reports = getReports(gr.getValue('sys_id'));
                    reports.forEach(function (report) {
                        data.nodes.push(report);
                    });
                }

                if (resetToEmployee.hasManager) {
                    gr.get(gr.getValue('manager'));
                    data.nodes.push(getUser(gr));

                    var reports = getReports(gr.getValue('sys_id'));
                    reports.forEach(function (report) {
                        data.nodes.push(report);
                    });
                } else {
                    data.nodes.push(resetToEmployee);
                }
            } else {
                data.nodes.push({
                    key: -1,
                    parent: -1,
                    name: "Error",
                    title: "More than one record returned for topmost employee.",
                    hasReports: false,
                    hasManager: false
                });
            }

        }
        // Initial load.
        // Load the logged in employee's first degree of data
        // (their own record, their reports, their manager and team).
    } else {
        data.userId = gs.getUserID();

        // Get the logged in employee's record
        var gr = new GlideRecord('sys_user');
        gr.get(gs.getUserID());
        var loggedInEmployee = getUser(gr);

        if (loggedInEmployee.hasReports) {
            var reports = getReports(gr.getValue('sys_id'));
            reports.forEach(function (report) {
                data.nodes.push(report);
            });
        }

        // Since fetching an employee's manager's reports will also fetch the employee, we only add the
        // searched employee's record explicitly if they do not have a manager to avoid duplicates..
        if (loggedInEmployee.hasManager) {
            gr.get(gr.getValue('manager'));
            data.nodes.push(getUser(gr));

            var reports = getReports(gr.getValue('sys_id'));
            reports.forEach(function (report) {
                data.nodes.push(report);
            });
        } else {
            data.nodes.push(loggedInEmployee);
        }
    }

    /**
     * Build a node object for an employee. Extract the required information from their GlideRecord
     * and build an object that can be placed into the data.nodes array to be displayed on the chart.
     *
     * @param {GlideRecord} gr - the GlideRecord of the employee
     * @return {Object} the employee object to be pushed into the nodes array
     */
    function getUser(gr) {
        var user = {};

        user.key = gr.getValue('sys_id');
        user.name = gr.getDisplayValue('name');
        user.title = gr.getDisplayValue('title');
        user.department = gr.getDisplayValue('department');
        user.email = gr.getDisplayValue('email');
        user.businessPhone = gr.getDisplayValue('business_phone');
        user.mobilePhone = gr.getDisplayValue('mobile_phone');
        user.location = gr.getDisplayValue('location');
        user.parent = gr.getValue('manager');
        user.hasReports = getReports(user.key).length > 0;
        user.hasManager = !(gr.getValue('manager') == null);

        user.photo = gr.getDisplayValue('photo');
        if (user.photo.length < 1) {
            user.photo = null;
        }

        // GoJS requires a value for the parent key
        if (!user.hasManager) user.parent = -1;

        return user;
    }

    /**
     * Build an array of node objects for the direct reports of an employee.
     *
     * @param {String} manager - the sys_id of the employee to get reports for
     * @return {Array} a list of employee record objects that can be pushed into the data.nodes
     *                 array to be displayed on the chart
     */
    function getReports(manager) {
        var gr = new GlideRecord('sys_user');
        gr.addActiveQuery();
        gr.addQuery('manager', manager);
        gr.query();
        var reports = [];
        while (gr.next()) {
            var report = getUser(gr);
            reports.push(report);
        }
        return reports;
    }

})();
