$(document).ready(function() {

    // View services button
    $(".hero-btn1").on("click", function() {
        const targetSection = $("#services");
        $("html, body").animate({
            scrollTop: targetSection.offset().top -23
        }, 50)
    });

    // Make an appointment button
    $(".hero-btn2").on("click", function() {
        window.location.href = "appointment.html"
    })

    // Services card hover effect
    $(".service-card").hover(function() {
        $(this).addClass("hovered");
    }, function() {
        $(this).removeClass("hovered");
    });
});