// Set vehicles array
let vehicles = [];

// Store current search query
let currentSearchPlateNumber = "";

// Function to detect special characters in a string
function containSpecialChars(string) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(string);
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to get latest vehicles details from local storage
function getLatestVehicles() {
    const storedVehicles = localStorage.getItem("vehicles");
  
    if (storedVehicles) {
        // If local storage exist
        vehicles = JSON.parse(storedVehicles);

    } else {
        // Local storage not found, use sample data (for demo)
        vehicles = [
            {
                plateNumber: "JSL5894",
                make: "Honda",
                model: "Civic",
                owner: "John Doe",
                ownerUsername: "John Doe",
                serviceHistory: [
                    {
                        date: "2025-07-15",
                        service: "Engine repair",
                        mileage: 45520.00.toFixed(2),
                        cost: 3500.00.toFixed(2),
                        technician: "Arthur",
                        notes: "motor oil buildup"
                    },
                    {
                        date: "2025-01-05",
                        service: "Brake inspection",
                        mileage: 39650.00.toFixed(2),
                        cost: 350.00.toFixed(2),
                        technician: "Arthur",
                        notes: "replaced front brake pads"
                    },
                ],
                digitalInspectionReport: [
                    {
                        date: "2025-07-15",
                        technician: "Wilston",
                        checkedParts: {
                            engine: "FAIL",
                            transmission: "PASS",
                            clutch: "N/A",
                            steeringMechanism: "PASS",
                            horn: "PASS",
                            wipers: "PASS",
                            rearVisionMirrors: "PASS",
                            lighting: "PASS",
                            brake: "PASS",
                            tires: "PASS",
                            emergencyEquipments: "PASS"
                        },
                        comments: "Engine fails. Required immediate action."
                    },
                    {
                        date: "2025-01-05",
                        technician: "David",
                        checkedParts: {
                            engine: "PASS",
                            transmission: "PASS",
                            clutch: "N/A",
                            steeringMechanism: "PASS",
                            horn: "PASS",
                            wipers: "PASS",
                            rearVisionMirrors: "PASS",
                            lighting: "PASS",
                            brake: "FAIL",
                            tires: "PASS",
                            emergencyEquipments: "PASS"
                        },
                        comments: "Brake pads thickness less than 1/4 inch. Replacement needed."
                    },
                    {
                        date: "2025-04-23",
                        technician: "David",
                        checkedParts: {
                            engine: "PASS",
                            transmission: "PASS",
                            clutch: "N/A",
                            steeringMechanism: "PASS",
                            horn: "PASS",
                            wipers: "PASS",
                            rearVisionMirrors: "PASS",
                            lighting: "PASS",
                            brake: "PASS",
                            tires: "PASS",
                            emergencyEquipments: "PASS"
                        },
                        comments: "Overall no problem."
                    }
                ]
            },

            {
                plateNumber: "JSV2354",
                make: "Perodua",
                model: "Myvi",
                owner: "John Doe",
                ownerUsername: "John Doe",
                serviceHistory: [
                    {
                        date: "2025-08-12",
                        service: "Regular check",
                        mileage: 23748.00.toFixed(2),
                        cost: 50.00.toFixed(2),
                        technician: "Arthur",
                        notes: "-"
                    },
                    {
                        date: "2025-03-08",
                        service: "Air conditioning repair",
                        mileage: 18956.00.toFixed(2),
                        cost: 526.00.toFixed(2),
                        technician: "Arthur",
                        notes: "-"
                    }
                ],
                digitalInspectionReport: []
            },

            {
                plateNumber: "SYN4894",
                make: "Toyota",
                model: "Hilux",
                owner: "James",
                ownerUsername: "James",
                serviceHistory: [
                    {
                        date: "2025-09-12",
                        service: "Battery replacement",
                        mileage: 96350.00.toFixed(2),
                        cost: 450.00.toFixed(2),
                        technician: "Arthur",
                        notes: "battery life end"
                    },
                ],
                digitalInspectionReport: [
                    {
                        date: "2025-12-31",
                        technician: "David",
                        checkedParts: {
                            engine: "PASS",
                            transmission: "PASS",
                            clutch: "PASS",
                            steeringMechanism: "PASS",
                            horn: "PASS",
                            wipers: "PASS",
                            rearVisionMirrors: "PASS",
                            lighting: "PASS",
                            brake: "PASS",
                            tires: "PASS",
                            emergencyEquipments: "PASS"
                        },
                        comments: "Overall no problem."
                    }
                ]
            },

            {
                plateNumber: "WPL5962",
                make: "BMW",
                model: "X5",
                owner: "James",
                ownerUsername: "James",
                serviceHistory: [
                    {
                        date: "2025-04-23",
                        service: "Tire balancing and alignment",
                        mileage: 68526.00.toFixed(2),
                        cost: 100.00.toFixed(2),
                        technician: "Arthur",
                        notes: "-"
                    },
                ],
                digitalInspectionReport: []
            },

            {
                plateNumber: "JGA2353",
                make: "Proton",
                model: "Saga",
                owner: "John Doe",
                ownerUsername: "John Doe",
                serviceHistory: [
                    {
                        date: "2026-01-02",
                        service: "Regular check",
                        mileage: 89657.00.toFixed(2),
                        cost: 50.00.toFixed(2),
                        technician: "Arthur",
                        notes: "-"
                    }
                ],
                digitalInspectionReport: []
            }
        ];

        // Save to local storage
        saveVehiclesToLocal();
    }
}

