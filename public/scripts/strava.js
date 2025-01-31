const activities = null

const loginButton = document.querySelector('#loginButton');

if (loginButton) {
    loginButton.addEventListener('click', () => {
        window.location.href = '/strava/login';
    })
}

const select = document.querySelector('#displayType');

if (select) {
	select.addEventListener('change', (event) => {
        const selection = event.target.value
        const dateInputs = document.querySelectorAll('.inputLabel')
        const displayButton = document.querySelector('#displayButton')
        displayButton.classList.remove('hidden');
		if (selection == "timePeriod") {
            dateInputs.forEach((input) => {
                input.classList.remove('hidden')
            })
        }

        displayButton.addEventListener("click", async (event) => {
            console.log(select.value);
            const activityList = document.querySelector('#activityList');
            activityList.innerHTML = ''; // Clear previous data

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
                        console.log(activity.name)
                    })
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
        })
	});
}