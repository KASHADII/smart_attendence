document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("🎉 Login successful!");

    
    if (user.role === "student") {
        window.location.href = "dashboard.html";
    } else if (user.role === "admin") {
        window.location.href = "admin.html";
    }
});
