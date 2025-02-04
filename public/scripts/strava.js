let map;

async function initMap(lat, long) {
	//@ts-ignore
	const { Map } = await google.maps.importLibrary('maps');

	map = new Map(document.getElementById('map'), {
		center: { lat: lat, lng: long },
		zoom: 12,
	});
}

async function createPolyline(polyline_data, color) {
	const { encoding } = await google.maps.importLibrary('geometry'); // Import geometry library for decodePath

	// Decode the polyline using Google Maps API utility
	const path = encoding.decodePath(polyline_data); // Use the correct import for decoding

	// Draw the polyline on the map
	const polyline = new google.maps.Polyline({
		// Directly use google.maps.Polyline
		path: path,
		geodesic: true,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});
	// I need to add a marker to each polyline. I want it to just show up when the user clicks on the line
	polyline.setMap(map);
}

const activities = [];

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
		if (select.value == 'last20') {
			const response = await fetch(
				'http://localhost:8080/strava/20activities'
			); // Adjust for your backend URL
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			const colors = []
			initMap(data[0]['end_latlng'][0], data[0]['end_latlng'][1]);
			data.forEach((activity) => {
				let randomColor;
				// Generate a unique color
				do {
					randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
				} while (colors.includes(randomColor));
					colors.push(randomColor);
					createPolyline(activity.map.summary_polyline, randomColor);
				});			
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