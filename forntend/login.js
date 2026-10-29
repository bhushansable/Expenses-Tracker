const loginTab = document.getElementById("login_tab");
const registerTab = document.getElementById("register_tab");

const loginForm = document.getElementById("login_form");
const registerForm = document.getElementById("register_form");

const Api_URL = "http://127.0.0.1:8000";
const message = document.getElementById("message");

// Switch to login
loginTab.addEventListener("click", function () {
    loginForm.hidden = false;
    registerForm.hidden = true;

    loginTab.classList.add("active");
    registerTab.classList.remove("active");
});

// Switch to register
registerTab.addEventListener("click", function () {
    registerForm.hidden = false;
    loginForm.hidden = true;

    registerTab.classList.add("active");
    loginTab.classList.remove("active");
});

function showMessage(text, color = "red") {
    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;
    message.style.color = color;
}

// Register
registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("register_name").value.trim();
    const email = document.getElementById("register_email").value.trim();
    const password = document.getElementById("register_password").value;

    try {
        const response = await fetch(`${Api_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                typeof data.detail === "string"
                    ? data.detail
                    : JSON.stringify(data.detail || "Registration failed")
            );
        }

        registerForm.reset();
        showMessage("Registration successful. Please log in.", "green");

    } catch (error) {
        showMessage(error.message || "Cannot connect to server.");
    }
});

// Login
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value;

    try {
        const response = await fetch(`${Api_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

     
const data = await response.json();

if (!response.ok) {
    throw new Error(data.detail || "Login failed");
}

const userId = data.user_id;

if (userId == null) {
    throw new Error("User ID missing from login response.");
}

sessionStorage.setItem("user_id", String(userId));

window.location.href = "/forntend/expense.html";


    } catch (error) {
        showMessage(error.message || "Cannot connect to server.");
    }
});