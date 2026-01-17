// Store User Details
let users = [
    {
        username: "Admin",
        password: "admin1234",
        permission: "admin"
    },
    {
        username: "John Doe",
        password: "john1234", 
        permission: "customer"
    },
    {
        username: "James",
        password: "james1234",
        permission: "customer"
    },
    {
        username: "Sophia",
        password: "sophia1234",
        permission: "customer"
    }
]

const authManager = {
    // Login function
    login(username, password) {
        // Detect empty field
        if (!username || !password) {
            return {
                success: false,
                error: "Please fill in all fields."
            };
        }

        // Try to find user from users array
        const user = users.find(u =>
            u.username === username && u.password === password
        );

        if (user) {
            // Login success
            // Get current user details
            const currentUser = {
                username: user.username,
                permission: user.permission
            };

            // Save current user details to session storage
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

            // Return success and user details
            return {
                success: true,
                user: currentUser
            }
        } else {
            // Login fail
            // Return error 
            return {
                success: false,
                error: "Invalid username or password."
            };
        }
    },

    // Logout function
    logout() {
        // Confirm before logout
        if (confirm("Are you sure you want to logout?")) {
            // Clear session storage
            sessionStorage.removeItem("currentUser");

            // Redirect to home page 
            window.location.href = "index.html";
        }
    },

    // Update navbar (based on permission)
    updateNavbar() {
        // Get current user details (login?)
        const savedUser = sessionStorage.getItem("currentUser");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (user) {
            // User is login
            // Adjust navbar
            $("#usernameDisplay").text(user.username);
            $("#navLoginBtn").hide();
            $("#navLogoutBtn").show();

            // Show admin features for admin
            if (user.permission === "admin") {
                $("#adminFeatures").show();
            } else {
                $("#adminFeatures").hide();
            }
        } else {
            // User is logout
            // Reset navbar
            $("#adminFeatures").hide();
            $("#navLoginBtn").show();
            $("#navLogoutBtn").hide();
            $("#usernameDisplay").text("Guest");
        }
    },

    // Handle login form submit
    loginSubmit() {
        // Get user input 
        const username = $("#usernameInput").val().trim();
        const password = $("#passwordInput").val().trim();

        // Clear error message
        $("#loginError").hide();

        // Try to login with user input
        const loginResult = this.login(username, password);

        // Check login result
        if (loginResult.success) {
            // Login success
            // Update navbar
            this.updateNavbar();

            // Update modal
            $("#loginForm").hide();
            $("#welcomeMessage").show();
            $("#welcomeText").text(`Welcome back, ${loginResult.user.username}.`);
            $(".modal-footer").hide();
            $(".modal-title").text("Login Successfully!")

            // Close modal 
            setTimeout(() => {
                $("#loginModal").modal("hide");
            }, 3000);

            // Refresh page
            $("#loginModal").on("hidden.bs.modal", function() {
                location.reload();
            });

        } else {
            // Login fail
            $("#loginError").text(loginResult.error).show();
            $("#passwordInput").val("");
            $("#passwordInput").focus();
        }
    },

    // Reset login modal
    resetLoginModal () {
        // Clear inputs
        $("#usernameInput").val("");
        $("#passwordInput").val("");
        
        // Hide error message
        $("#loginError").hide();
        
        // Reset modal to login form state
        $("#loginForm").show();
        $("#welcomeMessage").hide();
        $(".modal-footer").show();
        $(".modal-title").text("Login");
    }
};

// Function to check permission is admin when in admin pages
function checkAdmin() {
    // Get current user details (login?)
    const savedUser = sessionStorage.getItem("currentUser");
    const user = savedUser ? JSON.parse(savedUser) : null;

    // If not admin, go back to home page
    if (user === null || user.permission !== "admin") {
        alert("You have no permission to view the page.");
        window.location.href = "index.html";
    }
}