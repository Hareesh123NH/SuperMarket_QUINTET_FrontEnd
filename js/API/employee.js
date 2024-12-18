

function auth() {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        // console.error("No authorization token found in session storage.");
        window.location.href = "http://127.0.0.1:5500/index.html";
        return;
    }

    fetch(`http://localhost:8080/emp/name`, {
        method: 'GET',
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
        },
    })
        .then(response => {
            if (response.status == 403) {
                window.location.href = "http://127.0.0.1:5500/index.html";
                return;
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


const links = document.querySelectorAll(".nav-link");
var divtable = document.querySelector(".tablediv");
const message = document.getElementById("logout-message");
const userProfileDetails = document.getElementById("profile-detail");

const iframe = document.getElementById("otherPage");

iframe.onload = () => {

    const allProducts = iframe.contentDocument.getElementById("allProducts");
    const register = iframe.contentDocument.getElementById("register");
    const bills = iframe.contentDocument.getElementById("bills");

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            divtable.innerHTML = '';
            const btn = e.target.innerText;
            const temp = document.createElement("div");

            if (btn === "All Products") {
                divtable.innerHTML = allProducts.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllProducts(tbody);
                searchProducts(tbody);
            }
            else if (btn === "Profile") {
                // fetchProfile();
                const details = sessionStorage.getItem("details");
                // console.log(details);
                setUserValues(details);
                divtable.innerHTML = userProfileDetails.innerHTML;
            }
            else if (btn === "Logout") {
                // console.log(btn);
                divtable.innerHTML = message.innerHTML;
                logout(e.target);
            }

            else if (btn === "Add Product") {
                divtable.innerHTML = register.innerHTML;
                const tbody = document.getElementById("table");
                // fetchOrders(tbody);
            }

            else if (btn === "Bills") {
                divtable.innerHTML = bills.innerHTML;
                const tbody = document.getElementById("table");
                fetchBills(tbody);
                searchBills(tbody);
            }
        });
    });

    divtable.innerHTML = allProducts.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = allProducts.innerHTML;
    const tbody = document.getElementById("table");
    // console.log(tbody);
    fetchAllProducts(tbody);
    searchProducts(tbody);
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

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
        const productData = e.target.getAttribute("data-product");
        const form = document.querySelector(".hiddenForm");
        const product = JSON.parse(productData);

        form.style.display = "block";

        document.getElementById("productId").value = product.id;
        document.getElementById("productname").value = product.name;
        document.getElementById("category").value = product.category;

        const quantity = document.getElementById("quantity")
        quantity.value = product.quantity;

        quantity.setAttribute("min", product.quantity);
        document.getElementById("price").value = product.price;

    }
    if (e.target.classList.contains("cancel")) {
        const form = document.querySelector(".hiddenForm");
        form.style.display = "none";
    }

    if (e.target.classList.contains("done-bill")) {
        const billdiv = document.getElementById("viewBill");
        billdiv.style.display = "none";
    }


    if (e.target.classList.contains("view-bill")) {

        const billData = e.target.getAttribute("data-bill");
        const billdiv = document.getElementById("viewBill");
        const bill = JSON.parse(billData);
        e.target.innerText="Viewed";

        billdiv.style.display = "block";

        const billItemsContainer = document.getElementById("billItems");
        billItemsContainer.innerHTML = ""; // Clear any existing rows
        
        const products=bill.billProducts;
    
        products.forEach((product, index) => {
    
            const row = document.createElement("tr");
            row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.pName}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>${product.unitPrice}</td>
                    <td>${product.productPrice.toFixed(2)}</td>
                `;
            billItemsContainer.appendChild(row);
        });

        document.getElementById("billCustomerName").innerText = bill.customerName;
        document.getElementById("transactionId").innerText = bill.transactionId;
        document.getElementById("totalPrice").innerText = bill.totalPrice.toFixed(2);
        document.getElementById("gstAmount").innerText = bill.gstAmount;
        document.getElementById("payableAmount").innerText = bill.payableAmount;
        document.getElementById("billContainer").style.display = "block";
    }


});


function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission
    // Get form values
    const name = document.getElementById("productname").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    // Create the request body
    const data = {
        name,
        category,
        quantity,
        price
    };

    // Make the POST request to /manager/register/{roleId}
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/emp/saveProduct`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"

        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to Add Product");
            }
        })
        .then(data => {
            console.log(data);
            alert("New Product Added successful!");
            document.getElementById("userForm").reset();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error adding new product.");
        });
}

function fetchAllProducts(tbody) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/emp/allProducts', {
        method: "GET",
        headers: {
            "Authorization": `Basic ${auth}`,
            'Content-Type': "application/json"
        },
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to get Products");
            return res.json();
        })
        .then((data) => {
            displayProducts(data, tbody);
        })
        .catch(error => console.error("Error Fetching products", error));

}

