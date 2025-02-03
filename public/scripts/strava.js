let map;

async function initMap(polyline_data) {
	//@ts-ignore
	const { Map } = await google.maps.importLibrary('maps');
	const { encoding } = await google.maps.importLibrary('geometry'); // Import geometry library for decodePath

	const map = new Map(document.getElementById('map'), {
		center: { lat: 39, lng: -94.28 },
		zoom: 12,
	});

	console.log(polyline_data);

	// Decode the polyline using Google Maps API utility
	const path = encoding.decodePath(polyline_data); // Use the correct import for decoding

	// Draw the polyline on the map
	const polyline = new google.maps.Polyline({
		// Directly use google.maps.Polyline
		path: path,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

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
					data.forEach((activity) => {
                        activities.push(activity)
					});
                    console.log(activities[0]);
                    initMap(activities[0].map.summary_polyline);
				}

				select.value = 'default';
				const dateInputs = document.querySelectorAll('.inputLabel');
				const displayButton = document.querySelector('#displayButton');
				displayButton.classList.add('hidden');
				dateInputs.forEach((input) => {
					if (!input.classList.contains('hidden')) {
						input.classList.add('hidden');
					}
				});
			} catch (error) {
				console.error('Error fetching activities:', error);
			}
		});
	});
}
