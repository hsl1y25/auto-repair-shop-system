const pageInitializer = {
    // Sort vehicles by last service date
    sortVehicles(vehicles) {
        // Create array with vehicles and their last service date
        const vehiclesWithLastService = vehicles.map(vehicle => {
            let lastServiceDate = null;
            
            // Get the last service date from service history
            if (vehicle.serviceHistory && vehicle.serviceHistory.length > 0) {
                const sortedHistory = [...vehicle.serviceHistory].sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                lastServiceDate = sortedHistory[0].date;
            }
            
            return {
                ...vehicle,
                lastServiceDate: lastServiceDate
            };
        });
        
        // Filter out vehicles with no service history
        const vehiclesWithService = vehiclesWithLastService.filter(v => v.lastServiceDate !== null);
        
        // Sort by last service date
        vehiclesWithService.sort((a, b) => {
            return new Date(a.lastServiceDate) - new Date(b.lastServiceDate);
        });
        
        return vehiclesWithService;
    },

    // Calculate due date
    calculateDueDate(lastServiceDate) {
        // Get last service date
        const lastService = new Date(lastServiceDate);

        // Get due date
        let dueDate = new Date(lastService);
        dueDate.setMonth(dueDate.getMonth() + 6);
        dueDate = dueDate.toISOString().split("T")[0];

        // Get due in
        const dueInMs = new Date(dueDate) - new Date();
        const dueInDay = Math.ceil(dueInMs / (1000 * 60 * 60 * 24));

        // Return
        return {
            dueDate: dueDate,
            dueIn: dueInDay
        };
    },

    // Display schedule cards
    displayCards(vehicles) {
        // Clear display
        $("#cardsPlaceholder").empty();

        // No service history
        if (vehicles.length === 0) {
            $("#cardsPlaceholder").html(`
                <div class="col-12 text-secondary text-center p-3 fs-4">No vehicles with service history found.</div> 
                <div class="text-center">  
                    <a href="vehicles.html" class="btn btn-dark">Go Back</a>  
                </div>
            `);

            return;
        }

        // Display each vehicle
        vehicles.forEach(vehicle => {
            const {dueDate, dueIn} = this.calculateDueDate(vehicle.lastServiceDate);

            // Determine status with styling
            let status;
            let statusContainer;
            let statusStyle;
            let iconPath;
            let dueInDisplay = `${dueIn} days`
            let btnColor;

            if (dueIn < 0) {
                status = "OVERDUE";
                statusContainer = "overdue-container";
                statusStyle = "bg-danger text-white";
                iconPath = "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2";
                dueInDisplay = "Overdue";
                btnColor = "btn-danger";

            } else if (dueIn == 0) {
                status = "TODAY";
                statusContainer = "due-soon-container";
                statusStyle = "bg-warning";
                iconPath = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z";
                dueInDisplay = "Today"
                btnColor = "btn-warning";

            } else if (dueIn <= 30) {
                status = "DUE SOON";
                statusContainer = "due-soon-container";
                statusStyle = "bg-warning";
                iconPath = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z";
                btnColor = "btn-warning";

            } else {
                status = "UPCOMING";
                statusContainer = "upcoming-container";
                statusStyle = "bg-info";
                iconPath = "M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5";
                btnColor = "btn-info";
            }

            // Build html code
            const cardHtml = `
                <div class="col-12">
                    <div class="${statusContainer} p-3 d-flex flex-column gap-2">
                        <div class="d-sm-flex justify-content-between m-2">
                            <div class="d-flex align-items-center gap-3"> 
                                <div class="${statusStyle} p-2 rounded-pill">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                        <path d="${iconPath}"/>
                                    </svg>
                                </div>

                                <div class="fs-5 fw-semibold">${vehicle.plateNumber}</div>
                            </div>

                            <div class="d-flex align-items-center mt-2 mt-sm-0">
                                <div class="rounded-pill px-3 py-1 fw-bold ${statusStyle}">${status}</div>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <div class="w-50 semi-transperent-black-bg rounded-3 p-2">
                                <div class="text-secondary">Due in</div>
                                <div class="fs-5 fw-bold">${dueInDisplay}</div>
                            </div>

                            <div class="w-50 semi-transperent-black-bg rounded-3 p-2">
                                <div class="text-secondary">Due Date</div>
                                <div class="fs-5 fw-bold">${dueDate}</div>
                            </div>
                        </div>

                        <div>
                            <div class="text-secondary">Last service:</div>
                            <div class="text-secondary">${vehicle.lastServiceDate}</div>
                        </div>

                        <a href="appointment.html" class="btn ${btnColor}">Schedule Now</a>
                    </div>
                </div>
            `;

            // Append into html
            $("#cardsPlaceholder").append(cardHtml);
        });
    },

    // Run page initializer
    launcher() {
        const userVehicles = showVehicles.getVehicles();

        // User vehicles not found
        if (!userVehicles) {
            alert("Vehicles not found!");
            window.location.href = "vehicles.html";
        }

        const sortedVehicles = this.sortVehicles(userVehicles);
        this.displayCards(sortedVehicles);
    }
};

// Run
$(document).ready(function() {
    pageInitializer.launcher();
});