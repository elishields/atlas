(function () {
    data.nodes = [];

    if (input) { // server.update called
        console.log('server.update called!');
        console.log(input);

        if (input.event == "search") {
            console.log("Searched for employee:");
            console.log(input.searchedEmployeeId);
        }
    } else { // Initial load
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

        user.photo = null;
        var photo = gr.getDisplayValue('photo');
        if (photo.length > 0) {
            user.photo = photo + '?t=small';
        }

        console.log("returning user: " + user.name);
        return user;
    }

    /**
     * Build node objects for the direct reports of an employee and push them
     * into the nodes array.
     *
     * @param {String} manager - the sys_id of the employee to get reports for
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
