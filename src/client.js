// Client Script global objects:
//     data - serialized data object received from Server Script
//     options - options used to invoke the widget on the server
// Client Script global functions:
//     this.server.get(): calls Server Script and passes custom input
//     this.server.update(): calls the server and posts this.data to the Server Script
//     this.server.refresh(): calls the server and automatically replaces the current options and data from the server response

function ($scope, $location, $http, spUtil, $timeout) {

    var client = this;

    console.log($scope.data);
}
