const loginButton = document.querySelector('#loginButton');

if (loginButton) {
    loginButton.addEventListener('click', () => {
        window.location.href = '/strava/login';
    })
}