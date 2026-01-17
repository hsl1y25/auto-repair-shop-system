// Display all information 
const pageInitializer = {
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
        $(".plate-number-display").text(vehicle.plateNumber);
        $(".make-display").text(vehicle.make);
        $(".model-display").text(vehicle.model);
        $("#ownerDisplay").text(vehicle.owner);
        $("#ownerUsernameDisplay").text(vehicle.ownerUsername);
    },

    // Function to sort reports (latest first)
    sortReports() {
        // Get array of reports
        const selectedVehicle = this.getVehicle();
        const reports = selectedVehicle.digitalInspectionReport;

        // Sort reports
        const sortedReports = reports.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Update to local storage
        selectedVehicle.digitalInspectionReport = sortedReports;
        saveVehiclesToLocal();
    },

    // Function to apply result class based on value
    applyResultClass(element, value) {
        // Remove existing classes
        element.removeClass('pass fail na');
        
        // Apply class based on value
        const lowerValue = value.toLowerCase();
        if (lowerValue === 'pass') {
            element.addClass('pass');
        } else if (lowerValue === 'fail') {
            element.addClass('fail');
        } else if (lowerValue === 'na' || lowerValue === 'n/a') {
            element.addClass('na');
        }
    },

    // Function to display latest inspection report
    displayLatestReport(vehicle) {
        // Get latest report
        const latestReport = vehicle.digitalInspectionReport[0];

        // If no report
        if (latestReport === undefined) {
            $("#latestReportContainer").addClass("d-none").hide();
            $("#noReportDisplay").removeClass("d-none").show();
            $("#previousReportTitle").addClass("d-none").hide();
            $("#previousReportsPlaceholder").text("");
            return false;
        }

        // Display report
        $("#latestReportContainer").removeClass("d-none").show();
        $("#noReportDisplay").addClass("d-none").hide();
        $("#previousReportTitle").removeClass("d-none").show();
        $("#previousReportsPlaceholder").text("");

        $(".latest-report-date").text(latestReport.date);
        $("#latestReportTechnician").text(latestReport.technician);
        $("#latestComments").text(latestReport.comments)
        
        // Display all parts 
        const parts = latestReport.checkedParts;

        $("#latestEngineResult").text(parts.engine);
        this.applyResultClass($("#latestEngineResult"), parts.engine);

        $("#latestTransmissionResult").text(parts.transmission);
        this.applyResultClass($("#latestTransmissionResult"), parts.transmission);

        $("#latestClutchResult").text(parts.clutch);
        this.applyResultClass($("#latestClutchResult"), parts.clutch);

        $("#latestSteeringMechanismResult").text(parts.steeringMechanism);
        this.applyResultClass($("#latestSteeringMechanismResult"), parts.steeringMechanism);

        $("#latestHornResult").text(parts.horn);
        this.applyResultClass($("#latestHornResult"), parts.horn);

        $("#latestWipersResult").text(parts.wipers);
        this.applyResultClass($("#latestWipersResult"), parts.wipers);

        $("#latestRearVisionMirrorsResult").text(parts.rearVisionMirrors);
        this.applyResultClass($("#latestRearVisionMirrorsResult"), parts.rearVisionMirrors);

        $("#latestLightingResult").text(parts.lighting);
        this.applyResultClass($("#latestLightingResult"), parts.lighting);

        $("#latestBrakeResult").text(parts.brake);
        this.applyResultClass($("#latestBrakeResult"), parts.brake);

        $("#latestTiresResult").text(parts.tires);
        this.applyResultClass($("#latestTiresResult"), parts.tires);

        $("#latestEmergencyEquipmentsResult").text(parts.emergencyEquipments);
        this.applyResultClass($("#latestEmergencyEquipmentsResult"), parts.emergencyEquipments);

        // Return true if latest report exist
        return true;
    },

    // Function to get result class name (pass, fail, na)
    getResultClass(result) {
        if (result === "PASS") {
            return "pass";
        } else if (result === "FAIL") {
            return "fail";
        } else if (result === "N/A") {
            return "na";
        }
        return "";
    },

    // Function to display previous inspection report
    displayPreviousReport(vehicle) {
        // Get all report except the latest one
        const previousReports = vehicle.digitalInspectionReport.slice(1);

        // If no previous report
        if (previousReports.length === 0) {
            $("#previousReportsPlaceholder").html(`<div class="text-center fs-3 mb-3 text-secondary">No report</div>`);
            return;
        }

        // Set html code for each previous report
        let previousReportsHtml = "";

        previousReports.forEach((report, index) => {
            const parts = report.checkedParts;
            const reportId = `reportDetails${index}`;

            previousReportsHtml += `
                <div class="report-container shadow rounded-3" data-report-id="${index}">
                    <!--Header-->
                    <div class="header-container report-header px-3 py-2 rounded-bottom-3" data-bs-toggle="collapse" data-bs-target="#${reportId}" aria-expanded="false" aria-controls="${reportId}">
                        <div class="fs-4 fw-bold d-flex justify-content-between">
                            <div>${report.date}</div>

                            <div class="d-flex gap-3">
                                <div class="download-report-btn btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Download">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                                    </svg>
                                </div>

                                <div class="delete-report-btn btn btn-danger d-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                    </svg>
                                </div>

                                <div class="collapse-icon collapsed">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--Details-->
                    <div class="collapse" id="${reportId}">
                        <div class="bg-white rounded-bottom-3 p-4">
                            <!--Upper section-->
                            <div class="row g-2">
                                <div class="col-12 col-lg-6">
                                    <span class="fw-semibold">Inspection Date: </span>
                                    <span>${report.date}</span>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <span class="fw-semibold">Plate Number: </span>
                                    <span>${vehicle.plateNumber}</span>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <span class="fw-semibold">Make: </span>
                                    <span>${vehicle.make}</span>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <span class="fw-semibold">Model: </span>
                                    <span>${vehicle.model}</span>
                                </div>

                                <div class="col-12 col-lg-6">
                                    <span class="fw-semibold">Technician: </span>
                                    <span>${report.technician}</span>
                                </div>
                            </div>
                            
                            <!--Title-->
                            <div class="mt-5 mb-3 fs-5 fw-bold">Inspection Result:</div>

                            <!--Inspection Result-->
                            <div class="row g-3">
                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Engine</div>
                                        <div class="engine-result px-3 py-2 rounded-pill ${this.getResultClass(parts.engine)}">${parts.engine}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Transmission</div>
                                        <div class="transmission-result px-3 py-2 rounded-pill ${this.getResultClass(parts.transmission)}">${parts.transmission}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Clutch</div>
                                        <div class="clutch-result px-3 py-2 rounded-pill ${this.getResultClass(parts.clutch)}">${parts.clutch}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Steering Mechanism</div>
                                        <div class="steering-mechanism-result px-3 py-2 rounded-pill ${this.getResultClass(parts.steeringMechanism)}">${parts.steeringMechanism}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Horn</div>
                                        <div class="horn-result px-3 py-2 rounded-pill ${this.getResultClass(parts.horn)}">${parts.horn}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Wipers</div>
                                        <div class="wipers-result px-3 py-2 rounded-pill ${this.getResultClass(parts.wipers)}">${parts.wipers}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Rear Vision Mirrors</div>
                                        <div class="rear-vision-mirrors-result px-3 py-2 rounded-pill ${this.getResultClass(parts.rearVisionMirrors)}">${parts.rearVisionMirrors}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Lighting</div>
                                        <div class="lighting-result px-3 py-2 rounded-pill ${this.getResultClass(parts.lighting)}">${parts.lighting}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Brake</div>
                                        <div class="brake-result px-3 py-2 rounded-pill ${this.getResultClass(parts.brake)}">${parts.brake}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Tires</div>
                                        <div class="tires-result px-3 py-2 rounded-pill ${this.getResultClass(parts.tires)}">${parts.tires}</div>
                                    </div>
                                </div>

                                <div class="col-12 col-md-6 col-xl-4">
                                    <div class="result-component border border-secondary border-2 d-flex justify-content-between align-items-center p-2 rounded-3">
                                        <div>Emergency Equipments</div>
                                        <div class="emergency-equipments-result px-3 py-2 rounded-pill ${this.getResultClass(parts.emergencyEquipments)}">${parts.emergencyEquipments}</div>
                                    </div>
                                </div>
                            </div>

                            <!--Comments-->
                            <div class="mt-5">
                                <div class="fs-5 fw-bold mb-1">Comments:</div>
                                <div>${report.comments}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Insert html code to placeholder
        $("#previousReportsPlaceholder").html(previousReportsHtml);
    },

    // Function to rotate collapse icon for previous report
    runCollapseIcon() {
        $(".collapse").on("show.bs.collapse", function() {
            $(this).prev(".report-header").find(".collapse-icon").removeClass("collapsed").addClass("not-collapsed");
        });

        $(".collapse").on("hide.bs.collapse", function() {
            $(this).prev(".report-header").find(".collapse-icon").removeClass("not-collapsed").addClass("collapsed");
        });
    },

    // Display edit buttons for admin
    displayEditButtons() {
        // Check login status
        const user = showVehicles.checkLoginStatus();

        // Display if admin
        if (user.permission === "admin") {
            $("#addReportIcon").removeClass("d-none");

            if (this.getVehicle().digitalInspectionReport.length > 0) {
                $("#deleteReportIcon").removeClass("d-none");
            } else {
                $("#deleteReportIcon").addClass("d-none");
            }
        }
    },

    // Run page initializer
    launcher() {
        this.sortReports();
        const selectedVehicle = this.getVehicle();
        this.displayVehicleDetail(selectedVehicle);
        this.displayEditButtons();
        const hasLatest = this.displayLatestReport(selectedVehicle);

        // Try to show previous report if latest exist
        if (hasLatest) {
            this.displayPreviousReport(selectedVehicle);
            this.runCollapseIcon();
        }
    }
};

// Add report function
const addReport = {
    clearError() {
        $("#dateError").text("");
        $("#modalErrorMessage").text("");
    },

    resetForm() {
        this.initializeModal();
        $("#selectTechnician").val("");
        $("#commentsInput").val("");
    },

    initializeModal() {
        // Set today date as default in date input
        const todayDate = formatDate(new Date());
        $("#dateInput").val(todayDate);

        // Create checked parts in modal
        const parts = [
            { id: 'engine', label: 'Engine' },
            { id: 'transmission', label: 'Transmission' },
            { id: 'clutch', label: 'Clutch' },
            { id: 'steeringMechanism', label: 'Steering Mechanism' },
            { id: 'horn', label: 'Horn' },
            { id: 'wipers', label: 'Wipers' },
            { id: 'rearVisionMirrors', label: 'Rear Vision Mirrors' },
            { id: 'lighting', label: 'Lighting' },
            { id: 'brake', label: 'Brake' },
            { id: 'tires', label: 'Tires' },
            { id: 'emergencyEquipments', label: 'Emergency Equipments' }
        ];

        let partHtml = "";
        parts.forEach(part => {
            partHtml += `
                <div class="col-12 col-md-6">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">${part.label}</label>
                        <div>
                            <div class="btn-group btn-group-sm">
                                <input type="radio" class="btn-check" name="${part.id}" id="${part.id}Pass" value="PASS">
                                <label class="btn btn-outline-success" for="${part.id}Pass">Pass</label>
                                
                                <input type="radio" class="btn-check" name="${part.id}" id="${part.id}Fail" value="FAIL">
                                <label class="btn btn-outline-danger" for="${part.id}Fail">Fail</label>
                                
                                <input type="radio" class="btn-check" name="${part.id}" id="${part.id}Na" value="N/A">
                                <label class="btn btn-outline-secondary" for="${part.id}Na">N/A</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#modalCheckedParts").html(partHtml);
    },

    getInputs() {
        // Get inputs
        const date = $("#dateInput").val();
        const technician = $("#selectTechnician").val();
        let comments = $("#commentsInput").val().trim();

        // Get checked parts
        let checkedParts = {};
        const parts = ['engine', 'transmission', 'clutch', 'steeringMechanism', 'horn', 'wipers', 'rearVisionMirrors', 'lighting', 'brake', 'tires', 'emergencyEquipments'];

        parts.forEach(part => {
            const selectedStatus = $(`input[name="${part}"]:checked`).val();
            checkedParts[part] = selectedStatus;
        });

        // Replace comments with No comments if not filled
        if (comments === "") {
            comments = "No comment.";
        }

        // Use an object to store inputs value
        const inputs = {
            date: date,
            technician: technician,
            checkedParts: checkedParts,
            comments: comments
        };

        // Return inputs
        return inputs;
    },

    validateInputs(inputs) {
        // Check all field are filled 
        if (!inputs.date || !inputs.technician) {
            $("#modalErrorMessage").text("Please fill in all fields.");
            return false;
        }

        for (let key in inputs.checkedParts) {
            if (inputs.checkedParts[key] === undefined) {
                $("#modalErrorMessage").text("Please fill in all fields.");
                return false;
            }
        }

        // Check date
        if (new Date(inputs.date) > new Date()) {
            $("#dateError").text("Inspection date should not be in the future.");
            return false;
        }

        // Return true if pass all 
        return true;
    },

    updateReport(report) {
        // Get vehicle
        const vehicle = pageInitializer.getVehicle();

        // Add new report to the beginning of array
        vehicle.digitalInspectionReport.unshift(report);

        // Update display and local storage
        saveVehiclesToLocal();
        pageInitializer.launcher();
    },

    launcher() {
        addReport.initializeModal();

        // Add icon clicked
        $("#addReportIcon").on("click", function() {
            $("#addReportModal").modal("show");
        });

        // Clear button in modal
        $("#modalClearReportBtn").on("click", function() {
            addReport.resetForm();
            addReport.clearError();
        })

        // Add button in modal
        $("#modalAddReportBtn").on("click", function() {
            // Clear error message
            addReport.clearError();

            // Get input and check
            const report = addReport.getInputs();
            const valid = addReport.validateInputs(report);

            // Update report if input correct
            if (valid) {
                addReport.updateReport(report);
                $("#addReportModal").modal("hide");
                addReport.resetForm();
            }
        })
    }
};

// Delete report function  
const deleteReport = {
    enterDeleteMode() {
        $(".delete-report-btn").removeClass("d-none");
        $("#deleteReportIcon").hide();
        $("#finishBtn").removeClass("d-none");
    },

    exitDeleteMode() {
        $(".delete-report-btn").addClass("d-none");
        $("#deleteReportIcon").show();
        $("#finishBtn").addClass("d-none");
    },

    removeReport(index, container) {
        // Get vehicle
        const vehicle = pageInitializer.getVehicle();

        // Fade out animation
        if (container) {
            container.fadeOut("300", () => {
                // Remove report
                if (index >= 0 && index < vehicle.digitalInspectionReport.length) {
                    vehicle.digitalInspectionReport.splice(index, 1);
                }

                // Update display and local storage
                saveVehiclesToLocal();
                pageInitializer.launcher();
                this.enterDeleteMode();
            });
        }
    },

    launcher() {
        // Delete icon click
        $("#deleteReportIcon").on("click", function() {
            deleteReport.enterDeleteMode();
        });

        // Delete buttons click
        // Latest report delete button click
        $("#latestReportContainer").on("click", ".delete-report-btn", function() {
            // Confirm deletion
            const confirmDelete = confirm("Are you sure you want to delete?");

            if (confirmDelete) {
                const container = $("#latestReportContainer")
                deleteReport.removeReport(0, container);
            }
        });

        // Previous report delete button click
        $("#previousReportsPlaceholder").on("click", ".delete-report-btn", function() {
            // Get report index
            const container = $(this).closest(".report-container");
            const reportIndex = parseInt(container.data("report-id")) + 1;

            // Confirm deletion
            const confirmDelete = confirm("Are you sure you want to delete?");

            if (confirmDelete) {
                deleteReport.removeReport(reportIndex, container);
            }
        });

        // Finish button click
        $("#finishBtn").on("click", function() {
            deleteReport.exitDeleteMode();
        });
    }
}

// Download report function
const downloadReport = {
    downloadHtml(index) {
        const vehicle = pageInitializer.getVehicle();
        const report = vehicle.digitalInspectionReport[index];
        const parts = report.checkedParts;

        // Create report content
        const reportForDownload = `
    =====================================================================
                      TWELVE AUTO - INSPECTION REPORT       
    =====================================================================

    Inspection Date:  ${report.date}
    Plate Number: ${vehicle.plateNumber}
    Make: ${vehicle.make}
    Model: ${vehicle.model}
    Technician: ${report.technician}

    ---------------------------------------------------------------------
     INSPECTION RESULT
    ---------------------------------------------------------------------
    Engine: ${parts.engine}
    Transmission: ${parts.transmission}
    Clutch: ${parts.clutch}
    Steering Mechanism: ${parts.steeringMechanism}
    Horn: ${parts.horn}
    Wipers: ${parts.wipers}
    Rear Vision Mirrors: ${parts.rearVisionMirrors}
    Lighting: ${parts.lighting}
    Brake: ${parts.brake}
    Tires: ${parts.tires}
    Emergency Equipments: ${parts.emergencyEquipments}

    ---------------------------------------------------------------------
     COMMENTS 
    ---------------------------------------------------------------------
    ${report.comments}

    =====================================================================
        `; 

        // Download
        const blob = new Blob([reportForDownload], {type: "text/plain"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Inspection_Report_${vehicle.plateNumber}_${report.date}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 

    launcher() {
        // Download button click (latest)
        $("#latestReportContainer").on("click", ".download-report-btn", function(e) {
            e.stopPropagation();
            downloadReport.downloadHtml(0);
        });

        // Download button click (previous)
        $("#previousReportsPlaceholder").on("click", ".download-report-btn", function(e) {
            e.stopPropagation();

            // Get report index
            const reportIndex = parseInt($(this).closest(".report-container").data("report-id")) + 1;

            // Download
            downloadReport.downloadHtml(reportIndex);
        });
    }
};

// Run
$(document).ready(function() {
    // Run functions
    pageInitializer.launcher();
    addReport.launcher();
    deleteReport.launcher();
    downloadReport.launcher();
});