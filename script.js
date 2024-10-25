
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const role = document.getElementById("role").value;
    
    switch (role) {
        case 'customer':
            window.location.href = "customer/profile.html";
            break;
        case 'clerk':
            window.location.href = "clerk/view_orders.html";
            break;
        case 'employee':
            window.location.href = "employee/update_inventory.html";
            break;
        case 'manager':
            window.location.href = "manager/manage_employees.html";
            break;
        default:
            alert("Invalid role");
    }
});
function approveOrder(orderId) {
    alert("Order " + orderId + " has been approved.");
    // You can add logic here to send approval to the server (using fetch or AJAX).
}

function rejectOrder(orderId) {
    alert("Order " + orderId + " has been rejected.");
    // You can add logic here to send rejection to the server (using fetch or AJAX).
}
function removeItem(itemId) {
    alert("Item " + itemId + " has been removed from the cart.");
    // You can add logic here to update the cart in the backend or session.
}

function placeOrder() {
    alert("Your order has been placed successfully!");
    // Here you can add the logic to proceed with the order placement (e.g., sending the order details to the server).
}
function cancelOrder(orderId) {
    const confirmation = confirm("Are you sure you want to cancel order #" + orderId + "?");
    if (confirmation) {
        alert("Order #" + orderId + " has been canceled.");
        // You can add logic here to update the backend or session, cancel the order via an API, etc.
    }
}
document.getElementById('addClerkForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const clerkName = document.getElementById('clerkName').value;
    const clerkEmail = document.getElementById('clerkEmail').value;

    // Add new clerk to the table
    const tableBody = document.getElementById('clerksTable').querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${clerkName}</td>
        <td>${clerkEmail}</td>
        <td><button class="remove-btn">Remove</button></td>
    `;
    tableBody.appendChild(newRow);

    // Clear the form
    document.getElementById('addClerkForm').reset();
    document.getElementById('add-message').innerText = "Clerk added successfully!";

    // Add event listener for the remove button
    newRow.querySelector('.remove-btn').addEventListener('click', function() {
        tableBody.removeChild(newRow);
    });
});
document.getElementById('addEmployeeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const employeeName = document.getElementById('employeeName').value;
    const employeeEmail = document.getElementById('employeeEmail').value;

    // Add new employee to the table
    const tableBody = document.getElementById('employeesTable').querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${employeeName}</td>
        <td>${employeeEmail}</td>
        <td><button class="remove-btn">Remove</button></td>
    `;
    tableBody.appendChild(newRow);

    // Clear the form
    document.getElementById('addEmployeeForm').reset();
    document.getElementById('add-message').innerText = "Employee added successfully!";

    // Add event listener for the remove button
    newRow.querySelector('.remove-btn').addEventListener('click', function() {
        tableBody.removeChild(newRow);
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // Dummy data for products
    const products = [
        { id: 1, name: "Apples", category: "Fruits", price: "$1.50", stock: 120 },
        { id: 2, name: "Milk", category: "Dairy", price: "$2.00", stock: 50 },
        { id: 3, name: "Bread", category: "Bakery", price: "$1.20", stock: 80 },
        { id: 4, name: "Eggs", category: "Dairy", price: "$3.00", stock: 60 },
        { id: 5, name: "Tomatoes", category: "Vegetables", price: "$1.80", stock: 200 },
        { id: 6, name: "Chicken Breast", category: "Meat", price: "$5.50", stock: 40 }
    ];

    const productsTableBody = document.querySelector("#productsTable tbody");

    // Function to populate the table with product data
    function loadProducts() {
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
            `;
            productsTableBody.appendChild(row);
        });
    }

    // Load the products into the table on page load
    loadProducts();
});