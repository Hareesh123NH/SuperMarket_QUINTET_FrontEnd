// Function to load items from localStorage and display them in the cart
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartTableBody = document.getElementById("cart-table-body");
    
    cartTableBody.innerHTML = ""; // Clear existing items

    // If cart is empty, show a message
    if (cartItems.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="4">Your cart is empty.</td>`;
        cartTableBody.appendChild(emptyRow);
        return;
    }

    // Populate the cart table with items
    cartItems.forEach((item, index) => {
        const row = document.createElement("tr");
        row.id = `item-${index + 1}`; // Assign a unique ID for each row
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" id="quantity-${index + 1}" value="1" min="1"></td>
            <td>
                <button class="remove-btn" onclick="removeItem(${index + 1})">Remove</button>
                <button class="place-order-btn" onclick="placeOrder('${item.name}', document.getElementById('quantity-${index + 1}').value)">Place Order</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    updateTotal(); // Update the total price
}

// Function to search products within the table
function searchProduct() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const tableRows = document.getElementById("cart-table-body").getElementsByTagName("tr");

    for (let row of tableRows) {
        const productName = row.getElementsByTagName("td")[0].textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}

// Function to remove an item from the cart
function removeItem(itemId) {
    // Load existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // Remove the item from the array
    cartItems.splice(itemId - 1, 1);
    
    // Save the updated cart back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
    // Reload the cart items to display the updated cart
    loadCartItems();
}

// Function to calculate and update the total price
function updateTotal() {
    const tableRows = document.getElementById("cart-table-body").getElementsByTagName("tr");
    let total = 0;

    for (let row of tableRows) {
        const price = parseFloat(row.getElementsByTagName("td")[1].textContent.replace('$', ''));
        const quantity = row.getElementsByTagName("input")[0].value;
        total += price * quantity;
    }

    document.querySelector(".cart-summary p").innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
}

// Event listener to update total when quantity is changed
document.getElementById("cart-table-body").addEventListener("input", function(event) {
    if (event.target && event.target.tagName === "INPUT") {
        updateTotal();
    }
});

// Function to place an order and navigate to the orders page
function placeOrder(productName, quantity) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    const product = cartItems.find(item => item.name === productName);
    const order = {
        productName: productName,
        quantity: parseInt(quantity),
        price: product ? product.price * quantity : 0,
        status: "Pending"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders)); // Save to local storage

    // Optionally, remove the item from cart after ordering
    removeItem(cartItems.findIndex(item => item.name === productName) + 1);

    alert(`Order placed for ${productName} (Quantity: ${quantity})`);
    window.location.href = "orders.html"; // Redirects to the orders page
}

// Initialize the cart page by loading cart items from localStorage
loadCartItems();
