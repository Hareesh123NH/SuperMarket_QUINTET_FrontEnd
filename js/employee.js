document.addEventListener("DOMContentLoaded", function () {
    const productTable = document.getElementById("product-table");
    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("category");

    // Default products
    let products = [
        { name: 'Headphones', category: 'Electronics', price: 49.99, quantity: 100 },
        { name: 'Apple', category: 'Groceries', price: 0.99, quantity: 250 },
        { name: 'T-shirt', category: 'Clothing', price: 15.00, quantity: 150 },
        { name: 'Chair', category: 'Furniture', price: 35.99, quantity: 75 },
        { name: 'Toy Car', category: 'Toys', price: 10.49, quantity: 200 },
        { name: 'Smartphone', category: 'Electronics', price: 199.99, quantity: 50 },
        { name: 'Milk', category: 'Groceries', price: 1.25, quantity: 300 },
        { name: 'Jeans', category: 'Clothing', price: 39.99, quantity: 100 },
        { name: 'Table', category: 'Furniture', price: 89.99, quantity: 20 },
        { name: 'Puzzle', category: 'Toys', price: 5.99, quantity: 150 }
    ];

    // Load additional products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    products = products.concat(storedProducts);

    function displayProducts(products) {
        productTable.innerHTML = "";
        products.forEach((product, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td><button onclick="updateProduct(${index})">Update</button></td>
            `;

            productTable.appendChild(row);
        });
    }

    function filterProducts() {
        const searchValue = searchInput.value.toLowerCase();
        const categoryValue = categorySelect.value;
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchValue);
            const matchesCategory = categoryValue === "" || product.category === categoryValue;
            return matchesSearch && matchesCategory;
        });
        displayProducts(filteredProducts);
    }

    searchInput.addEventListener("input", filterProducts);
    categorySelect.addEventListener("change", filterProducts);

    window.updateProduct = function (index) {
        const quantity = prompt("Enter new quantity:");
        if (quantity !== null) {
            products[index].quantity = parseInt(quantity, 10);
            alert("Updated Successfully");
            filterProducts();
        }
    };

    displayProducts(products);
});
