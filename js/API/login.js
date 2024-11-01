

document.addEventListener("DOMContentLoaded",function() {
    const loginForm = document.getElementById("loginForm");

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

    
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
                const data=await response.json();
                console.log(data.role+" "+data.userId);

                sessionStorage.setItem("role",data.role);
                sessionStorage.setItem("userId",data.userId);
                
                switch(data.role){
                    case "ROLE_USER":window.location.href = 'http://127.0.0.1:5500/pages/customer/customer-dashboard.html';break;
                    case "ROLE_EMPLOYEE":window.location.href = 'http://127.0.0.1:5500/pages/employee/update_inventory.html';break;
                    case "ROLE_CLERK":window.location.href = 'http://127.0.0.1:5500/pages/clerk/view_orders.html';break;
                    case "ROLE_MANAGER":window.location.href = 'http://127.0.0.1:5500/pages/manager/admin-dashboard.html';break;
                }
            } 
            else {
                const errorText = await response.text();
                document.getElementById('error-message').textContent = errorText;
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('error-message').textContent = 'An error occurred. Please try again later.';
        }

    });

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        
        const name = document.getElementById('username1').value;
        const password = document.getElementById('password1').value;

        try {
            const res = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password }),
                credentials: 'include'
            });
    
            if (res.status===201) {
                console.log('Registration successful:', res);
                window.location.href = 'http://127.0.0.1:5500/index.html';
                 // Redirect if needed
            } else {
                const errorText = await res.text(); // Use 'res' instead of 'response'
                console.error('Error response:', errorText); // Log the error response
                document.getElementById('error-message1').textContent = errorText; // Show error message
            }
        } catch (error) {
            console.error('Error during registration:', error);
            document.getElementById('error-message1').textContent = 'An error occurred. Please try again later.';
        }
    });
    
});
