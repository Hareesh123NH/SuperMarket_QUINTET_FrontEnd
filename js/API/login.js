
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
            });

            if (response.ok) {
                // Redirect to dashboard or the appropriate page after successful login
                const data=await response.json();
                console.log(data.role+" "+data.userId);

                const auth = btoa(`${username}:${password}`);

                sessionStorage.setItem("auth", auth);
                sessionStorage.setItem("userId",data.userId);
                sessionStorage.setItem("details",data.details);
                
                switch(data.role){
                    case "ROLE_USER":window.location.href = 'http://127.0.0.1:5500/pages/customer/customer-dash.html';break;
                    case "ROLE_EMPLOYEE":window.location.href = 'http://127.0.0.1:5500/pages/employee/employee-dash.html';break;
                    case "ROLE_CLERK":window.location.href = 'http://127.0.0.1:5500/pages/clerk/clerk-dash.html';break;
                    case "ROLE_MANAGER":window.location.href = 'http://127.0.0.1:5500/pages/manager/manager-dash.html';break;
                }
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } 
            else {
                const errorText = await response.json();
                document.getElementById('error-message').textContent = errorText.message;
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('error-message').textContent = 'An error occurred. Please try again later.';
        }

    });

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        
        const username = document.getElementById('username1').value;
        const password = document.getElementById('password1').value;
        const fullName = document.getElementById("fullName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;


        try {
            const res = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password ,fullName,phoneNumber,email,address}),
                credentials: 'include'
            });
    
            if (res.status===201) {
                console.log('Registration successfull:', res);
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


