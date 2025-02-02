

((g) => {
	var h,
		a,
		k,
		p = 'The Google Maps JavaScript API',
		c = 'google',
		l = 'importLibrary',
		q = '__ib__',
		m = document,
		b = window;
	b = b[c] || (b[c] = {});
	var d = b.maps || (b.maps = {}),
		r = new Set(),
		e = new URLSearchParams(),
		u = () =>
			h ||
			(h = new Promise(async (f, n) => {
				await (a = m.createElement('script'));
				e.set('libraries', [...r] + '');
				for (k in g)
					e.set(
						k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
						g[k]
					);
				e.set('callback', c + '.maps.' + q);
				a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
				d[q] = f;
				a.onerror = () => (h = n(Error(p + ' could not load.')));
				a.nonce = m.querySelector('script[nonce]')?.nonce || '';
				m.head.append(a);
			}));
	d[l]
		? console.warn(p + ' only loads once. Ignoring:', g)
		: (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
	key: 'AIzaSyBPHrUg1lxuweO8JnhRcSj2nrTWhiTHzqk',
	v: 'weekly',
	// Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
	// Add other bootstrap parameters as needed, using camel case.
});

function initMap() {
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: { lat: 0, lng: -180 },
		mapTypeId: 'terrain',
	});
	const flightPlanCoordinates = [
		{ lat: 37.772, lng: -122.214 },
		{ lat: 21.291, lng: -157.821 },
		{ lat: -18.142, lng: 178.431 },
		{ lat: -27.467, lng: 153.027 },
	];
	const flightPath = new google.maps.Polyline({
		path: flightPlanCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

	flightPath.setMap(map);
}

window.initMap = initMap;
