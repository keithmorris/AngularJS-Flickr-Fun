app.controller('MainCtrl', [
	'$scope', 'flickrRecent', '$location', '$route', '$routeParams', 'localStorageService',
	function ($scope, flickrRecent, $location, $route, $routeParams, store) {

		$scope = $.extend($scope, {}, {
			recentSearches: null,
			init: function () {
				$scope.setupWatchers();
				$scope.recentSearches = store.get('recentSearches') || [];
				$scope.$on('$routeChangeSuccess', this.onRouteChange);
			},
			setupWatchers: function () {
				$scope.watchFlickrData();
			},
			watchFlickrData: function () {
				$scope.$watch(function () {
					return flickrRecent.photos;
				}, function (data) {
					$scope.photos = data;
				}, true);
			},
			onSearchSubmit: function () {
				$scope.updatePath('/search/' + $scope.searchQuery);
			},
			updatePath: function (path) {
				$location.path(path);
			},
			addSearchHistoryItem: function (term) {
				var searches = store.get('recentSearches') || [],
					idx = $.inArray(term, searches);
				if (idx !== -1) {
					searches.splice(idx, 1);
				}
				searches.unshift(term);
				if (searches.length > 10) {
					searches = searches.slice(0, 10);
				}
				store.add('recentSearches', searches);
				$scope.recentSearches = searches;
			},
			clearRecentSearches: function () {
				$scope.recentSearches = [];
				store.remove('recentSearches');
				$scope.updatePath('/');
			},
			doSearch: function () {
				var query = $routeParams.query;

				$scope.addSearchHistoryItem(query);
				$scope.query = $scope.searchQuery = query;
				$scope.queryType = 'search';

				flickrRecent.search($scope.query);
			},
			getRecent: function () {
				$scope.query = $scope.searchQuery = '';
				$scope.queryType = 'recent';
				flickrRecent.getRecent();
			},
			getMore: function () {
				flickrRecent.getMore();
			},
			onRouteChange: function () {
				var action = $route.current.action;
				switch (action) {
					case 'recent':
						$scope.getRecent();
						break;
					case 'search':
						$scope.doSearch();
						break;
				}
			}
		});
		$scope.init();
	}]);
