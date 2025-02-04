let map;

async function initMap(lat, long) {
	//@ts-ignore
	const { Map } = await google.maps.importLibrary('maps');

	map = new Map(document.getElementById('map'), {
		center: { lat: lat, lng: long },
		zoom: 10,
		mapTypeId: 'terrain'
	});
}

async function createPolyline(polyline_data, color, content, title) {
	const { encoding } = await google.maps.importLibrary('geometry'); // Import geometry library for decodePath

	// Decode the polyline using Google Maps API utility
	const path = encoding.decodePath(polyline_data);
  	const lineSymbol = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	};
	// Draw the polyline on the map
	const polyline = new google.maps.Polyline({
		path: path,
		geodesic: true,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 2,
		icons: [
			{
				icon: lineSymbol,
				offset: '100%',
			},
		],
	});

	polyline.setMap(map);

	// Create a marker at the midpoint of the polyline
	const midpointIndex = Math.floor(path.length / 2);
	const marker = new google.maps.Marker({
		position: path[midpointIndex], // Set marker at midpoint
		map: map,
		visible: false, // Hide marker initially
	});

	// InfoWindow setup
	const infoWindow = new google.maps.InfoWindow({
		content: content,
		ariaLabel: title,
	});

	// Show marker & InfoWindow on polyline click
	polyline.addListener('click', () => {
		marker.setVisible(true); // Show marker
		infoWindow.open(map, marker);
	});

	// Hide InfoWindow & marker on map click
	map.addListener('click', () => {
		marker.setVisible(false);
		infoWindow.close();
	});
}

function populateMap(data, type) {
	const colors = new Set();
	data.forEach((item) => {
		let randomColor;
		// Generate a unique color
		do {
			randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		} while (colors.has(randomColor));

			colors.add(randomColor);

			let content;
			let title;
			let polyline;

			if (type === 'activity') {
				const date = new Date(item.start_date);

				const formattedDate = date.toLocaleDateString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: 'numeric',
				});
				content = `<h1>${item.name}</h1><p>Date: ${formattedDate}</p><p>Distance: ${(
						item.distance * 0.000621371
					).toFixed(2)} miles</p><p>Time: ${(item.moving_time / 60).toFixed(1)} minutes</p>`
				polyline = item.map?.summary_polyline
				title = 'Activity Data'
			} else {
				content = `<h1>${item.name}</h1><p>Distance: ${(
					item.distance * 0.000621371
				).toFixed(2)} miles</p><p>Total Elevation Gain: ${
					item.total_elevation_gain
				} feet</p>`;
				title = "Segment Data"
				polyline = item.map?.polyline
			}
			createPolyline(polyline, randomColor, content, title);
	});		
}

const loginButton = document.querySelector('#loginButton');

if (loginButton) {
	loginButton.addEventListener('click', () => {
		window.location.href = '/strava/login';
	});
}

const select = document.querySelector('#displayType');

if (select) {
	select.addEventListener('change', (event) => {
		const selection = event.target.value;
		const dateInputs = document.querySelectorAll('.inputLabel');
		const displayButton = document.querySelector('#displayButton');
		displayButton.classList.remove('hidden');
		if (selection == 'timePeriod') {
			dateInputs.forEach((input) => {
				input.classList.remove('hidden');
			});
		}
	});
}

displayButton.addEventListener('click', async (event) => {
	try {
		let response;
		let data;
		if (select.value == 'last20') {
			response = await fetch(
				'http://localhost:8080/strava/20activities'
			); // Adjust for your backend URL
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			data = await response.json();
			initMap(data[0]['end_latlng'][0], data[0]['end_latlng'][1]);
			populateMap(data, 'activity')	
		} else if (select.value == 'starredSegments') {
			response = await fetch('http://localhost:8080/strava/starredsegments');
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			data = await response.json();
			initMap(data[0]['end_latlng'][0], data[0]['end_latlng'][1]);
			populateMap(data, 'segments');	
		} else {
			const startDateInput = document.querySelector('#startDate');
			const endDateInput = document.querySelector('#endDate');

			const startDate = startDateInput?.value;
			const endDate = endDateInput?.value;

			if (!startDate || !endDate) {
				console.error('Start or End date is missing!');
				return;
			}

			// Continue with your fetch request
			response = await fetch(
				`http://localhost:8080/strava/activities?start=${startDate}&end=${endDate}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			data = await response.json();
			initMap(data[0]['end_latlng'][0], data[0]['end_latlng'][1]);
			populateMap(data, 'activity');
		}
		resetInputs();
	} catch (error) {
		console.error('Error fetching activities:', error);
	}
});

function resetInputs() {
		select.value = 'default';
		const dateInputs = document.querySelectorAll('.inputLabel');
		const displayButton = document.querySelector('#displayButton');
		displayButton.classList.add('hidden');
		dateInputs.forEach((input) => {
			if (!input.classList.contains('hidden')) {
				input.classList.add('hidden');
			}
		});
}