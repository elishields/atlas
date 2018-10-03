(function () {

    if (input) { // server.update called
        console.log('server.update called!');
    } else { // Inital load

        data.nodes = [];
        var currentUser = getCurrentUser();
        data.nodes.push(currentUser);

        getReports(currentUser, data.nodes);

    }

    function getCurrentUser() {

        var currentUser = {};

        var gr = new GlideRecord('sys_user');
        gr.get(gs.getUserID());

        // returning undefined sys_id
        currentUser.key = gs.getDisplayValue('sys_id');
        currentUser.name = gr.getDisplayValue('name');
        currentUser.title = gr.getDisplayValue('title');
        currentUser.department = gr.getDisplayValue('department');
        currentUser.email = gr.getDisplayValue('email');
        currentUser.businessPhone = gr.getDisplayValue('business_phone');
        currentUser.mobilePhone = gr.getDisplayValue('mobile_phone');
        currentUser.location = gr.getDisplayValue('location');

        console.log("returning currentUser: " + currentUser.name);
        return currentUser;
    }

    function getReports(manager, nodes) {

        console.log(manager);
        console.log(nodes);

        var gr = new GlideRecord('sys_user');

        gr.addActiveQuery();
        gr.addQuery('manager', manager);
        gr.query();

        while (gr.next()) {
            console.log("gib");
            var report = getUser(gr);
            nodes.push(report);
        }
    }

    function getUser(gr) {

        var user = {};



    }

})();
