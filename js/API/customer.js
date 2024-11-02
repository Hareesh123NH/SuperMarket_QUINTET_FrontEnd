document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".nav-link");
    var divtable = document.querySelector(".tablediv");


    const iframe = document.getElementById("otherPage");

    iframe.onload = () => {

        const products = iframe.contentDocument.getElementById("products");
        const orders = iframe.contentDocument.getElementById("orders");
        const cart = iframe.contentDocument.getElementById("cart");


        links.forEach((link) => {

            link.addEventListener("click", (e) => {

                divtable.innerHTML = '';
                const btn = e.target.innerText;

                if (btn === "Products") {
                    divtable.innerHTML = products.innerHTML;
                    const temp = document.createElement("div");
                    temp.innerHTML = products.innerHTML;

                    const tbody = document.getElementById("table");

                    fetchProducts(tbody);

                }
                else if (btn === "Orders") {
                    divtable.innerHTML = orders.innerHTML;
                    const temp = document.createElement("div");
                    temp.innerHTML = orders.innerHTML;

                    const tbody = document.getElementById("table");

                    fetchOrders(tbody);
                }
                else if (btn === "Cart") {
                    divtable.innerHTML = cart.innerHTML;
                    const temp = document.createElement("div");
                    temp.innerHTML = cart.innerHTML;

                    const tbody = document.getElementById("table");

                    fetchCart(tbody);
                }
            });
        });

        divtable.innerHTML = products.innerHTML;
        const temp = document.createElement("div");
        temp.innerHTML = products.innerHTML;

        const tbody = document.getElementById("table");
        fetchProducts(tbody);
    };


});


function fetchProducts(tbody) {
    // Retrieve credentials from session storage
    const auth = sessionStorage.getItem("auth");


    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }
    // console.log(auth);

    fetch('http://localhost:8080/user/getProducts', {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        })
        .then(data => displayProducts(data, tbody))
        .catch(error => console.error("Error fetching products:", error));
}


