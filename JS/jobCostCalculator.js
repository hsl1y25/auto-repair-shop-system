// Search function in modal
const modalFunctions = {
    // Set variables
    userSearchQuery: "",
    selectedParts: [],

    // Display parts in modal
    modalDisplayParts(parts) {
        // Clear previous no result message
        $("#modalNoResult").text("");

        // If no result
        if (parts.length === 0) {
            $("#modalNoResult").text("No result");
        }

        parts.forEach(part => {
            // Get status
            const partStatus = filterFunction.getStatus(part.quantity);

            // Set html code for each row
            const partRow = $(`
                <tr>
                    <td>
                        <input class="part-selector form-check-input border-dark" type="checkbox" value="${part.name}" data-part-name="${part.name}"> 
                    </td>
                    <td>
                        <input class="used-quantity quantity-edit-field p-1 rounded-2 border border-dark" type="number" value="1" min="0"> 
                    </td>
                    <td><img class="table-img" src="${part.image}" alt="${part.name}"></td>
                    <td>${part.name}</td>
                    <td>${part.category}</td>
                    <td>${part.cost}</td>
                    <td>${part.quantity}</td>
                    <td><span class="${partStatus.stockStatusData} px-4 py-2 rounded-pill">${partStatus.stockStatusText}</span></td>
                </tr>
            `);

            // Append to the table
            $("#modalDisplayParts").append(partRow);
        })
    },

    // Get search result function
    getSearchResult(searchQuery) {
        // Set default search result
        let searchResult = parts;

        // Filter by search query
        if (searchQuery !== "") {
            searchResult = searchResult.filter(part =>
                part.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Return search result
        return searchResult;
    },

    // Display search result function
    displaySearchResult() {
        // Search bar enter
        $("#modalSearchBar").off("keypress").on("keypress", function(e) {
            if (e.which === 13) {
                e.preventDefault();

                // Get user search query
                const userSearchQuery = $(this).val().trim();

                // Get search result
                const searchResult = modalFunctions.getSearchResult(userSearchQuery);

                // Empty the table
                $("#modalDisplayParts").empty();

                // Display result
                modalFunctions.modalDisplayParts(searchResult);

                // Show or hide clear button
                if (userSearchQuery.trim() !== "") {
                    $("#modalCleanSearchBtn").show();
                } else {
                    $("#modalCleanSearchBtn").hide();
                }
            }
        })

        // Clean search button
        $("#modalCleanSearchBtn").off("click").on("click", function() {
            $("#modalSearchBar").val("");
            modalFunctions.userSearchQuery = "";
            $("#modalDisplayParts").empty();
            modalFunctions.modalDisplayParts(parts);
            $("#modalCleanSearchBtn").hide();
        })
    },

    // Clear inputs function
    clearInput() {
        // Reset checkbox
        $(".part-selector").prop("checked", false);

        // Reset used quantity to 1
        $(".used-quantity").val(1);

        // Clear error message
        $("#quantityError").text("").hide();
    },

    // Function to get selected parts in modal
    getSelectedParts() {
        // Reset selected parts
        this.selectedParts = [];

        let hasError = false;

        // Track parts with checked checkbox
        $('#modalDisplayParts input[type="checkbox"]:checked').each(function() {
            // Get part name
            const partName = $(this).data("part-name");

            // Get used quantity
            const usedQuantity = parseInt($(this).closest("tr").find(".used-quantity").val());

            // Check used quantity input
            if (isNaN(usedQuantity)) {
                $("#quantityError").text("Please enter a number.").show();
                hasError = true;
                return false;
            }

            if (usedQuantity === 0) {
                $("#quantityError").text("Used quantity must be at least one.").show();
                hasError = true;
                return false;
            }

            if (usedQuantity < 0) {
                $("#quantityError").text("Used quantity cannot be negative.").show();
                hasError = true;
                return false;
            }

            // Get part detail
            const part = parts.find(p => p.name === partName);

            // Calculate subtotal
            const subtotal = part.cost * usedQuantity;

            // Append the parts into selected parts array
            if (part) {
                modalFunctions.selectedParts.push({
                    name: part.name,
                    usedQuantity: usedQuantity,
                    cost: part.cost,
                    subtotal: subtotal
                });
            }
        })

        // Return selected parts array
        return hasError ? null : this.selectedParts;
    },

    // Function to display selection parts from modal
    displaySelectedParts() {
        // Clear previous error message
        $("#quantityError").text("").hide();

        // Get selected parts from modal
        const selectedParts = this.getSelectedParts();

        // Return if has error
        if (selectedParts === null) {
            return;
        }

        // Clear the table
        $("#selectedPartsTableBody").empty();

        // Display selected parts 
        this.selectedParts.forEach(selectedPart => {
            // Set html code
            const selectedPartRow = $(`
                <tr>
                    <th class="fw-normal">${selectedPart.name}</th>
                    <th class="fw-normal">${selectedPart.usedQuantity}</th>
                    <th class="fw-normal">${selectedPart.cost}</th>
                    <th class="fw-normal">${selectedPart.subtotal}</th>
                </tr>        
            `);

            // Append to the table
            $("#selectedPartsTableBody").append(selectedPartRow);
        });

        // Show the table
        if (selectedParts.length !== 0) {
            $("#selectedPartsTable").removeClass("d-none").show();
        } else {
            $("#selectedPartsTable").hide();
        }
        
        // Close the modal
        $("#partsModal").modal("hide");
    },

    // Run modal
    runModal() {
        // Browse parts button (open modal)
        $("#browsePartsBtn").on("click", function() {
            $("#partsModal").modal("show");

            if ($("#modalDisplayParts").is(":empty")) {
                modalFunctions.modalDisplayParts(parts);
            }
        });

        // Run search bar
        this.displaySearchResult();

        // Clear button
        $("#modalClearBtn").on("click", function() {
            modalFunctions.clearInput();
        })

        // Confirm selection
        $("#modalConfirmBtn").on("click", function() {
            modalFunctions.displaySelectedParts();
        })
    }
}

// Add row function
function addRow() {
    // Set row html 
    const addedRow = $(`
        <tr>
            <td class="col-8">
                <input class="chargeDescription w-100 border border-dark p-2 rounded-2" type="text">
            </td>
            <td class="col-2">
                <input class="chargeAmount w-100 border border-dark p-2 rounded-2" type="number" min="0">
            </td>
        </tr>    
    `);

    // Append row to the table
    $("#additionalChargesRow").append(addedRow);
}

// Calculate total job cost functions
const calculator = {
    // Function to clear all error message
    clearError() {
        // Clear error message
        $("#laborHoursError").text("").hide();
        $("#laborRateError").text("").hide();
        $("#chargeAmountError").text("").hide();     
        $("#calcError").text("").hide();
    },

    // Function to clear previous output
    clearOutput() {
        $("#outputArea").text("");
    },

    // Function to reset all input 
    resetInput() {
        // Parts used input
        modalFunctions.clearInput();
        $("#selectedPartsTableBody").text("");
        $("#selectedPartsTable").hide();
        modalFunctions.selectedParts = [];

        // Labor cost input
        $("#laborHours").val(0);
        $("#laborRate").val(0);

        // Additional charges input
        $(".chargeDescription").val("");
        $(".chargeAmount").val("");

        // Added row
        $("#additionalChargesRow").text("");
        addRow();
    },

    // Function to get all user input from input fields
    getInput() {
        // Get inputs
        const userInput = {
            selectedParts: modalFunctions.selectedParts,
            laborHours: parseFloat($("#laborHours").val()),
            laborRate: parseFloat($("#laborRate").val()),
            additionalCharges: []
        };

        // Get details for each additional charges row
        $("#additionalChargesRow tr").each(function() {
            const description = $(this).find('input[type="text"]').val();
            const amount = $(this).find('input[type="number"]');

            // Append to the array if both filled
            if (description && amount) {
                userInput.additionalCharges.push({
                    description: description,
                    amount: parseFloat((amount).val())
                });
            }
        });

        // Return user input as object
        return userInput;
    },

    // Function to validate user input
    validateInput(input) {
        // Check labor hours
        if (isNaN(input.laborHours)) {
            $("#laborHoursError").text("Please enter a number.").show();
            return false;
        }

        if (input.laborHours < 0) {
            $("#laborHoursError").text("Labor hours should not be negative.").show();
            return false;
        }
        
        // Check labor rate
        if (isNaN(input.laborRate)) {
            $("#laborRateError").text("Please enter a number.").show();
            return false;
        }

        if (input.laborRate < 0) {
            $("#laborRateError").text("Labor rate should not be negative.").show();
            return false;
        }

        // Check amount
        for(let i = 0; i < input.additionalCharges.length; i++) {
            const charge = input.additionalCharges[i];

            if (isNaN(charge.amount)) {
                $("#chargeAmountError").text("Please enter a number for amount.").show();
                return false;
            }

            if (charge.amount < 0) {
                $("#chargeAmountError").text("Amount should not be negative.").show();
                return false;
            }
        }

        // Check if at least one field is filled
        if (input.selectedParts.length === 0 && input.laborHours === 0 && input.laborRate === 0 && input.additionalCharges.length === 0) {
            $("#calcError").text("Please fill in at least one field.").show();
            return false;
        }

        // Return true if pass all check
        return true;
    },

    // Function to calculate total cost
    calcCost(input) {
        // Get total parts cost
        let totalPartsCost = 0;
        input.selectedParts.forEach(part => {
            totalPartsCost += part.subtotal;
        });
        
        // Get labor cost
        const totalLaborCost = input.laborHours * input.laborRate;
        const laborCostCalculation = `${input.laborHours} hours x RM ${input.laborRate}/hour = RM ${totalLaborCost}`;
        
        // Get total additional charges
        let totalAdditionalCharges = 0;
        input.additionalCharges.forEach(charge => {
            totalAdditionalCharges += charge.amount;
        });

        // Calculate total job cost
        const totalJobCost = totalPartsCost + totalLaborCost + totalAdditionalCharges;

        // Return an object of result for display purpose
        const calcResult = {
            totalPartsCost: totalPartsCost,
            totalLaborCost: totalLaborCost,
            laborCostCalculation: laborCostCalculation,
            totalAdditionalCharges: totalAdditionalCharges,
            totalJobCost: totalJobCost
        };

        return calcResult;
    },

    // Function to display result in output field
    displayResult(input, resultObject) {
        // Parts cost html code
        const partCostHtml = $(`
            <div id="partCostResult">
                <div class="fs-4 fw-semibold text-center bg-secondary text-white">Parts Cost</div>
                <div class="table-responsive p-0" style="max-height: 400px;">
                    <table class="table table-bordered">
                        <thead class="table-info sticky-top">
                            <tr>
                                <th>Part Name</th>
                                <th>Used Quantities</th>
                                <th>Cost (RM)</th>
                                <th>Subtotal (RM)</th>
                            </tr>
                        </thead>

                        <tbody id="partCostResultBody"></tbody>
                    </table>
                </div>
                <div class="fs-5 fw-semibold">Total Parts Cost: RM ${resultObject.totalPartsCost}</div>
            </div>        
        `);

        // Labor cost html code
        const laborCostHtml = $(`
            <div id="laborCostResult">
                <div class="fs-4 fw-semibold text-center bg-secondary text-white">Labor Cost</div>
                <div class="border p-2">${resultObject.laborCostCalculation}</div>
                <div class="fs-5 fw-semibold">Total Labor Cost: RM ${resultObject.totalLaborCost}</div>
            </div>    
        `);

        // Additional charges html code
        const additionalChargesHtml = $(`
            <div id="additionalChargesResult"> 
                <div class="fs-4 fw-semibold text-center bg-secondary text-white">Additional Charges</div>
                <div class="table-responsive p-0" style="max-height: 400px;">
                    <table class="table table-bordered">
                        <thead class="table-info sticky-top">
                            <tr>
                                <th>Charges</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody id="additionalChargesResultBody"></tbody>
                    </table>
                </div>
                <div class="fs-5 fw-semibold">Total Additional Charges: RM ${resultObject.totalAdditionalCharges}</div>
            </div>        
        `);

        // Total job cost html code
        const totalJobCostHtml = $(`
            <div class="fs-3 text-end text-primary fw-bold border-top border-secondary pt-2">Total Job Cost: RM ${resultObject.totalJobCost}</div>    
        `)
        
        // Check filled field
        let filledField = {
            parts: false,
            labor: false,
            additionalCharges: false
        }

        // Append html code to display result
        if (modalFunctions.selectedParts.length !== 0) {
            filledField.parts = true;
        }

        if (resultObject.totalLaborCost !== 0) {
            filledField.labor = true;       
        }

        if (resultObject.totalAdditionalCharges !== 0) {
            filledField.additionalCharges = true;   
        }

        if (filledField.parts || filledField.labor || filledField.additionalCharges) {
            // Reset input field and clear previous result
            this.resetInput();
            this.clearOutput();

            // Hide the result 
            $("#outputArea").hide();

            // Display new result
            if (filledField.parts) {
                $("#outputArea").append(partCostHtml);
            }

            if (filledField.labor) {
                $("#outputArea").append(laborCostHtml);
            }

            if (filledField.additionalCharges) {
                $("#outputArea").append(additionalChargesHtml);
            }

            $("#outputArea").append(totalJobCostHtml);
            
            // Fade in the result
            $("#outputArea").fadeIn(300);
        }

        // Display result in partCostResultBody
        input.selectedParts.forEach(selectedPart => {
            // Set html code
            const selectedPartRow = $(`
                <tr>
                    <th class="fw-normal">${selectedPart.name}</th>
                    <th class="fw-normal">${selectedPart.usedQuantity}</th>
                    <th class="fw-normal">${selectedPart.cost}</th>
                    <th class="fw-normal">${selectedPart.subtotal}</th>
                </tr>        
            `);

            // Append to the table
            $("#partCostResultBody").append(selectedPartRow);
        });

        // Display result in additionalChargesResultBody
        input.additionalCharges.forEach(charge => {
            // Set html code
            const additionalChargeRow = $(`
                <tr>
                    <th class="fw-normal">${charge.description}</th>
                    <th class="fw-normal">${charge.amount}</th>
                </tr>         
            `);

            // Append into table
            $("#additionalChargesResultBody").append(additionalChargeRow);
        });
    },

    // Run calculator
    runCalculator() {
        $("#calcBtn").on("click", function() {
            calculator.clearError();
            const userInput = calculator.getInput();
            const canCalc = calculator.validateInput(userInput);

            // Display result if input valid
            if (canCalc) {
                const infoToDisplay = calculator.calcCost(userInput);
                calculator.displayResult(userInput, infoToDisplay);
                
                // Animation (scroll to output part)
                $("html, body").animate({
                    scrollTop: $("#outputContainer").offset().top - 20
                }, 50);
            }
        });

        $("#resetBtn").on("click", function() {
            calculator.resetInput();
            calculator.clearError();
        });
    }
};

// Run
$(document).ready(function() {
    // Check permission
    checkAdmin();
    
    // Set output area minimum height
    const inputFieldsHeight = $("#inputFields").outerHeight();
    const outputTitleHeight = $("#outputTitle").outerHeight();
    $("#outputArea").css("min-height", inputFieldsHeight - outputTitleHeight + "px");

    // Run modal for browse parts
    modalFunctions.runModal();

    // Add row
    addRow();
    $("#addRowBtn").on("click", function() {
        addRow();
    });

    // Run calculator to get result
    calculator.runCalculator();
})