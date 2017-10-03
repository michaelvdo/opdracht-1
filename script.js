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
				albums = response.data.slice(0, 5);

				// Build the url for the GET call to fetch all photos with matching albumId
				var photosUrl = buildPhotosUrl(albums, baseURL);

				// Fetch photos
				axios.get(photosUrl)
					.then(function(response) {
						appendAlbumsToDOM(albums, response.data); // response.data = photos
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
	* Build url and parameters for the photos ajax call using the album IDs.
	* Array.map() is used to construct an array of albumIDs, and join() is used to
	* build a string of parameters using those albumIDs.
	* @param {Array} albums array of albums
	* @return {String} url including parameters as String
	*/
	function buildPhotosUrl(albums, baseURL) {
		return baseURL + '/photos?albumId=' + albums.map(function(album) {
			return album.id;
		}).join('&albumId=');
	}

	/**
	* Find the first photo object that matches the album ID, using Array.find(),
	* and return the matching photo object's url property
	* @param {Array} photos array of photos
	* @param {Object} album album
	* @return {String} image url
	*/
	function getPhotoForAlbum(photos, album) {
		return photos.find(function(photo) {
				return photo.albumId === album.id;
			}).url;
	}

	/**
	* Append albums & photo urls to DOM
	* @param {Array} albums array of albums
	* @return {undefined} undefined
	*/
	function appendAlbumsToDOM(albums, photos) {
		var albumList = document.querySelector('.albums');
		albums.forEach(function(album) {
			var li = document.createElement('li'),
					image = document.createElement('img'),
					title = document.createElement('h2');

			image.src = getPhotoForAlbum(photos, album);
			title.innerHTML = album.title;

			li.appendChild(image);
			li.appendChild(title);

			albumList.appendChild(li);
		});
	}

	document.addEventListener('DOMContentLoaded', fetchData);
})();
