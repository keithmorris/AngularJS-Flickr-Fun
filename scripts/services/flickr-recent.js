app.factory('flickrRecent', ['$http', '$resource', function ($http, $resource) {

	var flickr = $resource('http://api.flickr.com/services/rest/',
			{
				api_key: '51024b980a33aded7b162d9074b9465c',
				extras: 'url_q',
				// description, license, date_upload, date_taken, owner_name,
				// icon_server, original_format, last_update, geo, tags, machine_tags,
				// o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q,
				// url_m, url_n, url_z, url_c, url_l, url_o
				jsoncallback: 'JSON_CALLBACK',
				format: 'json',
				per_page: 100
			},
			{
				recent: {
					method: 'JSONP',
					params: {
						method: 'flickr.photos.getRecent'
					}
				},
				search: {
					method: 'JSONP',
					params: {
						method: 'flickr.photos.search'
					}
				}
			}),

		currentCall,
		totalPages,
		currentPage,
		append = false,

		svc = {
			photos: [],
			dataLoading: false,
			getRecent: function () {
				append = false;
				svc.makeCall('recent');
			},
			search: function (query) {
				append = false;
				svc.makeCall('search', {text: query});
			},
			makeCall: function (method, params) {
				params = params || {};
				currentCall = {
					method: method,
					params: params
				};
				flickr[method](params, this.onLoadSuccess);
			},
			getMore: function () {
				if (svc.dataLoading) return

				svc.dataLoading = true;
				append = true;
				currentPage++;
				currentCall.params.page = currentPage;
				svc.makeCall(currentCall.method, currentCall.params);
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
