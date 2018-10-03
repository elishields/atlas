(function () {

    data.nodes = [];

    if (input) { // server.update called
        console.log('server.update called!');

    } else { // Inital load

        var gr = new GlideRecord('sys_user');
        gr.get(gs.getUserID());

        var currentUser = getUser(gr);
        data.nodes.push(currentUser);

        // manager
        gr.get(currentUser.parent);
        data.nodes.push(getUser(gr));

        // TODO get currentUser subs

        // TODO get currentUser Manager subs

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
            nodes.push(report);
        }
    }

})();