function fetchCart(tbody) {
    const auth = sessionStorage.getItem("auth");
    const userId = sessionStorage.getItem("userId");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }
    // console.log(userId);

    fetch(`http://localhost:8080/user/cart/${userId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        })
        .then(data => displayCart(data, tbody))
        .catch(error => console.error("Error fetching products:", error));
}

function fetchOrders(tbody) {
    const auth = sessionStorage.getItem("auth");
    const userId = sessionStorage.getItem("userId");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/user/orders/${userId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        })
        .then(data => displayOrders(data, tbody))
        .catch(error => console.error("Error fetching orders:", error));
}

function displayProducts(products, tbody) {

    tbody.innerHTML = ''; // Clear the table

    products.forEach((product, index) => {

        const row = `
            <tr>
                <td scope="row">${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td><button class="btn add-to-cart" data-product-id="${product.id}">AddToCart</button>
                    <button class="btn buy-product" data-product-id="${product.id}" data-product-price="${product.price}" 
                        data-product-quantity="${product.quantity}">Buy</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function displayCart(cartItems, tbody) {
    tbody.innerHTML = '';
    cartItems.forEach((cart) => {
        // console.log(cart.product);
        const item = cart.product;
        const row = `
        <tr>
            <td scope="row">${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
            <td><button class="btn remove-product" data-product-id="${item.id}">Remove</button>
                <button class="btn buy-product" data-product-id="${item.id}" data-product-price="${item.price}"
                     data-product-quantity="${item.quantity}">Buy</button></td>
        </tr>
    `;
        tbody.innerHTML += row;
    })
}

export function displayOrders(orders, tbody) {
    // Implement similar logic as displayProducts to show orders
    // console.log(orders);
    tbody.innerHTML = '';
    orders.forEach((order) => {
        const item = order.product;
        const isPending = order.orderStatus.toLowerCase() === "pending"; // Check if status is "Pending"

        const row = `
            <tr>
                <td scope="row">${item.name}</td>
                <td>${item.category}</td>
                <td>${parseInt(order.price / item.price, 10)}</td>
                <td>${order.price}</td>
                <td>${order.orderStatus}</td>
                <td><button class="btn cancel-order" ${isPending ? "" : "disabled"} data-product-id="${order.id}">Cancel</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    })
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const productId = e.target.getAttribute("data-product-id");
        const userId = sessionStorage.getItem("userId"); // Ensure the user ID is stored in sessionStorage

        if (userId && productId) {
            addToCart(userId, productId);
        } else {
            console.error("User ID or Product ID is missing.");
        }
    }
    if (e.target.classList.contains("remove-product")) {
        const productId = e.target.getAttribute("data-product-id");
        const userId = sessionStorage.getItem("userId"); // Ensure the user ID is stored in sessionStorage

        if (userId && productId) {
            removeFromCart(userId, productId);
        } else {
            console.error("User ID or Product ID is missing.");
        }
    }

    if (e.target.classList.contains("buy-product")) {
        const productId = e.target.getAttribute("data-product-id");
        const userId = sessionStorage.getItem("userId"); // Ensure the user ID is stored in sessionStorage
        let price = e.target.getAttribute("data-product-price");

        const count =parseInt(prompt("How many Quantities you want:"));

        let quantity = e.target.getAttribute("data-product-quantity");
        if(quantity<count){
            alert("sorry we have only "+quantity+" quantities");
            console.error("Dont have that much of quantity");
            return;
        }
        price = price * count;
        if (userId && productId && price) {
            addToOrders(userId, productId, price);
        } else {
            console.error("User ID or Product ID is missing.");
        }
    }

    if (e.target.classList.contains("cancel-order")) {
        const orderId = e.target.getAttribute("data-product-id");

        if (orderId) {
            cancelOrder(orderId);
        } else {
            console.error("User ID or Product ID is missing.");
        }
    }


});


function addToCart(userId, productId) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/user/addTocart/${userId}&${productId}`, {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.status == 400) {
                alert("Already In cart!");
                throw new Error("Alreay found in cart");
            }
            if (!response.ok) throw new Error("Failed to add product to cart");
        })
        .then(data => {
            console.log("Product added to cart:", data);
            // Optionally, update the cart UI here if needed
        })
        .catch(error => console.error("Error adding product to cart:", error));
}

function removeFromCart(userId, productId) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/user/removeFromCart/${userId}&${productId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to remove product from cart");
        })
        .then(data => {
            console.log("Remove From Cart", data);
            // Optionally, update the cart UI here if needed
            const divtable = document.querySelector(".tablediv");
            const tbody = document.getElementById("table");
            // console.log(divtable);
            // console.log(tbody);
            fetchCart(tbody);
        })
        .catch(error => console.error("Error adding product to cart:", error));
}

function addToOrders(userId, productId, price) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/user/addToOrders/${userId}&${productId}&${price}`, {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to Buy product");
        })
        .then(data => {
            console.log("Buy Product Successfully", data);
            // Optionally, update the cart UI here if needed
            const divtable = document.querySelector(".tablediv");

            const iframe = document.getElementById("otherPage");
            const orders = iframe.contentDocument.getElementById("orders");
            
            divtable.innerHTML = orders.innerHTML;
            const temp = document.createElement("div");
            temp.innerHTML = orders.innerHTML;

            const tbody = document.getElementById("table");
            fetchOrders(tbody);
        })
        .catch(error => console.error("Error adding product to cart:", error));
}

function cancelOrder(orderId) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/user/cancelOrder/${orderId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to cancel Order");
        })
        .then(data => {
            console.log("Cancel Order successfully", data);
            const divtable = document.querySelector(".tablediv");
            const tbody = document.getElementById("table");
            fetchOrders(tbody);
        })
        .catch(error => console.error("Error cancel the Order", error));
}
