document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".nav-link");
    var divtable = document.querySelector(".tablediv");
    const message= document.getElementById("logout-message");
    const userProfileDetails= document.getElementById("profile-detail");

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
                    searchProducts(tbody);

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
                else if(btn==="Logout"){
                    divtable.innerHTML=message.innerHTML;
                    logout(e.target);
                }
                else if (btn === "Profile") {
                    // fetchProfile();
                    const details=sessionStorage.getItem("details");
                    // console.log(details);
                    setUserValues(details);
                    divtable.innerHTML = userProfileDetails.innerHTML;
                }
            });
        });

        divtable.innerHTML = products.innerHTML;
        const temp = document.createElement("div");
        temp.innerHTML = products.innerHTML;

        const tbody = document.getElementById("table");
        fetchProducts(tbody);
        searchProducts(tbody);
    };


});


function auth(){
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        // console.error("No authorization token found in session storage.");
        window.location.href="http://127.0.0.1:5500/index.html";
        return;
    }

    fetch(`http://localhost:8080/user/name`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if(response.status==403){
                window.location.href="http://127.0.0.1:5500/index.html";
                return ;
            }
            if (!response.ok) throw new Error("Failed to Authentication");
            return response.text();
        })
        .then(data => console.log(data))
        .catch(error => console.error("Error to Authentication", error));
    
    
}
auth();

function logout(logoutButton) {
    let countdown = 3; // Start countdown at 5 seconds
    // const logoutButton = document.getElementById("logoutButton");
    logoutButton.disabled = true; // Disable the logout button

    // Update button text with countdown
    const intervalId = setInterval(() => {
        logoutButton.textContent = `Logging out in ${countdown} seconds...`;
        countdown--;

        if (countdown < 0) {
            clearInterval(intervalId); // Stop the interval

            // Clear session storage and redirect to index.html
            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("userId");
            window.location.href = 'http://127.0.0.1:5500/index.html';
        }
    }, 1000); // Update every second
}

function fetchProducts(tbody) {
    // Retrieve credentials from session storage
    const auth = sessionStorage.getItem("auth");


    if (!auth) {
        console.error("No authorization token found in session storage.")
        window.location.href="http://127.0.0.1:5500/index.html";
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
            if(response.status==403){
                window.location.href="http://127.0.0.1:5500/index.html";
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        })
        .then(data => displayProducts(data, tbody))
        .catch(error => console.error("Error fetching products:", error));
}

function fetchSearch(tbody,search) {
    // Retrieve credentials from session storage
    const auth = sessionStorage.getItem("auth");


    if (!auth) {
        console.error("No authorization token found in session storage.")
        window.location.href="http://127.0.0.1:5500/index.html";
        return;
    }
    // console.log(auth);


    fetch(`http://localhost:8080/user/searchProducts/${search}`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if(response.status==403){
                window.location.href="http://127.0.0.1:5500/index.html";
                return;
            }
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

function searchProducts(tbody){

    const input=document.getElementById("search");
    input.addEventListener("input",(e)=>{
        const search=e.target.value;
        // const products=JSON.parse("[]");  
        if(search.length!==0){
            // console.log(search);
            fetchSearch(tbody,search);
        }
        else{
            fetchProducts(tbody);
        }
    });
}

function displayProducts(products, tbody) {

    tbody.innerHTML = ''; 
    const err=document.getElementById("not");

    if(products.length===0){
        err.style.display="block";

        return;
    }
    else{
        err.style.display="none";
    }
    
    // Clear the table

    products.forEach((product, index) => {

        const row = `
            <tr>
                <td scope="row">${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td><button class="add-to-cart" data-product-id="${product.id}">AddToCart</button>
                    <button class="buy-product" data-product-id="${product.id}" data-product-price="${product.price}" 
                        data-product-quantity="${product.quantity}">Buy</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function displayCart(cartItems, tbody) {
    const err=document.getElementById("not");
    if(cartItems.length===0){
         err.style.display="block";
    }
    else{
        err.style.display="none";
    }

    tbody.innerHTML = '';
    cartItems.forEach((cart) => {
        // console.log(cart.product);
        const item = cart.product;
        const row = `
        <tr>
            <td scope="row">${item.name}</td>
            <td>${item.category}</td>
            <td>${item.price}</td>
            <td><button class="remove-product" data-product-id="${item.id}">Remove</button>
                <button class="buy-product" data-product-id="${item.id}" data-product-price="${item.price}"
                     data-product-quantity="${item.quantity}">Buy</button></td>
        </tr>
    `;
        tbody.innerHTML += row;
    })
}

function displayOrders(orders, tbody) {
    const err=document.getElementById("not");
    if(orders.length===0){
         err.style.display="block";
        return;
    }
    else{
        err.style.display="none";
    }


    tbody.innerHTML = '';
    sorting(orders);
    orders.forEach((order) => {
        const item = order.product;
        const isPending = order.orderStatus.toLowerCase() === "pending"; // Check if status is "Pending"

        const row = `
            <tr>
                <td scope="row">${item.name}</td>
                <td>${item.category}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
                <td>${order.orderStatus}</td>
                <td> ${isPending ? `<button class="cancel-order" data-product-id="${order.id}">Cancel</button>` : `<i>None</i>`} </td>
            </tr>
        `;
        tbody.innerHTML += row;
    })
}
function sorting(orders){

    orders.sort((a, b) => {
        if (a.orderStatus === "Pending" && b.orderStatus !== "Pending") {
            return -1; // a comes before b
        }
        if (a.orderStatus !== "Pending" && b.orderStatus === "Pending") {
            return 1; // b comes before a
        }
        return b.id - a.id;
    });
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
        console.log(price);
        if (userId && productId && count) {
            addToOrders(userId, productId, count);
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

// function handleSearchChange(event) {
//     console.log("Search input changed:", event.target.value);
//     // Add your custom logic here
// }

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
            alert("Product added to cart Successfully");
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

function addToOrders(userId, productId, count) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }
    console.log(typeof(count));
    fetch(`http://localhost:8080/user/addToOrders/${userId}&${productId}&${count}`, {
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

function setUserValues(userString) {
    // Regular expressions to extract values
    const userIdMatch = userString.match(/id=(\d+)/);
    const usernameMatch = userString.match(/username='([^']+)'/);
    const fullNameMatch = userString.match(/fullName='([^']+)'/);
    const phoneNumberMatch = userString.match(/phoneNumber='([^']+)'/);
    const addressMatch = userString.match(/Address='([^']+)'/);
    const emailMatch = userString.match(/email='([^']+)'/);

    // Extract values using the matches
    const userId = userIdMatch ? userIdMatch[1] : null;
    const username = usernameMatch ? usernameMatch[1] : null;
    const fullName = fullNameMatch ? fullNameMatch[1] : null;
    const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1] : null;
    const address = addressMatch ? addressMatch[1] : null;
    const email = emailMatch ? emailMatch[1] : null;

    // Set the values in the HTML elements
    document.getElementById("fullName").textContent = fullName;
    document.getElementById("phoneNumber").textContent = phoneNumber;
    document.getElementById("address").textContent = address;
    document.getElementById("email").textContent = email;
    document.getElementById("username").textContent = username;
}
