const links = document.querySelectorAll(".nav-link");
var divtable = document.querySelector(".tablediv");

const userProfileDetails= document.getElementById("profile-detail");
const iframe = document.getElementById("otherPage");
const message= document.getElementById("logout-message");

function auth(){
    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        window.location.href="http://127.0.0.1:5500/index.html";
        return;
    }

    fetch(`http://localhost:8080/manager/name`, {
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
    let countdown = 5; // Start countdown at 5 seconds
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

iframe.onload = () => {

    const allorders=iframe.contentDocument.getElementById("allOrders");
    const clerks = iframe.contentDocument.getElementById("clerks");
    const emps = iframe.contentDocument.getElementById("emps");
    const register = iframe.contentDocument.getElementById("register");  

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            divtable.innerHTML = '';
            const btn = e.target.innerText;
            const temp = document.createElement("div");

            // console.log(btn);

            if (btn === "All Orders") {
                divtable.innerHTML = allorders.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllOrders(tbody);

            }
            else if (btn === "Clerks") {
                divtable.innerHTML = clerks.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllClerks(tbody);
            }
            else if (btn === "Employees") {
                divtable.innerHTML = emps.innerHTML;
                const tbody = document.getElementById("table");
                fetchAllEmps(tbody);
            }

            else if(btn==="Register"){
                divtable.innerHTML=register.innerHTML;
                const tbody = document.getElementById("table");
                // fetchOrders(tbody);
            }
            else if (btn === "Profile") {
                // fetchProfile();
                const details=sessionStorage.getItem("details");
                // console.log(details);
                setUserValues(details);
                divtable.innerHTML = userProfileDetails.innerHTML;
            }

            else if(btn==="Logout"){
                divtable.innerHTML=message.innerHTML;
                logout(e.target);
            }
        });
    });

    divtable.innerHTML = allorders.innerHTML;
    const temp = document.createElement("div");
    temp.innerHTML = allorders.innerHTML;
    const tbody = document.getElementById("table");
    // console.log(tbody);
    fetchAllOrders(tbody);

}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
        const userData = e.target.getAttribute("data-worker");
        const form=document.querySelector(".hiddenForm");
        const user=JSON.parse(userData);

        form.style.display="block";

        document.getElementById("profileId").value=user.id;
        document.getElementById("fullName").value = user.fullName;
        document.getElementById("phoneNumber").value = user.phoneNumber;
        document.getElementById("email").value = user.email;
        document.getElementById("address").value = user.address;

    }
    if(e.target.classList.contains("cancel")){
        const form=document.querySelector(".hiddenForm");
        form.style.display="none";
    }

    if(e.target.classList.contains("remove")){
        const fullName=e.target.getAttribute("data-worker-name");
        const isOk=confirm(`Do you really want remove ${fullName}!`);
        const profileId=e.target.getAttribute("data-worker-id");
        console.log(isOk);
        if(isOk){
            fetchRemove(profileId,fullName);
        }
    }


});

function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission
    // Get form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const roleId = parseInt(document.querySelector('input[name="roleId"]:checked').value);

    // Create the request body
    const data = {
        username,
        password,
        fullName,
        phoneNumber,
        email,
        address
    };

    // Make the POST request to /manager/register/{roleId}
    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/manager/register/${roleId}`, {
        method: "POST",
        headers: {
            "Authorization":`Basic ${auth}`,
            "Content-Type": "application/json"

        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // or response.text() if expecting text
        } else {
            throw new Error("Failed to register user");
        }
    })
    .then(data => {
        console.log(data);
        alert("Registration successful!");
        document.getElementById("userForm").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error registering the user.");
    });
}

function handleUpdate(event) {
    event.preventDefault(); // Prevents default form submission
    // Get form values
    const profileId=parseInt(document.getElementById("profileId").value);
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    // Create the request body
    const data = {

        fullName,
        phoneNumber,
        email,
        address
    };
    // console.log(profileId);
    // console.log(data);

    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/manager/update/${profileId}`, {
        method: "PUT",
        headers: {
            "Authorization":`Basic ${auth}`,
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
        alert("Update User successful!");
        document.getElementById("userForm").reset();
        const form=document.querySelector(".hiddenForm");
        form.style.display="none";

        // console.log(divtable.firstElementChild.textContent);
        const text=divtable.firstElementChild.textContent;
        if(text==="All Clerks"){
            const tbody = document.getElementById("table");
            fetchAllClerks(tbody);
        }
        if(text==="All Emps"){
            const tbody = document.getElementById("table");
            fetchAllEmps(tbody);
        }
    
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error Updating the user.");
    });
}

