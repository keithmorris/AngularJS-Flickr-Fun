var app;

app.directive('photo', [function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/photo.tpl.html',
		replace: true,
		link: function (scope, element, attributes) {

		}
	}
}]);
