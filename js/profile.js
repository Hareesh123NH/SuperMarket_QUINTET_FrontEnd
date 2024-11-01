// Function to enable editing of profile fields
function editProfile() {
    // Make input fields editable
    document.getElementById("name").readOnly = false;
    document.getElementById("mobile").readOnly = false;
    document.getElementById("email").readOnly = false;
    
    // Show the Update button and hide the Edit button
    document.getElementById("edit-button").style.display = "none";
    document.getElementById("update-button").style.display = "inline-block";
}

// Function to handle form submission and update profile
document.getElementById("profile-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Make input fields read-only again
    document.getElementById("name").readOnly = true;
    document.getElementById("mobile").readOnly = true;
    document.getElementById("email").readOnly = true;
    
    // Hide the Update button and show the Edit button
    document.getElementById("edit-button").style.display = "inline-block";
    document.getElementById("update-button").style.display = "none";
    
    // Display a confirmation message (optional)
    alert("Profile information has been updated successfully!");
});
