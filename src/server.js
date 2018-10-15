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
            if (input.expandedUserDirection === "parent") {
                // Expand up a level
                // Fetch the employee's manager and team
                var user = input.expandedUserId;
                var gr = new GlideRecord('sys_user');
                gr.get(user);

                var manager = gr.getValue('manager');
                gr.get(manager);

                getReports(manager);
                data.nodes.push(getUser(gr));
            } else if (input.expandedUserDirection === "child") {
                // Expand down a level
                // Fetch the employee's direct reports
                getReports(input.expandedUserId);
            }
        }
    } else { /** Initial load. */
        // Get the logged in user
    var gr = new GlideRecord('sys_user');
        gr.get(gs.getUserID());
        data.nodes.push(getUser(gr));

        // Get the user's reports
        getReports(gr.getValue('sys_id'));

        // Get the user's manager
        gr.get(gr.getValue('manager'));
        data.nodes.push(getUser(gr));

        // Get the user's manager's reports
        getReports(gr.getValue('sys_id'));
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

        user.hasReports = false;
        if (getReports(user.key).length > 0) {
            console.log("getting reports for " + user.name + " " + getReports(user.key) + " length is " + getReports(user.key).length);
            user.hasReports = true;
        }
        console.log(user.name + " has reports " + user.hasReports);

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
        console.log(manager);

        var gr = new GlideRecord('sys_user');

        gr.addActiveQuery();
        // SELECT ... WHERE 'manager' == manager
        gr.addQuery('manager', manager);
        gr.query();

        while (gr.next()) {
            var report = getUser(gr);

            if (report.key == gs.getUserID()) continue;

            data.nodes.push(report);
        }
    }

})();

