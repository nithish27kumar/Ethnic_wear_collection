function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Here you could implement actual authentication against a database.
    // Assuming any non-empty username/password combination is valid for now.
    
    if (username && password) {
        // Store login status in local storage
        localStorage.setItem("isLoggedIn", "true");
        
        // Redirect to the main shopping page (index.html)
        window.location.href = "index.html";
    } else {
        alert("Please fill in all fields.");
    }
}