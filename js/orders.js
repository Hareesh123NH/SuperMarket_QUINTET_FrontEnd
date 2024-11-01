// Function to load orders from localStorage and display them in the orders table
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const ordersTableBody = document.getElementById("orders-table-body");

    ordersTableBody.innerHTML = ""; // Clear existing orders

    // If no orders, show a message
    if (orders.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="5">No orders found.</td>`;
        ordersTableBody.appendChild(emptyRow);
        return;
    }

    // Populate the orders table
    orders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.id = `order-${index + 1}`;
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>$${order.price.toFixed(2)}</td>
            <td>${order.status}</td>
            <td><button class="cancel-button" onclick="cancelOrder(${index + 1})">Cancel Order</button></td>
        `;
        ordersTableBody.appendChild(row);
    });
}

// Function to cancel an order
function cancelOrder(orderIndex) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.splice(orderIndex - 1, 1); // Remove the order
    localStorage.setItem("orders", JSON.stringify(orders)); // Update local storage
    loadOrders(); // Refresh the orders table
}

// Initialize the orders page by loading orders from localStorage
loadOrders();
