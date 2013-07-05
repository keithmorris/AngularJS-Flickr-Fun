app.factory('flickrRecent', ['$http', function ($http) {

	var url = 'http://api.flickr.com/services/rest/',
		methods = {
			'recent': 'flickr.photos.getRecent',
			'search': 'flickr.photos.search'
		},
		apiKey = '51024b980a33aded7b162d9074b9465c',
		jsonCallback = 'JSON_CALLBACK',
		extras = ["url_q"],
		append = false,
		currentCall = '',
		totalPages,
		currentPage;

	function getSearchURL(query) {
		return currentCall = url + '?method=' + methods.search +
			'&text=' + query +
			'&extras=' + extras.join(',') +
			'&api_key=' + apiKey +
			'&format=json&' +
			'jsoncallback=' + jsonCallback;
	}

	function getRecentURL() {
		return currentCall = url + '?method=' + methods.recent +
			'&extras=' + extras.join(',') +
			'&api_key=' + apiKey +
			'&format=json' +
			'&jsoncallback=' + jsonCallback
	}

	svc = {
		photos: [],
		dataLoading: false,
		getRecent: function () {
			append = false;
			svc.makeApiCall(getRecentURL());
		},
		search: function (query) {
			append = false;
			svc.makeApiCall(getSearchURL(query));
		},
		getMore: function () {
			append = true;
			currentPage++;
			svc.makeApiCall(currentCall + '&page=' + currentPage);
		},
		makeApiCall: function (apiCall) {
			if (svc.dataLoading) return;
			svc.dataLoading = true;
			$http.jsonp(apiCall)
				.success(svc.onLoadSuccess)
				.error(function () {
					console.log('error', arguments);
					svc.dataLoading = false;
				});
		},
		onLoadSuccess: function (data) {
			currentPage = data.photos.page;
			totalPages = data.photos.pages;
			svc.photos = (append) ? svc.photos.concat(data.photos.photo) : data.photos.photo;
			svc.dataLoading = false;
		}
	};
	return svc;
}]);
