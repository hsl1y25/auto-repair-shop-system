// Display all information 
const pageInitializer = {
    // Store original indices to map display order to original array
    sortedIndices: [],

    // Get selected vehicle details from session storage and local storage
    getVehicle() {
        // Get selected plate number
        const selectedPlateNumber = sessionStorage.getItem("selectedPlateNumber");

        // Handle no selected plate number event
        if (!selectedPlateNumber) {
            alert("Plate number not found!");
            window.location.href = "vehicles.html";
            return null;
        }

        // Get vehicles array
        getLatestVehicles();

        // Find the selected vehicle by plate number
        const selectedVehicle = vehicles.find(vehicle => vehicle.plateNumber === selectedPlateNumber);

        // Handle vehicle not found event
        if (!selectedVehicle) {
            alert("Vehicle not found!");
            window.location.href = "vehicles.html";
            return null;
        }

        return selectedVehicle;
    },

    // Function to display vehicle details
    displayVehicleDetail(vehicle) {
        $("#plateNumberDisplay").text(vehicle.plateNumber);
        $("#makeDisplay").text(vehicle.make);
        $("#modelDisplay").text(vehicle.model);
        $("#ownerDisplay").text(vehicle.owner);
        $("#ownerUsernameDisplay").text(vehicle.ownerUsername);
    },

    // Function to display service history
    displayServiceHistory(vehicle) {
        // Get service history array
        const serviceHistory = vehicle.serviceHistory;

        // Check login status
        const user = showVehicles.checkLoginStatus();

        // Handle no vehicle event
        $("#noResultDisplay").text("");
        if (serviceHistory.length === 0) {
            $("#noResultDisplay").text("No service history");
            this.sortedIndices = [];
            $("#serviceHistoryTableBody").html("");

            // Toggle edit buttons
            if (user.permission === "admin") {
                $("#addServiceHistoryIcon").removeClass("d-none").show();
                $("#deleteServiceHistoryIcon").hide();
            }

            return;
        }

        // Toggle edit buttons
        if (user.permission === "admin") {
            $("#addServiceHistoryIcon").removeClass("d-none").show();
            $("#deleteServiceHistoryIcon").removeClass("d-none").show();
        }

        // Create array of indices with their service history
        const indexedHistory = serviceHistory.map((service, index) => ({
            originalIndex: index,
            service: service
        }))

        // Sort service history by mileage (latest first)
        const sortedServiceHistory = indexedHistory.sort((a, b) => {
            if (a.service.mileage === b.service.mileage) {
                return new Date(b.service.date) - new Date(a.service.date);
            }

            return b.service.mileage - a.service.mileage;
        });

        // Store the mapping of display index to original index
        this.sortedIndices = sortedServiceHistory.map(service => service.originalIndex); 

        // Set html codes
        let serviceHistoryHtml = "";

        sortedServiceHistory.forEach(item => {
            const history = item.service;
            serviceHistoryHtml += `
                <tr>
                    <td>${history.date}</td>
                    <td>${history.service}</td>
                    <td>${history.mileage}</td>
                    <td>${history.cost}</td>
                    <td>${history.technician}</td>
                    <td>${history.notes}</td>
                    <td class="delete-service-history-btn d-none">
                        <div class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Show history in table
        $("#serviceHistoryTableBody").html(serviceHistoryHtml);
    },

    // Display edit button for admin
    displayEditButtons() {
        // Check login status
        const user = showVehicles.checkLoginStatus();

        // Display if admin
        if (user.permission === "admin") {
            $("#addServiceHistoryIcon").removeClass("d-none");
            $("#deleteServiceHistoryIcon").removeClass("d-none");
        }
    },

    // Run page initializer
    launcher() {
        const selectedVehicle = this.getVehicle();
        this.displayVehicleDetail(selectedVehicle);
        this.displayServiceHistory(selectedVehicle);
        this.displayEditButtons()
    }
}

// Add function
const addServiceHistory = {
    // Set default date as today in form
    modalSetDefaultDate() {
        const today = new Date();
        const formattedToday = formatDate(today);
        $("#dateInput").val(formattedToday);
    },

    // Clear error message
    clearError() {
        $("#dateError").text("");
        $("#mileageError").text("");
        $("#costError").text("");
        $("#modalErrorMessage").text("");
    },

    // Reset all input field
    resetForm() {
        this.modalSetDefaultDate();
        $("#serviceInput").val("");
        $("#mileageInput").val("");
        $("#costInput").val("");
        $("#technicianInput").val("");
        $("#notesInput").val("");
    },

    // Get input from modal form
    getInput() {
        // Get input
        const dateInput = $("#dateInput").val();
        const serviceInput = $("#serviceInput").val().trim();
        const mileageInput = $("#mileageInput").val();
        const costInput = $("#costInput").val();
        const technicianInput = $("#technicianInput").val();
        let notesInput = $("#notesInput").val().trim();

        // Format note input if leave blank
        if (notesInput === "") {
            notesInput = "-"
        }
        
        // Store all in an object
        const newServiceDetails = {
            date: dateInput,
            service: serviceInput,
            mileage: mileageInput,
            cost: costInput,
            technician: technicianInput,
            notes: notesInput
        };

        // Return all input
        return newServiceDetails;
    },

    validateInput(inputs) {
        let errorParts = [];

        // Check all fields are filled
        for(let key in inputs) {
            if (inputs[key] === "" || inputs[key] === undefined) {
                $("#modalErrorMessage").text("Please fill in all fields.");
                errorParts.push($(`#${key}Input`));
            }
        }

        // Check date
        const todayDate = new Date();
        if (new Date(inputs.date) > todayDate) {
            $("#dateError").text("Service date should not be in the future.");
            errorParts.push($("#dateInput"));
        }

        let serviceBefore = [];
        let serviceAfter = [];
        const vehicle = pageInitializer.getVehicle();

        // Get a list of service before input date
        vehicle.serviceHistory.forEach(service => {
            if (new Date(service.date) < new Date(inputs.date)) {
                serviceBefore.push(service);
            }
        });

        // Get a list of service after input date
        vehicle.serviceHistory.forEach(service => {
            if (new Date(service.date) > new Date(inputs.date)) {
                serviceAfter.push(service);
            }
        })

        // Get highest mileage in service history before input date (min input)
        let min = 0;       
        serviceBefore.forEach(service => {
            if (service.mileage > min) {
                min = service.mileage;
            }
        });

        // Get lowest mileage in service history after input date
        let max = Infinity;
        serviceAfter.forEach(service => {
            if (service.mileage < max) {
                max = service.mileage;
            }
        });

        // Check mileage
        const mileageInput = parseFloat(inputs.mileage);

        if (mileageInput < 0) {
            $("#mileageError").text("Mileage should not be negative.");
            errorParts.push($("#mileageInput"));
        }

        if (mileageInput < min || mileageInput > max) {
            if (min !== 0 && max !== Infinity) {
                $("#mileageError").text(`Mileage should between ${min} km and ${max} km.`);

            } else if (min === 0) {
                $("#mileageError").text(`Mileage should be smaller than ${max} km.`);

            } else if (max === Infinity) {
                $("#mileageError").text(`Mileage should be larger than ${min} km.`);
            }
            
            errorParts.push($("#mileageInput"));
        }

        // Check cost
        if (isNaN(inputs.cost)) {
            $("#costError").text("Not a number.");
            errorParts.push($("#costInput"));
        }

        if (inputs.cost < 0) {
            $("#costError").text("Cost should not be negative.");
            errorParts.push($("#costInput"));
        }

        // Has error
        if (errorParts.length !== 0) {
            // Add border to error parts
            errorParts.forEach(part => {
                addBorderTemporarily(part);
            });
            
            return false;
        }

        // Return true if pass all
        return true;
    },

    updateServiceHistory(serviceHistory) {
        // Format new service history
        serviceHistory.mileage = parseFloat(serviceHistory.mileage).toFixed(2);
        serviceHistory.cost = parseFloat(serviceHistory.cost).toFixed(2);

        // Save new service to local storage 
        const selectedVehicle = pageInitializer.getVehicle();
        selectedVehicle.serviceHistory.push(serviceHistory);
        saveVehiclesToLocal();

        // Update display
        pageInitializer.displayServiceHistory(selectedVehicle);

        // If in delete mode
        if($("#deleteServiceHistoryIcon").hasClass("d-none")) {
            deleteServiceHistory.enterDeleteMode();
        }
    },

    launcher() {
        // Add icon click to show modal form
        $("#addServiceHistoryIcon").on("click", function() {
            $("#addServiceHistoryModal").modal("show");
        });

        // Set default date
        this.modalSetDefaultDate();

        // Modal add button click
        $("#modalAddServiceHistoryBtn").on("click", function() {
            // Clear error message
            addServiceHistory.clearError();

            // Get input and check
            const newService = addServiceHistory.getInput();
            const valid = addServiceHistory.validateInput(newService);

            // Update service if input correct
            if (valid) {
                addServiceHistory.updateServiceHistory(newService);
                addServiceHistory.resetForm();
                $("#addServiceHistoryModal").modal("hide");
            }
        });

        // Clear button click
        $("#modalClearServiceHistoryBtn").on("click", function() {
            addServiceHistory.resetForm();
            addServiceHistory.clearError();
        });
    }
};

