// Functions to display all appointments and details
const displayAppointments = {
    display: "upcoming",

    // Format appointments split appointments
    formatAppointments() {
        const today = new Date().toISOString().split("T")[0];

        // Add number of days
        appointments.forEach(appointment => {
            let dayNum = new Date(appointment.date) - new Date();
            dayNum = Math.ceil(dayNum / (1000 * 60 * 60 * 24));

            if (dayNum > 1) {
                dayNum = `${dayNum} days`;
            }

            if (dayNum == 1) {
                dayNum = "Tomorrow";
            }

            if (dayNum === 0) {
                dayNum = "Today";
            }   

            if (dayNum === -1) {
                dayNum = Math.abs(dayNum);
                dayNum = "Yesterday";
            }

            if (dayNum < -1) {
                dayNum = Math.abs(dayNum);
                dayNum = `${dayNum} days ago`
            }

            appointment.dayNum = dayNum;
        });

        // Categorical appointments
        let upcomingAppointments = [];
        let previousAppointments = [];

        appointments.forEach(appointment => {
            if (appointment.date >= today) {
                upcomingAppointments.push(appointment);
            } else {
                previousAppointments.push(appointment);
            }
        });

        // Sort by date and time (close to far)
        upcomingAppointments = upcomingAppointments.sort((a, b) => {
            const dateComparison = new Date(a.date) - new Date(b.date);

            // Date different, sort by date
            if (dateComparison !== 0) {
                return dateComparison;
            }

            // Date same, sort by time
            return a.time - b.time;
        });

        previousAppointments = previousAppointments.sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date);

            // Date different, sort by date
            if (dateComparison !== 0) {
                return dateComparison;
            }

            // Date same, sort by time
            return b.time - a.time;
        });

        // Return both
        return {
            upcomingAppointments: upcomingAppointments,
            previousAppointments: previousAppointments
        };
    },

    // Display today's appointments and upcoming appointments number
    displayNumber(appointments) {
        let todayAppointments = 0;

        appointments.forEach(appointment => {
            // Get today's appointments number
            if (appointment.dayNum === "Today") {
                todayAppointments += 1;
            }
        });

        // Display number
        $("#todayAppointmentsNumber").text(todayAppointments);
        $("#upcomingAppointmentsNumber").text(appointments.length);
    },

    // Display appointments card
    displayCards(appointments) {
        let displayedContent = "";

        if (appointments.length === 0) {
            // No appointment
            displayedContent = `
                <div class="no-content d-flex flex-column gap-3 align-items-center justify-content-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                    </svg>
                    <div>No appointments</div>
                </div>
            `;
            
        } else {
            // Have appointment
            $("#dateRangeFilter").removeClass("d-none");

            appointments.forEach(appointment => {
                displayedContent += `
                    <div class="big-section-content-card appointment-card p-3 bg-white border-start border-primary border-4 rounded-3">
                        <div class="d-sm-flex flex-row-reverse justify-content-between">
                            <div class="d-flex">
                                <div class="bg-primary px-3 py-1 rounded-pill text-white">${appointment.dayNum}</div>
                            </div>
                            <div class="fw-bold fs-5">${appointment.name}</div>
                        </div>
                        <div>
                            <span class="fw-semibold">Time: </span>
                            <span class="fw-light">${timeOptions[appointment.time]}</span>
                        </div>
                        <div>
                            <span class="fw-semibold">Service Type: </span>
                            <span class="fw-light">${serviceType[appointment.serviceType]}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Display content
        $("#upcomingAppointmentsContent").html(displayedContent);
    },

    // Display appointment details modal when clicked
    displayDetails(appointments) {
        // Unbind old click handler
        $(".appointment-card").off("click");

        $(".appointment-card").on("click", function() {
            // Get card index of the clicked card
            const cardIndex = $(".appointment-card").index(this);

            // Get the appointment details
            const selectedAppointment = appointments[cardIndex];

            // Add details to modal
            $("#appointmentName").text(selectedAppointment.name);
            $("#appointmentEmail").text(selectedAppointment.email);
            $("#appointmentPhoneNumber").text(selectedAppointment.phone);
            $("#appointmentMake").text(selectedAppointment.make);
            $("#appointmentModel").text(selectedAppointment.model);
            $("#appointmentServiceType").text(serviceType[selectedAppointment.serviceType]);
            $("#appointmentDate").text(selectedAppointment.date);
            $("#appointmentTime").text(timeOptions[selectedAppointment.time]);
            $("#appointmentNotes").text(selectedAppointment.notes);

            // Show modal
            $("#appointmentDetailsModal").modal("show");
        });
    },

    // Function to filter appointments by date range
    filterByDateRange(appointments) {
        // Get input
        const startDate = $("#startDate").val();
        const endDate = $("#endDate").val();

        // Clear error message
        $("#dateRangeError").text("");

        // Validate input
        if (startDate && endDate && startDate > endDate) {
            $("#dateRangeError").text("End date can't be before start date");
            this.displayCards(appointments);
            this.displayDetails(appointments);
            return;
        }

        // Get filtered appointments
        let filteredAppointments = [];

        appointments.forEach(appointment => {
            let match = true;

            if (startDate && appointment.date < startDate) {
                match = false;
            }

            if (endDate && appointment.date > endDate) {
                match = false;
            }

            if (match) {
                filteredAppointments.push(appointment);
            }
        });

        // Display filtered appointments
        this.displayCards(filteredAppointments);
        this.displayDetails(filteredAppointments);

        // Show or hide clear button
        if (startDate || endDate) {
            $("#clearFilterBtn").removeClass("d-none");
        } else {
            $("#clearFilterBtn").addClass("d-none");
        }
    },

    // Clear button click
    initializeClearBtn(appointments) {
        // Unbind old click handler
        $("#clearFilterBtn").off("click");

        $("#clearFilterBtn").on("click", function() {
            // Clear filter 
            $("#startDate").val("");
            $("#endDate").val("");

            // Clear error message
            $("#dateRangeError").text("");

            // Hide clear button
            $("#clearFilterBtn").addClass("d-none");

            // Show original results
            displayAppointments.launcher();
        });
    },

    // Toggle between upcoming and previous
    toggleUpcomingPrevious() {
        // Unbind old click handler
        $("#previousAppointmentBtn").off("click");
        $("#upcomingAppointmentsBtn").off("click");

        // Toggle to previous
        $("#previousAppointmentBtn").on("click", function() {
            // Set mode
            displayAppointments.display = "previous";

            // Change title
            const titleHtml = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                <div class="fs-5 fw-semibold">Previous Appointments</div>
            `;

            $("#appointmentsTitle").html(titleHtml);

            // Toggle buttons
            $("#previousAppointmentBtn").hide();
            $("#upcomingAppointmentsBtn").removeClass("d-none");

            // Set up display and filter
            displayAppointments.launcher();
        });

        // Toggle to upcoming
        $("#upcomingAppointmentsBtn").on("click", function() {
            // Set mode
            displayAppointments.display = "upcoming";

            // Change title
            const titleHtml = `
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
                <div class="fs-5 fw-semibold">Upcoming Appointments</div>
            `;

            $("#appointmentsTitle").html(titleHtml);

            // Toggle buttons
            $("#previousAppointmentBtn").show();
            $("#upcomingAppointmentsBtn").addClass("d-none");

            // Set up display and filter
            displayAppointments.launcher();
        });
    },

    // Run 
    launcher() {
        const {upcomingAppointments, previousAppointments} = this.formatAppointments();
        this.displayNumber(upcomingAppointments);

        this.toggleUpcomingPrevious();

        // Determine displayed appointments
        let displayedAppointments;

        if (this.display === "previous") {
            displayedAppointments = previousAppointments;
        } else{
            displayedAppointments = upcomingAppointments;
        }

        // Display appointments
        this.filterByDateRange(displayedAppointments);

        // Unbind old change handler
        $("#startDate, #endDate").off("change");

        // Filter function work
        $("#startDate, #endDate").on("change", function() {
            displayAppointments.filterByDateRange(displayedAppointments);
            displayAppointments.initializeClearBtn(displayedAppointments)
        });
    }
};