function fetchAllOrders(tbody) {

    const auth = sessionStorage.getItem("auth");

    if (!auth) {
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/allorders',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            'Content-Type':"application/json"
        },
    })
    .then(res=>{
        if(!res.ok) throw new Error("Failed to get Orders");
        return res.json();
    })
    .then((data)=>{
        displayOrders(data,tbody);
    })
    .catch(error=>console.error("Error Fetching orders",error));

    
}


function displayOrders(orders,tbody){

    tbody.innerHTML = '';
    sorting(orders);

    orders.forEach((order) => {
        const item = order.product;
        const user=order.user;
        const row = `
            <tr>
                <td scope="row">${user.userProfile.fullName}</td>
                <td>${user.userProfile.phoneNumber}</td>
                <td>${item.name}</td>
                <td>${parseInt(order.price / item.price, 10)}</td>
                <td>${order.price}</td>
            </tr>
        `;
        tbody.innerHTML += row;
        // console.log(order);
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

function fetchAllClerks(tbody) {

    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/getClerks',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Content-Type":"application/json"
        },
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("Failed to get Clerks");
        }
        return res.json();
    })
    .then(data=>{
        displayWorkers(data,tbody);
    })
    .catch(err=>console.error("Error Fetching clerks"));
    
}

function fetchAllEmps(tbody) {

    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch('http://localhost:8080/manager/getEmps',{
        method:"GET",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Content-Type":"application/json"
        },
    })
    .then((res)=>{
        if(!res.ok){
            throw new Error("Failed to get Clerks");
        }
        return res.json();
    })
    .then(data=>{
        displayWorkers(data,tbody);
    })
    .catch(err=>console.error("Error Fetching clerks"));
    
}

function displayWorkers(workers,tbody){

    tbody.innerHTML='';

    workers.forEach(worker=>{
        // console.log(worker);
        const user=worker.userProfile;
        const userData=JSON.stringify(user);
        const row = `
            <tr>
                <td scope="row">${user.fullName}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td><button class="btn update" data-worker='${userData.replace(/'/g, "\\'")}'>Update</button>
                    <button class="btn remove" data-worker-id='${user.id}' data-worker-name='${user.fullName}'>Remove</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    })
}

function fetchRemove(profileId,fullName){
    const auth=sessionStorage.getItem("auth");

    if(!auth){
        console.error("No authorization token found in session storage.");
        return;
    }

    fetch(`http://localhost:8080/manager/remove/${profileId}`, {
        method: "DELETE",
        headers: {
            "Authorization":`Basic ${auth}`,
            "Content-Type": "application/json"

        },
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // or response.text() if expecting text
        } else {
            throw new Error("Failed to Delete user");
        }
    })
    .then(data => {
        console.log(data);
        alert(`${fullName} was removed successfully!`);

        // console.log(divtable.firstElementChild.textContent);
        const text=divtable.firstElementChild.textContent;
        if(text==="All Clerks"){
            const tbody = document.getElementById("table");
            fetchAllClerks(tbody);
        }
        if(text==="All Emps"){
            const tbody = document.getElementById("table");
            fetchAllEmps(tbody);
        }
    
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error Removing the user.");
    });
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