// Delete function
const deleteServiceHistory = {
    // Enter delete mode
    enterDeleteMode() {
        $("#deleteServiceHistoryIcon").addClass("d-none");
        $("#finishBtn").removeClass("d-none").show();
        $("#deleteServiceColumn").removeClass("d-none").show();
        $(".delete-service-history-btn").removeClass("d-none").show();
    },

    // Exit delete mode
    exitDeleteMode() {
        $("#deleteServiceHistoryIcon").removeClass("d-none");
        $("#finishBtn").hide();
        $("#deleteServiceColumn").hide();
        $(".delete-service-history-btn").hide();
    },

    // Function to remove service history based on index
    removeServiceHistory(index) {
        // Get vehicle
        const vehicle = pageInitializer.getVehicle();

        // Get the original index
        const originalIndex = pageInitializer.sortedIndices[index];

        // Remove service history
        vehicle.serviceHistory.splice(originalIndex, 1);

        // Update local storage and display
        saveVehiclesToLocal();
        pageInitializer.displayServiceHistory(vehicle);

        // Re enter delete mode
        this.enterDeleteMode();
    },  

    launcher() {
        // Delete icon clicked
        $("#deleteServiceHistoryIcon").on("click", function() {
            deleteServiceHistory.enterDeleteMode();
        });

        // Delete buttons clicked
        $("#serviceHistoryTableBody").off("click", ".delete-service-history-btn").on("click", ".delete-service-history-btn", function() {
            // Get row index
            const row = $(this).closest("tr");
            const rowIndex = row.index();

            // Confirmation
            const confirmDelete = confirm("Are you sure you want to delete this service history?")

            // Delete if confirm
            if (confirmDelete) {
                deleteServiceHistory.removeServiceHistory(rowIndex);
            }
        });

        // Finish icon clicked
        $("#finishBtn").on("click", function() {
            deleteServiceHistory.exitDeleteMode();
        });
    }
};

// Run
$(document).ready(function() {
    pageInitializer.launcher();
    addServiceHistory.launcher();
    deleteServiceHistory.launcher();
});