function searchProducts(tbody){

    const input=document.getElementById("search");
    input.addEventListener("input",(e)=>{
        const search=e.target.value;
        // const products=JSON.parse("[]");  
        if(search.length!==0){
            // console.log(search);
            fetchSearchProducts(tbody,search);
        }
        else{
            fetchAllProducts(tbody);
        }
    });
}

function searchBills(tbody){

    const input=document.getElementById("search");
    input.addEventListener("input",(e)=>{
        const search=e.target.value;
        // const products=JSON.parse("[]");  
        if(search.length!==0){
            // console.log(search);
            fetchSearchBills(tbody,search);
        }
        else{
            fetchBills(tbody);
        }
    });
}

function fetchSearchProducts(tbody,search) {
    // Retrieve credentials from session storage
    const auth = sessionStorage.getItem("auth");


    if (!auth) {
        console.error("No authorization token found in session storage.")
        window.location.href="http://127.0.0.1:5500/index.html";
        return;
    }
    // console.log(auth);


    fetch(`http://localhost:8080/emp/searchProducts/${search}`, {
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

function fetchSearchBills(tbody,search) {
    // Retrieve credentials from session storage
    const auth = sessionStorage.getItem("auth");


    if (!auth) {
        console.error("No authorization token found in session storage.")
        window.location.href="http://127.0.0.1:5500/index.html";
        return;
    }
    // console.log(auth);


    fetch(`http://localhost:8080/emp/searchBills/${search}`, {
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
        .then(data => displayBills(data, tbody))
        .catch(error => console.error("Error fetching products:", error));
}

function displayProducts(products, tbody) {
    tbody.innerHTML = '';

    products.forEach(product => {

        const productData = JSON.stringify(product);
        const row = `
            <tr>
                <td scope="row">${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td><button class="update" data-product='${productData.replace(/'/g, "\\'")}'>Update</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
        // <button class="btn remove" data-product-id='${product.id}' data-product-name='${product.name}' data-product-quantity='${product.quantity}'>Remove</button>
    })
}


function handleUpdate(event) {
    event.preventDefault(); // Prevents default form submission
    // Get form values
    const productId = document.getElementById("productId").value;
    const name = document.getElementById("productname").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("quantity").value;
    const price = document.getElementById("price").value;

    // Create the request body
    const data = {
        name,
        category,
        quantity,
        price
    };

    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/emp/updateProduct/${productId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"

        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to Update user");
            }
        })
        .then(data => {
            console.log(data);
            alert("Update Product successful!");
            const form = document.querySelector(".hiddenForm");
            form.style.display = "none";

            const tbody = document.getElementById("table");
            fetchAllProducts(tbody);

        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error Updating the Product.");
        });
}

function fetchRemoveProduct(productId, pname) {
    const auth = sessionStorage.getItem("auth");

    // console.log(typeof(productId))
    const id = parseInt(productId);

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/emp/removeProduct/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"

        },
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // or response.text() if expecting text
            } else {
                throw new Error("Failed to Delete Product");
            }
        })
        .then(data => {
            console.log(data);
            alert(`${pname} was removed successfully!`);

            const tbody = document.getElementById("table");
            fetchAllProducts(tbody);

        })
        .catch(error => {
            console.error("Error:", error);
            alert("There was an error Removing the Product.");
        });
}

function fetchBills(tbody) {
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/emp/allBills', {
        method: "GET",
        headers: {
            "Authorization": `Basic ${auth}`,
            'Content-Type': "application/json"
        },
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to get Bills");
            return res.json();
        })
        .then((data) => {
            displayBills(data, tbody);
        })
        .catch(error => console.error("Error Fetching Bills", error));
}

function displayBills(bills, tbody) {
    tbody.innerHTML = '';
    bills.sort((a,b)=>b.id-a.id);

    bills.forEach((bill) => {

        const billData = JSON.stringify(bill);
        const row = `
            <tr>
                <td scope="row">${bill.customerName}</td>
                <td>${bill.transactionId}</td>
                <td>${bill.totalPrice}</td>
                <td>${bill.gstAmount}</td>
                <td>${bill.payableAmount}</td>
                <td><button class="view-bill" data-bill='${billData.replace(/'/g, "\\'")}'>View Bill</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
        // <button class="btn remove" data-product-id='${product.id}' data-product-name='${product.name}' data-product-quantity='${product.quantity}'>Remove</button>
    })
}

function printBill() {
    const billContent = document.getElementById("billContainer").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = billContent;
    window.print();
    document.body.innerHTML = originalContent;
}


