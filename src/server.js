(function () {

    data.nodes = [];

    if (input) { // server.update called
        console.log('server.update called!');

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
        getReports(gr.getValue('sys_id'));
    }

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

        console.log("returning user: " + user.name);
        return user;
    }

    function getReports(manager) {

        console.log(manager);

        var gr = new GlideRecord('sys_user');

        gr.addActiveQuery();
        // SELECT ... WHERE 'manager' == manager
        gr.addQuery('manager', manager);
        gr.query();

        while (gr.next()) {
            var report = getUser(gr);
            data.nodes.push(report);
        }
    }

})();
