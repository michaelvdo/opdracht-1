;(function() {
	'use strict';

	/**
	* Fetch albums and photos, using Axios
	* @return {undefined} undefined
	*/
	function fetchData() {
		var albums = [],
				baseURL = 'https://jsonplaceholder.typicode.com';

		// fetch albums
		axios.get(baseURL + '/albums')
			.then(function(response) {

				// Get the first 5 albums
				albums = response.data.slice(0, 5); // [{}, {}, {}, {}, {}]

				// Build the url for the GET call for the photos, using the album IDs
				var photosUrl = buildPhotosUrl(albums, baseURL);

				// Fetch photos
				axios.get(photosUrl)
					.then(function(response) {
						var photos = response.data;
						appendPhotosToAlbums(photos, albums);
						appendAlbumsToDOM(albums);
					})
					.catch(function(error) {
						console.log(error);
					});
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	/**
	* Build url and parameters for the photos ajax call
	* @param {Array} albums array of albums
	* @return {String} url including parameters as String
	*/
	function buildPhotosUrl(albums, baseURL) {
		// Extract album IDs
		var albumIDs = albums.map(function(obj) {
			return obj.id;
		});

		// Add the album IDs as parameters to the url and return it
		return baseURL + '/photos?albumId=' + albumIDs.join('&albumId=');
	}

	/**
	* Add photo url to albums
	* @param {Array} albums array of albums
	* @param {Array} photos array of photos
	* @return {undefined} undefined
	*/
	function appendPhotosToAlbums(photos, albums) {
		albums.forEach(function(album) {
			var matchingPhoto = photos.find(function(photo) {
				return photo.albumId === album.id;
			});
			album.url = matchingPhoto.url;
		});
	}

	/**
	* Append album & photo to DOM
	* @param {Array} albums array of albums
	* @return {undefined} undefined
	*/
	function appendAlbumsToDOM(albums) {
		var albumList = document.querySelector('.albums');
		albums.forEach(function(obj) {
			var li = document.createElement('li'),
					image = document.createElement('img'),
					title = document.createElement('h2');

			image.src = obj.url;
			title.innerHTML = obj.title;

			li.appendChild(image);
			li.appendChild(title);

			albumList.appendChild(li);
		});
	}

	function init() {
		fetchData();
	}

	document.addEventListener('DOMContentLoaded', init);
})();