// Function to display inventory alerts
const displayInventoryAlerts = {
    // Format parts
    formatParts() {
        let formattedParts = [];

        // Filter out in stock parts
        parts.forEach(part => {
            if (part.quantity <= 5) {
                formattedParts.push(part);
            }
        });

        // Sort parts by quantity
        formattedParts = formattedParts.sort((a, b) => {
            return a.quantity - b.quantity;
        });

        // Return formatted parts
        return formattedParts;
    },

    // Display inventory alerts cards
    displayCards(parts) {
        let displayedContent = "";

        if (parts.length === 0) {
            // No part
            displayedContent = `
                <div class="no-content d-flex flex-column gap-3 align-items-center justify-content-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                    <div>All parts are in stock</div>
                </div>
            `;
            
        } else {
            // Have part
            parts.forEach(part => {
                // Get status
                const status = filterFunction.getStatus(part.quantity);

                // Get border color
                let border;
                if (part.quantity === 0) {
                    border = "border-danger";
                } else if (part.quantity > 0) {
                    border = "border-warning";
                }

                displayedContent += `
                    <div class="big-section-content-card inventory-card p-3 bg-white border-start ${border} border-4 rounded-3" data-part-name="${part.name}">
                        <div class="d-sm-flex flex-row-reverse justify-content-between">
                            <div class="d-flex">
                                <div class="${status.stockStatusData} px-3 py-1 rounded-pill">${status.stockStatusText}</div>
                            </div>
                            <div class="fw-bold fs-5">${part.name}</div>
                        </div>
                        <div>
                            <span class="fw-semibold">Category: </span>
                            <span class="fw-light">${part.category}</span>
                        </div>
                        <div>
                            <span class="fw-semibold">Quantity: </span>
                            <span class="fw-light">${part.quantity}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Display content
        $("#inventoryAlertContent").html(displayedContent);
    },

    // Function to navigate to inventory page 
    navigateOnClick() {
        $(document).on("click", ".inventory-card", function() {
            // Get part name
            const partName = $(this).data("part-name");

            // Save part name to local storage
            localStorage.setItem("scrollToSelectedPart", partName);

            // Navigate to inventory page
            window.location.href = "inventory.html";
        });
    },

    // Run
    launcher() {
        const formattedParts = this.formatParts();
        $("#inventoryAlertsNumber").text(formattedParts.length);
        this.displayCards(formattedParts);
        this.navigateOnClick();
    }
};

// Function to display due soon services
const displayDueSoonServices = {
    // Filter out upcoming services ( > 30 days )
    getDueSoonServices() {
        // Get sorted vehicles
        const sortedVehicles = pageInitializer.sortVehicles(vehicles);

        // Get due soon services
        let dueSoonServices = [];

        sortedVehicles.forEach(vehicle => {
            const due = pageInitializer.calculateDueDate(vehicle.lastServiceDate);

            if (due.dueIn <= 30) {
                dueSoonServices.push(vehicle);
            }
        });

        return dueSoonServices;
    },

    // Display cards
    displayCards(services) {
        let displayedContent = "";

        if (services.length === 0) {
            // No services
            displayedContent = `
                <div class="no-content d-flex flex-column gap-3 align-items-center justify-content-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg>
                    <div>No due soon services in 30 days</div>
                </div>
            `;
            
        } else {
            // Have services
            services.forEach(service => {
                // Get status and style
                const {dueDate, dueIn} = pageInitializer.calculateDueDate(service.lastServiceDate);

                let status;
                let statusStyle;
                let borderColor;

                if (dueIn < 0) {
                    status = "Overdue";
                    statusStyle = "bg-danger text-white";
                    borderColor = "border-danger";

                } else if (dueIn === 0) {
                    status = "Today";
                    statusStyle = "bg-warning";
                    borderColor = "border-warning";

                } else {
                    status = `${dueIn} days`;
                    statusStyle = "bg-warning";
                    borderColor = "border-warning";
                }

                displayedContent += `
                    <div class="big-section-content-card services-card p-3 bg-white border-start ${borderColor} border-4 rounded-3" data-plate-number="${service.plateNumber}">
                        <div class="d-sm-flex flex-row-reverse justify-content-between">
                            <div class="d-flex">
                                <div class="${statusStyle} px-3 py-1 rounded-pill">${status}</div>
                            </div>
                            <div class="fw-bold fs-5">${service.plateNumber}</div>
                        </div>
                        <div>
                            <span class="fw-semibold">Due date: </span>
                            <span class="fw-light">${dueDate}</span>
                        </div>
                        <div>
                            <span class="fw-semibold">Last service: </span>
                            <span class="fw-light">${service.lastServiceDate}</span>
                        </div>
                        <div>
                            <span class="fw-semibold">Owner: </span>
                            <span class="fw-light">${service.owner}</span>
                        </div>
                    </div>
                `;
            });
        }

        // Display content
        $("#dueSoonServicesContent").html(displayedContent);
    },

    // Function to navigate to selected vehicle service history page
    navigateOnClick() {
        $(document).on("click", ".services-card", function() {
            // Get plate number
            const plateNumber = $(this).data("plate-number");

            // Store plate number to session storage
            sessionStorage.setItem("selectedPlateNumber", plateNumber);

            // Navigate to service history page
            window.location.href = "service-history.html";
        });
    },

    // Run
    launcher() {
        const dueSoonServices = this.getDueSoonServices();
        $("#dueSoonServicesNumber").text(dueSoonServices.length);
        this.displayCards(dueSoonServices);
        this.navigateOnClick();
    }
};

// Run
$(document).ready(function() {
    checkAdmin();
    displayAppointments.launcher();
    displayInventoryAlerts.launcher();
    displayDueSoonServices.launcher();
});