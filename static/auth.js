document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const responseMessage = document.getElementById("responseMessage");

    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        responseMessage.textContent = data.message;
    })
    .catch(error => {
        responseMessage.textContent = 'Failed to register: ' + error.message;
    });
});


// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    var username = document.getElementById("loginUsernameModal").value;
    var password = document.getElementById("loginPasswordModal").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        if (data.message === 'Login successful') {
            window.location.href = '/';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);

