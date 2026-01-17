// Display back to top button based on page height and viewport height
function toggleBackToTop() {
    const pageHeight = $(document).height();
    const viewportHeight = $(window).height();

    if (pageHeight > viewportHeight) {
        $("#backToTopBtnPlaceholder").removeClass("d-none");
    }

    if (pageHeight <= viewportHeight) {
        $("#backToTopBtnPlaceholder").addClass("d-none");
    }
}

// Function to scroll to target with target at center of the screen
function scrollToTargetCenter(target) {
    const targetPosition = target.offset().top;
    const windowHeight = $(window).height();
    const scrollPosition = targetPosition - (windowHeight / 2) + (target.outerHeight() / 2);

    $("html, body").animate({
        scrollTop: scrollPosition
    }, 50)
}

// Function to add border to targeted text for 1 second
function addBorderTemporarily(target) {
    target.addClass("border-danger");

    setTimeout(() => {
        target.removeClass("border-danger");
    }, 2000);
}

$(document).ready(function () {
    // Load navbar to every HTML file
    $("#navbarPlaceholder").load("navbar.html", function() {
        
        // Navbar login button click
        $("#navLoginBtn").on("click", function () {
            $("#loginModal").modal("show");
        });

        // Form login button click
        $("#formLoginBtn").on("click", function () {
            authManager.loginSubmit();
        });

        // Form login by enter
        $("#usernameInput, #passwordInput").on("keypress", function(e) {
            if (e.which === 13) {
                e.preventDefault();
                authManager.loginSubmit();
            }
        });

        // Navbar logout button click
        $("#navLogoutBtn").on("click", function () {
            authManager.logout();
        });

        // Reset login modal when closed
        $("#loginModal").on("hidden.bs.modal", function () {
            authManager.resetLoginModal();
        });

        // Always update navbar based on status
        authManager.updateNavbar();

        // Avoid navbar from covering content
        setTimeout(function() {
            const navbarHeight = $(".navbar").outerHeight();
            $("body").css("margin-top", navbarHeight + "px");
        }, 50);
        
        $(window).resize(function() {
            const navbarHeight = $(".navbar").outerHeight();
            $("body").css("margin-top", navbarHeight + "px");
        });

        // Load tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();
    });

    // Load back to top button
    $("#backToTopBtnPlaceholder").load("back-to-top.html", function() {
        // Toggle back to top button
        toggleBackToTop();

        // Back to top button onclick
        $(".back-to-top-btn").on("click", function() {
            $("html, body").animate({
                scrollTop: 20
            }, 50);
        });
    })   
});