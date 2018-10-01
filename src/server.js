// GlideUser API provides access to current user info

(function () {

    data.nodes = [];
    var user = {};

    var gr = new GlideRecord('sys_user');
    gr.get(gs.getUserID());

    user.key = gs.getDisplayValue('sys_id');
    user.name = gr.getDisplayValue('name');
    user.title = gr.getDisplayValue('title');
    user.department = gr.getDisplayValue('department');
    user.email = gr.getDisplayValue('email');
    user.businessPhone = gr.getDisplayValue('business_phone');
    user.mobilePhone = gr.getDisplayValue('mobile_phone');
    user.location = gr.getDisplayValue('location');
    data.nodes.push(user);
})();
