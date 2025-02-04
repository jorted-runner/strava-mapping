let map;

async function initMap(lat, long) {
	//@ts-ignore
	const { Map } = await google.maps.importLibrary('maps');

	map = new Map(document.getElementById('map'), {
		center: { lat: lat, lng: long },
		zoom: 12,
	});
}

async function createPolyline(polyline_data, color, content, title) {
	const { encoding } = await google.maps.importLibrary('geometry'); // Import geometry library for decodePath

	// Decode the polyline using Google Maps API utility
	const path = encoding.decodePath(polyline_data);

	// Draw the polyline on the map
	const polyline = new google.maps.Polyline({
		path: path,
		geodesic: true,
		strokeColor: color,
		strokeOpacity: 1.0,
		strokeWeight: 2,
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

function createContent(activity) {
	console.log(activity)
	return {
		content: `<h1>${activity.name}</h1><p>Distance: ${(
			activity.distance * 0.000621371
		).toFixed(2)} miles</p><p>Time: ${(activity.moving_time / 60).toFixed(1)} minutes</p>`,
		title: 'Activity Title',
	};
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
		let response;
		let date;
		if (select.value == 'last20') {
			response = await fetch(
				'http://localhost:8080/strava/20activities'
			); // Adjust for your backend URL
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			data = await response.json();
		} else if (select.value == "") {
			response = await fetch('http://localhost:8080/strava/starredsegments'); // Adjust for your backend URL
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			data = await response.json();
		}
		const colors = []
		initMap(data[0]['end_latlng'][0], data[0]['end_latlng'][1]);
		data.forEach((activity) => {
			let randomColor;
			// Generate a unique color
			do {
				randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
			} while (colors.includes(randomColor));
				colors.push(randomColor);
				const { content, title } = createContent(activity);
				createPolyline(activity.map.summary_polyline, randomColor, content, title);
			});			
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