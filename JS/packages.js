// Triggle details button
function initializeDetailsBtn() {
    // Show details on click
    $(".details-btn").on("click", function() {
        const tooltipType = $(this).data("tooltip");
        const targetTooltip = $("#tooltip-" + tooltipType);

        if (targetTooltip.hasClass("d-none")) {
            targetTooltip.removeClass("d-none").hide().fadeIn(200);
        } else {
            targetTooltip.fadeOut(200, function() {
                targetTooltip.addClass("d-none");
            });
        }
    });

    // Close when click outside
    $(document).on("click", function() {
        $(".health-check-tooltip").fadeOut(200, function() {
            $(this).addClass("d-none");
        });
    });

    // Avoid closing tooltip when clicking inside
    $(".view-details").on("click", function(e) {
        e.stopPropagation();
    });
}

$(document).ready(function() {
    initializeDetailsBtn();
});