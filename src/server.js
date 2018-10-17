(function () {
    data.nodes = [];

    /**
     * If "input" is defined the client script has invoked a server update.
     * Otherwise, the widget has loaded for the first time and we load
     * in the initial employees to display.
     *
     * @param input {Object} - input data passed from the client
     * @param input.event (String) - the type of event that invoked server.update()
     * @param input.searchedEmployeeId {String} - the ID of the employee entered in the search field
     * @param input.expandedUserId {String} - the ID of the employee that had an expansion button clicked on their node
     * @param input.expandedUserDirection (String) - the direction to expand the graph ("parent" or "child")
     */
    if (input) { // server.update called
        console.log('server.update called!');
        console.log(input);

        // An employee has been searched for.
        if (input.event === "search") {
            var gr = new GlideRecord('sys_user');
            gr.get(input.searchedEmployeeId);
            data.nodes.push(getUser(gr));

        } else if (input.event === "expand") { // An expand button was clicked

            // Fetch the employee's manager and team
            if (input.expandedUserDirection === "parent") {
                var gr = new GlideRecord('sys_user');

                // get user
                var user = input.expandedUserId;
                gr.get(user);

                // get user's manager
                var manager = gr.getValue('manager');
                gr.get(manager);
                data.nodes.push(getUser(gr));

                // get manager's reports
                var reports = getReports(manager);
                reports.forEach(function(report) {
                    data.nodes.push(report);
                });

            } else if (input.expandedUserDirection === "child") {
                // Fetch the employee's direct reports
                var reports = getReports(input.expandedUserId);
                reports.forEach(function(report) {
                    data.nodes.push(report);
                });
            }
        }
    } else { /** Initial load. */
        // Get the logged in user's record
        var gr = new GlideRecord('sys_user');
        gr.get(gs.getUserID());

        // Get the user's reports and add them to the node array
        var reports = getReports(gr.getValue('sys_id'));
        reports.forEach(function(report) {
            report.parentExpanded = true;
            user.parentExpandBtnSymbol = ">";
            data.nodes.push(report);
        });

        // Get the user's manager and add them to the node array
        gr.get(gr.getValue('manager'));
        var manager = getUser(gr);
        manager.childExpanded = true;
        user.childExpandBtnSymbol = "<";
        data.nodes.push(manager);

        // Get the user's manager's reports and add them to the node array
        // (This includes the record of the logged in user so it was not fetched beforehand)
        var reports = getReports(gr.getValue('sys_id'));
        reports.forEach(function(report) {
            report.parentExpanded = true;
            user.parentExpandBtnSymbol = ">";
            data.nodes.push(report);
        });
    }

    /**
     * Build a node object for an employee..
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
        user.childExpanded = false;
        user.parentExpanded = false;
        user.childExpandBtnSymbol = ">";
        user.parentExpandBtnSymbol = "<";

        user.photo = gr.getDisplayValue('photo');
        if (user.photo.length < 1) {
            user.photo = null;
        }

        console.log("returning user: " + user.name);
        return user;
    }

    /**
     * Build node objects for the direct reports of an employee and push them
     * into the nodes array.
     *
     * @param {String} manager - the sys_id of the employee to get reports for
     * @return {Array} the user objects that report to param manager
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
        console.log("returning reports " + reports);
        return reports;
    }

})();