// Function to save vehicle to local storage
function saveVehiclesToLocal() {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
}

// Display vehicles based on user
const showVehicles = {
    // Check if login
    checkLoginStatus() {
        // Get current login details from session storage
        const savedUser = sessionStorage.getItem("currentUser");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        
        // Return current user details
        return currentUser;
    },

    getVehicles() {
        // Get current user
        const user = this.checkLoginStatus();

        // Not login
        if (!user) {
            const message = $(`
                <div class="container-sm pb-5">
                    <div class="row d-flex align-items-center mx-1 mx-md-3 mx-lg-5">
                        <div class="col-12 col-lg-6">
                            <img class="img-fluid" src="Images/ServiceHistory/loginImage.png" alt="login illustration">
                        </div>

                        <div class="col-12 col-lg-6 d-flex flex-column gap-3">
                            <h1>Log in to view your vehicle's service records.</h1>
                            <button class="col-12 btn btn-primary d-flex align-items-center justify-content-center gap-2" id="modalLoginBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                                    <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                </svg>
                                <div class="fs-4 fw-semibold">Login</div>
                            </button>
                        </div>
                    </div>
                </div>
            `);

            // Show message
            $("#askLogin").html(message);

            // Hide search bar and table
            $("#searchContainer").hide();
            $("#vehicleTable").hide();

            // Make login button works
            $("#modalLoginBtn").on("click", function () {
                $("#loginModal").modal("show");
                $("#askLoginModal").modal("hide");
            });
            
            // Exit function
            return;
        }

        // Filter vehicles based on user
        let filteredVehicles = [];

        if (user.permission === "admin") {
            // Log in as admin
            filteredVehicles = vehicles;

            // Show title
            $("#titleAllVehicles").text("All Vehicles");

            // Show edits icons
            $("#addVehicleBtn").removeClass("d-none");
            $("#editVehicleBtn").removeClass("d-none");

        } else {
            // Log in as customer
            filteredVehicles = vehicles.filter(vehicle =>
                vehicle.ownerUsername === user.username
            );

            // Hide search bar
            $("#searchContainer").hide();

            // Show title
            $("#titleAllVehicles").text("Your Vehicles");
            $("#titleUpcomingServices").text("Upcoming Services");

            // Show button
            if (filteredVehicles.length > 0) {
                $(".hero-btn2").removeClass("d-none");
            }
        }

        // Return result
        return filteredVehicles;
    },

    displayVehicles(vehicles) {
        // Check if in edit mode
        const isEditMode = !$("#finishEditVehicleBtn").hasClass("d-none");

        // Handle no vehicle event
        $("#noResultDisplay").text("");
        if (vehicles.length === 0) {
            $("#noResultDisplay").text("No vehicle");
            return;
        }

        // Html code for vehicle row
        let vehiclesRow = "";

        vehicles.forEach(vehicle => {
            vehiclesRow += `
                <tr>
                    <td>
                        <span class="plate-number-display" ${isEditMode ? 'style="display:none;"' : ''}>${vehicle.plateNumber}</span>
                        <span>
                            <input class="plate-number-edit rounded-pill border border-primary p-1 ${isEditMode ? '' : 'd-none'}" type="text" value="${vehicle.plateNumber}">
                        </span>
                    </td>

                    <td>
                        <span class="make-display" ${isEditMode ? 'style="display:none;"' : ''}>${vehicle.make}</span>
                        <span>
                            <input class="make-edit rounded-pill border border-primary p-1 ${isEditMode ? '' : 'd-none'}" type="text" value="${vehicle.make}">
                        </span>
                    </td>

                    <td>
                        <span class="model-display" ${isEditMode ? 'style="display:none;"' : ''}>${vehicle.model}</span>
                        <span>
                            <input class="model-edit rounded-pill border border-primary p-1 ${isEditMode ? '' : 'd-none'}" type="text" value="${vehicle.model}">
                        </span>
                    </td>

                    <td>
                        <span class="owner-display" ${isEditMode ? 'style="display:none;"' : ''}>${vehicle.owner}</span>
                        <span>
                            <input class="owner-edit rounded-pill border border-primary p-1 ${isEditMode ? '' : 'd-none'}" type="text" value="${vehicle.owner}">
                        </span>
                    </td>

                    <td>
                        <span class="owner-username-display" ${isEditMode ? 'style="display:none;"' : ''}>${vehicle.ownerUsername}</span>
                        <span>
                            <input class="owner-username-edit rounded-pill border border-primary p-1 ${isEditMode ? '' : 'd-none'}" type="text" value="${vehicle.ownerUsername}">
                    </td>
                    <td>
                        <button class="view-service-history-btn btn btn-primary">View</button>
                    </td>
                    <td>
                        <button class="view-inspection-report-btn btn btn-primary">View</button>
                    </td>
                    <td class="delete-vehicle-btn ${isEditMode ? '' : 'd-none'}">
                        <div class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Show result
        $("#vehicleTableBody").html(vehiclesRow);
    }
}

// Search function
const searchFunction = {
    getSearchResult(searchQuery) {
        // Set default search result
        let searchResult = showVehicles.getVehicles();

        // Filter by search query
        if (searchQuery !== "") {
            searchResult = searchResult.filter(vehicle =>
                vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase().replace(/\s/g, ''))
            )
        }

        // Return search result
        return searchResult;
    },

    displaySearchResult() {
        // Search bar enter
        $("#searchBar").off("keypress").on("keypress", function(e) {
            if (e.which === 13) {
                e.preventDefault();

                // Get user search query
                const userSearchQuery = $(this).val().trim();

                // Store current search query
                currentSearchPlateNumber = userSearchQuery;

                // Get search result
                const searchResult = searchFunction.getSearchResult(userSearchQuery);

                // Empty the table
                $("#vehicleTableBody").empty();

                // Display result
                showVehicles.displayVehicles(searchResult);

                // Show or hide clear button
                if (userSearchQuery.trim() !== "") {
                    $("#cleanSearchBtn").show();
                } else {
                    $("#cleanSearchBtn").hide();
                }
            }
        });

        // Clean search button
        $("#cleanSearchBtn").off("click").on("click", function() {
            // Reset search bar and table
            $("#searchBar").val("");
            $("#vehicleTableBody").empty();

            // Clear current search query
            currentSearchPlateNumber = "";

            // Show all vehicles
            const filteredVehicles = showVehicles.getVehicles();
            showVehicles.displayVehicles(filteredVehicles);

            // Hide button after done
            $("#cleanSearchBtn").hide();
        });
    }
};

// Add vehicle function
const addVehicle = {
    // Clear error
    clearError() {
        $("#plateNumberError").text("");
        $("#ownerUsernameError").text("");
        $("#modelErrorMessage").text("");
    },

    // Reset form
    resetForm() {
        $("#plateNumberInput").val("");
        $("#makeInput").val("");
        $("#modelInput").val("");
        $("#ownerInput").val("");
        $("#ownerUsernameInput").val("");
    },

    // Get input from modal form
    getInput() {
        // Get input
        const plateNumberInput = $("#plateNumberInput").val().trim().toUpperCase().replace(/\s/g, '');
        let makeInput = $("#makeInput").val();
        let modelInput = $("#modelInput").val();
        let ownerInput = $("#ownerInput").val();
        const ownerUsernameInput = $("#ownerUsernameInput").val();

        // Format input
        makeInput = makeInput.charAt(0).toUpperCase() + makeInput.slice(1);
        modelInput = modelInput.charAt(0).toUpperCase() + modelInput.slice(1);
        ownerInput = ownerInput.charAt(0).toUpperCase() + ownerInput.slice(1);

        // Store all input in an object
        const vehicleDetails = {
            plateNumber: plateNumberInput,
            make: makeInput,
            model: modelInput,
            owner: ownerInput,
            ownerUsername: ownerUsernameInput
        }

        // Return all input 
        return vehicleDetails;
    },

    // Validate input
    validateInput(inputs) {
        let errorParts = [];

        // Check all fields are filled
        for(let key in inputs) {
            if (inputs[key] === "") {
                $("#modelErrorMessage").text("Please fill in all fields.");
                errorParts.push($(`#${key}Input`));
            }
        }

        // Check plate number (special characters)
        if (containSpecialChars(inputs.plateNumber)) {
            $("#plateNumberError").text("Plate number should not contain special character.");
            errorParts.push($("#plateNumberInput"));
        }

        // Get a list of existing plate number
        let plateNumbers = [];
        vehicles.forEach(vehicle => {
            plateNumbers.push(vehicle.plateNumber);
        })

        // Check plate number (duplicate)
        if (plateNumbers.includes(inputs.plateNumber)) {
            $("#plateNumberError").text("Plate number already exist.");
            errorParts.push($("#plateNumberInput"));
        }

        // Get list of username from auth.js
        let usernameList = [];
        users.forEach(user => {
            usernameList.push(user.username);
        })

        // Check username
        if (!(usernameList.includes(inputs.ownerUsername)) && inputs.ownerUsername !== "") {
            $("#ownerUsernameError").text("Username not found.");
            errorParts.push($("#ownerUsernameInput"));
        }

        if (inputs.ownerUsername === "Admin") {
            $("#ownerUsernameError").text('Username should not be "Admin".');
            errorParts.push($("#ownerUsernameInput"));
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

    // Update vehicles display
    updateVehicles(inputs) {
        // Adjust object to push in vehicles array
        inputs.serviceHistory = [];
        inputs.digitalInspectionReport = [];

        // Push new vehicle to vehicles array
        vehicles.push(inputs);
        
        // Update display
        showVehicles.displayVehicles(vehicles);

        // Store new vehicle to local storage
        saveVehiclesToLocal();
    },

    // Run add vehicle
    launcher() {
        // Add icon click
        $("#addVehicleBtn").on("click", function() {
            // Show modal
            $("#addVehicleModal").modal("show");
        });

        // Modal add button click
        $("#modalAddBtn").on("click", function() {
            // Clear error message
            addVehicle.clearError();

            // Get input and check
            const vehicleDetails = addVehicle.getInput();
            const valid = addVehicle.validateInput(vehicleDetails);

            // Update vehicles when input correct
            if (valid) {
                addVehicle.updateVehicles(vehicleDetails);
                addVehicle.resetForm();
                $("#addVehicleModal").modal("hide");
            }
        });

        // Clear button click
        $("#modalClearBtn").on("click", function() {
            addVehicle.resetForm();
            addVehicle.clearError();
        });
    }
};

// Edit vehicle function
const editVehicle = {
    // Set backup
    backupVehicles : null,

    // Store backup
    storeBackup() {
        this.backupVehicles = JSON.parse(JSON.stringify(vehicles));
    },

    // Show edit fields and buttons
    showEdit() {
        // Show
        $(".plate-number-edit").removeClass("d-none").show();
        $(".make-edit").removeClass("d-none").show();
        $(".model-edit").removeClass("d-none").show();
        $(".owner-edit").removeClass("d-none").show();
        $(".owner-username-edit").removeClass("d-none").show();
        $("#deleteColumn").removeClass("d-none").show();
        $(".delete-vehicle-btn").removeClass("d-none").show();
        $("#finishEditVehicleBtn").removeClass("d-none").show();
        $("#cancelEditBtn").removeClass("d-none").show();
        
        // Hide
        $(".plate-number-display").hide();
        $(".make-display").hide();
        $(".model-display").hide();
        $(".owner-display").hide();
        $(".owner-username-display").hide();
        $("#editVehicleBtn").hide();
    },

    // Hide edit fields
    hideEdit() {
        // Hide
        $(".plate-number-edit").addClass("d-none").hide();
        $(".make-edit").addClass("d-none").hide();
        $(".model-edit").addClass("d-none").hide();
        $(".owner-edit").addClass("d-none").hide();
        $(".owner-username-edit").addClass("d-none").hide();
        $("#deleteColumn").addClass("d-none").hide();
        $(".delete-vehicle-btn").addClass("d-none").hide();
        $("#finishEditVehicleBtn").addClass("d-none").hide();
        $("#cancelEditBtn").addClass("d-none").hide();

        // Show
        $(".plate-number-display").show();
        $(".make-display").show();
        $(".model-display").show();
        $(".owner-display").show();
        $(".owner-username-display").show();
        $("#editVehicleBtn").show();
    },

    // Get edited value
    getInput() {
        // Set an array to store value for each row
        let editedVehicles = [];

        // Loop through each row
        $("#vehicleTableBody tr").each(function() {
            const row = $(this);

            // Get original plate number
            const originalPlateNumber = row.find(".plate-number-display").text();

            // Get edited values
            const newPlateNumber = row.find(".plate-number-edit").val().trim().toUpperCase().replace(/\s/g, '');
            let newMake = row.find(".make-edit").val().trim();
            let newModel = row.find(".model-edit").val().trim();
            let newOwner = row.find(".owner-edit").val().trim();
            const newOwnerUsername = row.find(".owner-username-edit").val().trim();

            // Format inputs
            newMake = newMake.charAt(0).toUpperCase() + newMake.slice(1);
            newModel = newModel.charAt(0).toUpperCase() + newModel.slice(1);
            newOwner = newOwner.charAt(0).toUpperCase() + newOwner.slice(1);

            // Store inputs in an object
            const editedVehiclesRow = {
                originalPlateNumber: originalPlateNumber,
                plateNumber: newPlateNumber,
                make: newMake,
                model: newModel,
                owner: newOwner,
                ownerUsername: newOwnerUsername
            };

            // Push row to array
            editedVehicles.push(editedVehiclesRow);
        })

        // Return edited vehicles details
        return editedVehicles;
    },

    validateInput(inputs) {
        let valid = true;

        // Loop through the inputs array
        inputs.forEach(row => {
            // Check all fields are filled
            for(let key in row) {
                if (row[key] === "") {
                    alert("Please fill in all fields.");
                    valid = false;
                }
            }

            // Check plate number (special characters)
            if (containSpecialChars(row.plateNumber)) {
                alert(`Plate number should not contain special character. Invalid plate number: ${row.plateNumber}`);
                valid = false;
            }

            // Get a list of existing plate number
            let plateNumbers = [];
            vehicles.forEach(vehicle => {
                plateNumbers.push(vehicle.plateNumber);
            })

            // Check plate number (duplicate)
            if ((plateNumbers.includes(row.plateNumber)) && (row.plateNumber !== row.originalPlateNumber)) {
                alert(`Plate number "${row.plateNumber}" is duplicate.`);
                valid = false;
            }

            // Get list of username from auth.js
            let usernameList = [];
            users.forEach(user => {
                usernameList.push(user.username);
            })

            // Check username
            if (!(usernameList.includes(row.ownerUsername))) {
                alert(`Username "${row.ownerUsername}" not found.`);
                valid = false;
            }

            if (row.ownerUsername === "Admin") {
                alert('Username should not be "Admin".');
                valid = false;
            }
        })

        // Return true if pass all check
        return valid;
    },

    updateVehicles(inputs) {
        // Loop through the inputs array
        inputs.forEach(row => {
            // Use plate number to find index
            const vehicleIndex = vehicles.findIndex(vehicle => vehicle.plateNumber === row.originalPlateNumber);
            
            if (vehicleIndex !== -1) {
                // Update to vehicles array
                vehicles[vehicleIndex].plateNumber = row.plateNumber;
                vehicles[vehicleIndex].make = row.make;
                vehicles[vehicleIndex].model = row.model;
                vehicles[vehicleIndex].owner = row.owner;
                vehicles[vehicleIndex].ownerUsername = row.ownerUsername;
            }
        })

        // Update local storage
        saveVehiclesToLocal();

        // Clear search query and search bar
        currentSearchPlateNumber = "";
        $("#searchBar").val("");
        $("#cleanSearchBtn").hide();

        // Update display
        showVehicles.displayVehicles(vehicles);
    },

    cancelEdit() {
        // Reset and hide edit fields
        editVehicle.hideEdit();

        // Restore vehicle
        vehicles = JSON.parse(JSON.stringify(this.backupVehicles));
        this.backupVehicles = null;

        // Update display
        const searchResult = searchFunction.getSearchResult(currentSearchPlateNumber);
        showVehicles.displayVehicles(searchResult);

        // Update local storage
        saveVehiclesToLocal();
    },

    launcher() {
        // Edit icon click
        $("#editVehicleBtn").on("click", function() {
            editVehicle.storeBackup();
            editVehicle.showEdit();
        }); 

        // Finish editing button click
        $("#finishEditVehicleBtn").on("click", function() {
            // Get and validate input
            const editedVehicles = editVehicle.getInput();
            const valid = editVehicle.validateInput(editedVehicles);

            // Finish edit if all input valid
            if (valid) {
                editVehicle.updateVehicles(editedVehicles);
                editVehicle.hideEdit();
            }
        });

        // Cancel button click
        $("#cancelEditBtn").on("click", function() {
            editVehicle.cancelEdit();
        })
    }
};

// Delete vehicle function
const deleteVehicle = {
    // Function to remove selected vehicle from array
    removeVehicle(plateNumber) {
        // Find index of plate number in vehicles array
        const vehicleIndex = vehicles.findIndex(vehicle => vehicle.plateNumber === plateNumber);

        if (vehicleIndex !== -1) {
            // Remove vehicle from array
            vehicles.splice(vehicleIndex, 1);
        }

        // Update local storage
        saveVehiclesToLocal();
    },

    launcher() {
        $("#vehicleTableBody").off("click", ".delete-vehicle-btn").on("click", ".delete-vehicle-btn", function() {
            // Get vehicle
            const row = $(this).closest("tr");
            const selectedPlateNumber = row.find(".plate-number-display").text();
            
            // Confirm deletion
            const confirmDelete = confirm(`Are you sure you want to delete vehicle ${selectedPlateNumber} ?`);

            // Delete vehicle
            if (confirmDelete) {
                deleteVehicle.removeVehicle(selectedPlateNumber);

                // Update display
                const searchResult = searchFunction.getSearchResult(currentSearchPlateNumber);
                showVehicles.displayVehicles(searchResult);
                editVehicle.showEdit();
            }
        });
    }
};

// View buttons click to navigate
function viewBtnNavigate() {
    // View service history button
    $("#vehicleTableBody").on("click", ".view-service-history-btn", function() {
        // Get plate number
        const row = $(this).closest("tr");
        const selectedPlateNumber = row.find(".plate-number-display").text();

        // Store plate number to session storage
        sessionStorage.setItem("selectedPlateNumber", selectedPlateNumber);

        // Navigate to service history page
        window.location.href = "service-history.html";
    });

    // View digital inspection report button
    $("#vehicleTableBody").on("click", ".view-inspection-report-btn", function() {
        // Get plate number
        const row = $(this).closest("tr");
        const selectedPlateNumber = row.find(".plate-number-display").text();

        // Store plate number to session storage
        sessionStorage.setItem("selectedPlateNumber", selectedPlateNumber);

        // Navigate to inspection report page
        window.location.href = "inspection-report.html";
    });
}

// Run
$(document).ready(function() {
    // Load latest vehicles array
    getLatestVehicles();

    // Show vehicles
    const filteredVehicles = showVehicles.getVehicles();
    showVehicles.displayVehicles(filteredVehicles);

    // Activate functions
    searchFunction.displaySearchResult();
    addVehicle.launcher();
    editVehicle.launcher();
    deleteVehicle.launcher();
    viewBtnNavigate();
});