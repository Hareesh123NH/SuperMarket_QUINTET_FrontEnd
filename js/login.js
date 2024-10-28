// document.addEventListener("DOMContentLoaded", function() {
//     const loginForm = document.getElementById("loginForm");

//     loginForm.addEventListener("submit", function(event) {
//         event.preventDefault(); // Prevent form from submitting for demo

//         // Form validation
//         const emailInput = document.getElementById("email");
//         const passwordInput = document.getElementById("password");

//         if (emailInput.value === "" || !emailInput.value.includes("@")) {
//             emailInput.classList.add("is-invalid");
//         } else {
//             emailInput.classList.remove("is-invalid");
//         }

//         if (passwordInput.value === "") {
//             passwordInput.classList.add("is-invalid");
//         } else {
//             passwordInput.classList.remove("is-invalid");
//         }

//         // If form is valid, proceed with submission (for demo purposes, just log to console)
//         if (emailInput.value && emailInput.value.includes("@") && passwordInput.value) {
//             console.log("Form submitted successfully!");
//             alert("Login successful!");
//         }
//     });
// });


document.addEventListener("DOMContentLoaded",function() {
    const loginForm = document.getElementById("loginForm");

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Form validation
        // const emailInput = document.getElementById("email");
        // const passwordInput = document.getElementById("password");

        // if (emailInput.value === "" || !emailInput.value.includes("@")) {
        //     emailInput.classList.add("is-invalid");
        // } else {
        //     emailInput.classList.remove("is-invalid");
        // }

        // if (passwordInput.value === "") {
        //     passwordInput.classList.add("is-invalid");
        // } else {
        //     passwordInput.classList.remove("is-invalid");
        // }

        // // If form is valid, proceed with submission (for demo purposes, just log to console)
        // if (emailInput.value && emailInput.value.includes("@") && passwordInput.value) {
        //     console.log("Form submitted successfully!");
        //     alert("Login successful!");
        // }
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Include cookies if using session-based authentication.
            });

            if (response.ok) {
                // Redirect to dashboard or the appropriate page after successful login
                window.location.href = 'http://127.0.0.1:5500/pages/customer/customer-dashboard.html';
            } else {
                const errorText = await response.text();
                document.getElementById('error-message').textContent = errorText;
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('error-message').textContent = 'An error occurred. Please try again later.';
        }

    });
});
