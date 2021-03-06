var app = angular.module('flickrApp', ['infinite-scroll', 'LocalStorageModule']);


app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			action: 'recent'
		})
		.when('/recent', {
			action: 'recent'
		})
		.when('/search/:query', {
			action: 'search'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);

