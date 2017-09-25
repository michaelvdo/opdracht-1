;(function() {
	'use strict';

	// Semi-global variables
	var albumData = {},
			photosData = {},
			albumList = document.querySelector('.albums');

	function fetchData() {
		// fetch albums
		axios.get('https://jsonplaceholder.typicode.com/albums')
			.then(function(response) {

				// Get the first 5 albums
				albumData = extractSubArray(response.data, 5);

				// Extract album id's to construct photos GET call
				var albumIDs = albumData.map(extractID);

				// Build photos GET call
				var photosUrlParamString = albumIDs.reduce(buildUrl, 'https://jsonplaceholder.typicode.com/photos?');

				// Get the 5 photos matching the albums
				axios.get(photosUrlParamString)
					.then(function(response) {
						photosData = response.data;
						appendDataToDOM();
					})
					.catch(function(error) {
						console.log(error);
					});

			})
			.catch(function(error) {
				console.log(error);
			});

		// Helper functions
		function extractSubArray(data, amount) {
			return data.slice(0, amount);
		}

		function extractID(obj) {
			return obj.id;
		}

		function buildUrl(acc, current, index, array) {
			var paramString = acc.toString() + 'id=' + current.toString();
			paramString = paramString + ((index >= (array.length - 1)) ? '' : '&');
			return paramString;
		}
	}

	function appendDataToDOM() {
		console.log(albumData);

		albumData.forEach(addAlbumToDOM);

		function addAlbumToDOM(obj, index) {
			var li = document.createElement('li'),
					image = document.createElement('img'),
					title = document.createElement('h2');

			image.src = photosData[index].url;
			title.innerHTML = obj.title;

			li.appendChild(image);
			li.appendChild(title);

			albumList.appendChild(li);
		}
	}

	function init() {
		fetchData();
	}

	document.addEventListener('DOMContentLoaded', init);
})();
