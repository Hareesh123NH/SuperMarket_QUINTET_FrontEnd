// Sample product data
const products = [
    { name: "Laptop", price: 999.99, category: "electronics" },
    { name: "Smartphone", price: 699.99, category: "electronics" },
    { name: "Television", price: 499.99, category: "electronics" },
    { name: "Apple", price: 0.99, category: "groceries" },
    { name: "Banana", price: 0.59, category: "groceries" },
    { name: "Milk", price: 2.99, category: "groceries" },
    { name: "T-shirt", price: 19.99, category: "clothing" },
    { name: "Jeans", price: 49.99, category: "clothing" },
    { name: "Jacket", price: 79.99, category: "clothing" },
];

// Array to hold cart items
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to display all products by default
function displayProducts() {
    const productsBody = document.getElementById("products-body");
    productsBody.innerHTML = ""; // Clear previous products

    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                <button class="place-order" onclick="placeOrder('${product.name}', 1)">Place Order</button>
            </td>
        `;
        productsBody.appendChild(row);
    });
}

// Function to filter and display products based on category selection
function filterProducts() {
    const category = document.getElementById("category-select").value;
    const productsBody = document.getElementById("products-body");
    
    productsBody.innerHTML = ""; // Clear previous products

    const filteredProducts = products.filter(product => {
        return category === "" || product.category === category;
    });

    filteredProducts.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                <button class="place-order" onclick="placeOrder('${product.name}', 1)">Place Order</button>
            </td>
        `;
        productsBody.appendChild(row);
    });
}

// Optional: Function to search products
function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const productsBody = document.getElementById("products-body");
    
    productsBody.innerHTML = ""; // Clear previous products

    const searchedProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query);
    });

    searchedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                <button class="place-order" onclick="placeOrder('${product.name}', 1)">Place Order</button>
            </td>
        `;
        productsBody.appendChild(row);
    });
}

// Function to handle adding an item to the cart
function addToCart(productName, productPrice) {
    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        alert(`${productName} is already in your cart!`);
    } else {
        // Add the new item to the cart
        cartItems.push({ name: productName, price: productPrice });
        localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Save to local storage
        alert(`${productName} has been added to your cart!`);
    }
}

// Function to handle placing an order
function placeOrder(productName, quantity) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = {
        productName: productName,
        quantity: quantity,
        price: products.find(p => p.name === productName).price,
        status: "Pending"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders)); // Save to local storage
    alert(`Order placed for ${productName}`);
}

// Initialize by displaying all products
displayProducts();
