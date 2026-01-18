let parts;

// Function to get parts from local storage
function getPartsFromLocal() {
    const savedParts = localStorage.getItem("parts");

    if (savedParts) {
        // If local storage exist
        parts = JSON.parse(savedParts);
    } else {
        // Local storage not found, add sample data to local storage
        parts = [
            {
                category: "Lightings",
                name: "Left Headlight",
                image: "Images/Inventory/headlight-left.jpg",
                quantity: 20,
                cost: 850.00.toFixed(2)
            }, 
            {
                category: "Body",
                name: "Rear Bumper",
                image: "Images/Inventory/rear-bumper.jpg",
                quantity: 25,
                cost: 456.00.toFixed(2)
            },
            {
                category: "Lightings",
                name: "Right Head Light",
                image: "Images/Inventory/headlight-right.jpg",
                quantity: 0,
                cost: 850.00.toFixed(2)
            },
            {
                category: "Lightings",
                name: "Right Tail Light",
                image: "Images/Inventory/tail-light-right.jpg",
                quantity: 3,
                cost: 350.00.toFixed(2)
            },
            {
                category: "Tires",
                name: "Tire 17 inch",
                image: "Images/Inventory/tires-17.jpg",
                quantity: 36,
                cost: 510.00.toFixed(2)
            },
            {
                category: "Body",
                name: "Front Bumper",
                image: "Images/Inventory/front-bumper.jpg",
                quantity: 12,
                cost: 699.00.toFixed(2)
            },
            {
                category: "Lightings",
                name: "Left Tail Light",
                image: "Images/Inventory/tail-light-left.jpg",
                quantity: 16,
                cost: 350.00.toFixed(2)
            },
            {
                category: "Cooling",
                name: "A/C Control Panel",
                image: "Images/Inventory/ac-control-panel.jpg",
                quantity: 2,
                cost: 238.00.toFixed(2)
            },
            {
                category: "Tires",
                name: "Tire 14 inch",
                image: "Images/Inventory/tires-14.jpg",
                quantity: 0,
                cost: 369.00.toFixed(2)
            },
            {
                category: "Electrical",
                name: "Fuse Box",
                image: "Images/Inventory/fuse-box.jpg",
                quantity: 10,
                cost: 219.00.toFixed(2)
            }
        ];

        savePartsToLocal();
    }
}

// Function to update data to local storage
function savePartsToLocal() {
    localStorage.setItem("parts", JSON.stringify(parts));
}

// Filter
// Set filter variables
let selectedCategories = [];
let selectedAvailability = [];
let selectedPriceRange = {min: null, max: null};
let currentSearchQuery = "";

// Filter function
const filterFunction = {
    // Reset filter funtion
    resetFilter() {
        selectedCategories = [];
        selectedAvailability = [];
        selectedPriceRange = {min: null, max: null};

        $(".filter-btn").removeClass("selected");
        $(".price-input").val("");
    },

    // Clear error function
    clearError() {
        $("#priceRangeError").text("");
        $("#filterError").text("");
    },

    // Apply filter function
    applyFilter() {
        // Get price range input
        const min = $("#minPrice").val() ? parseFloat($("#minPrice").val()) : null;
        const max = $("#maxPrice").val() ? parseFloat($("#maxPrice").val()) : null;

        // Check at least one input
        if (selectedCategories.length === 0 && selectedAvailability.length === 0 && min === null && max === null) {
            $("#filterError").text("Please select at least one condition.");
            return;
        }

        // Check price range input
        if (min > max) {
            $("#priceRangeError").text("Min can't be bigger than max.");
            return;
        } else if (min < 0 || max < 0) {
            $("#priceRangeError").text("Price should not be negative.");
            return;
        } else {
            // Update price range
            selectedPriceRange.min = min;
            selectedPriceRange.max = max;

            // Update result (display)
            this.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);

            // Show remove filter option
            $("#removeFilterBtn").show();

            // Close filter menu
            $("#filterMenu").hide();

            // Change filter icon
            $("#filterIcon").html(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
            </svg>`);
        }
    },

    // Update display with filter variable
    updateResult(searchQuery, category, availability, priceRange) {
        // Set default filtered result
        let filteredParts = parts;

        // Filter by search query
        if (searchQuery && searchQuery.trim() !== "") {
            filteredParts = filteredParts.filter(part =>
                part.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (category.length > 0) {
            filteredParts = filteredParts.filter(part => 
                selectedCategories.includes(part.category)
            );
        }

        // Filter by availability
        if (availability.length > 0) {
            filteredParts = filteredParts.filter(part => {
                const availability = this.getStatus(part.quantity);
                return selectedAvailability.includes(availability.stockStatusData)
            });
        }

        // Filter by price range
        if (priceRange.min !== null) {
            filteredParts = filteredParts.filter(part => 
                part.cost >= priceRange.min
            );
        }
        if (priceRange.max !== null) {
            filteredParts = filteredParts.filter(part => 
                part.cost <= priceRange.max
            );
        }

        // Display result
        this.displayParts(filteredParts);
    },

    // Get part status
    getStatus(quantity) {
        // Get status
        if (quantity === 0) {
            return {
                stockStatusText: "Out of Stock",
                stockStatusData: "out-of-stock"
            }
        } else if (quantity <= 5) {
            return {
                stockStatusText: "Low Stock",
                stockStatusData: "low-stock"
            }           
        } else {
            return {
                stockStatusText: "In Stock",
                stockStatusData: "in-stock"
            }
        }
    },

    // Display parts in table
    displayParts(parts) {
        // Empty the table
        $("#inventoryTableBody").empty();

        // Clear previous no result display
        $("#noResultDisplay").text("");

        // If no parts found
        if (parts.length === 0) {
            $("#noResultDisplay").text("No part");
            return;
        }

        parts.forEach(part => {
            // Get status
            const partStatus = filterFunction.getStatus(part.quantity);

            // Set html code for each row
            const partRow = $(`
                <tr data-part-name="${part.name}">
                    <td><img class="table-img" src="${part.image}" alt="${part.name}"></td>
                    <td>${part.name}</td>
                    <td>${part.category}</td>
                    <td>
                        <span class="cost-display">${part.cost}</span>
                        <span>
                            <input class="cost-edit-field rounded-pill border border-primary d-none p-1" type="number" value="${part.cost}" min="0">
                            <span class="cost-edit-error text-danger small"></span>
                        </span>
                    </td>
                    <td>
                        <span class="quantity-display">${part.quantity}</span>
                        <span>
                            <input class="quantity-edit-field rounded-pill border border-primary d-none p-1" type="number" value="${part.quantity}" min="0">
                            <span class="quantity-edit-error text-danger small"></span>
                        </span>
                    </td>
                    <td><span class="${partStatus.stockStatusData} px-4 py-2 rounded-pill">${partStatus.stockStatusText}</span></td>
                    <td class="delete-part-btn d-none">
                        <div class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </div>
                    </td>
                </tr>
            `);

            // Append to the table
            $("#inventoryTableBody").append(partRow);
        })
    },

    // Run filter function
    runFilter() {
        // Search bar work when enter
        $("#searchBar").on("keypress", function(e) {
            if (e.which === 13) {
                e.preventDefault();
                currentSearchQuery = $(this).val();
                filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange)

                // Show or hide clear button
                if (currentSearchQuery.trim() !== "") {
                    $("#cleanSearchBtn").show();
                } else {
                    $("#cleanSearchBtn").hide();
                }
            }
        });

        // Clean search button
        $("#cleanSearchBtn").on("click", function() {
            $("#searchBar").val("");
            currentSearchQuery = "";
            filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);
            $("#cleanSearchBtn").hide();
        })

        // Show and close menu
        // Show filter menu
        $("#filterIcon").on("click", function(e) {
            e.stopPropagation();
            $("#filterMenu").show();
        });
        
        // Close filter menu (when clicking anywhere)
        $(document).on("click", function() {
            $("#filterMenu").hide();
        });

        // Avoid close filter menu when clicking inside
        $("#filterMenu").on("click", function(e) {
            e.stopPropagation();
        });

        // Close filter menu using close button
        $("#filterCloseBtn").on("click", function() {
            $("#filterMenu").hide();
        })

        // Filter buttons work (category, availability)
        // Category filter buttons
        $("#categoryFilters .filter-btn").on("click", function() {
            $(this).toggleClass("selected");   
            const category = $(this).data("category");   // Get clicked category

            if ($(this).hasClass("selected")) {
                // Add selected category to the array
                if (!selectedCategories.includes(category)) {
                    selectedCategories.push(category);
                }
            } else {
                // Remove category when not selected
                selectedCategories = selectedCategories.filter(item => item !== category);
            } 
        });

        // Availability filter buttons
        $("#availabilityFilter .filter-btn").on("click", function() {
            $(this).toggleClass("selected");   
            const availability = $(this).data("availability");   // Get clicked availability

            if ($(this).hasClass("selected")) {
                // Add selected availability to the array
                if (!selectedAvailability.includes(availability)) {
                    selectedAvailability.push(availability);
                }
            } else {
                // Remove category when not selected
                selectedAvailability = selectedAvailability.filter(item => item !== availability);
            } 
        });

        // Footer buttons work
        // Reset 
        $("#resetFilterBtn").on("click", function() {
            filterFunction.resetFilter();
            filterFunction.clearError();
        });

        // Apply
        $("#applyFilterBtn").on("click", function() {
            filterFunction.clearError();
            filterFunction.applyFilter();
        });

        // Remove filter button
        $("#removeFilterBtn").on("click", function() {
            // Reset the filter values
            filterFunction.resetFilter();
            filterFunction.clearError();

            // Update the display
            filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);

            // Toggle buttons
            $("#removeFilterBtn").hide();
            $("#filterIcon").html(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
            </svg>`);
        });
    },
};

// Add function
const addFunction = {
    // Clear all error message
    clearError() {
        $("#partNameError").text("");
        $("#costError").text("");
        $("#quantityError").text("");
        $("#addPartModalError").text("");
        $("#imageError").text("");
    },

    // Clear all user input
    clearInput() {
        $("#partNameInput").val("");
        $("#categoryInput").val("");
        $("#costInput").val("");
        $("#quantityInput").val("");
        $("#imageInput").val("");
    },

    // Get new part input
    getInput() {
        return {
            partNameInput: $("#partNameInput").val().trim(),
            categoryInput: $("#categoryInput").val(),
            costInput: $("#costInput").val(),
            quantityInput: $("#quantityInput").val(),
            imageInput: $("#imageInput")[0].files[0]
        }
    },

    // Validate user input
    validateInput(input) {
        let errorParts = [];

        // Check if any empty field
        for (let key in input) {
            if (input[key] === null || input[key] === "" || input[key] === undefined) {
                $("#addPartModalError").text("Please fill in all information.");
                errorParts.push($(`#${key}`));
            }
        }

        // Check part name with existing names
        parts.forEach(part => {
            if (input.partNameInput.toLowerCase().replaceAll(" ", "") === part.name.toLowerCase().replaceAll(" ", "")) {
                $("#partNameError").text("Part name already exist.");
                errorParts.push($("#partNameInput"));
            }
        });

        // Check cost input
        const costInput = parseFloat(input.costInput);

        if (costInput < 0) {
            $("#costError").text("Cost should not be negative.");
            errorParts.push($("#costInput"));
        }

        // Check quantity input
        const quantityInput = parseFloat(input.quantityInput);

        if (!Number.isInteger(quantityInput) && !isNaN(quantityInput)) {
            $("#quantityError").text("Quantity should be integer.");
            errorParts.push($("#quantityInput"));
        }

        if (quantityInput < 0) {
            $("#quantityError").text("Quantity should not be negative.");
            errorParts.push($("#quantityInput"));
        }

        // Check image input (not more than 100kb)
        if (input.imageInput && input.imageInput.size > 100000) {
            $("#imageError").text("Image must be under 100KB.");
            errorParts.push($("#imageInput"));
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

    // Convert image to base 64
    convertImageToBase64(image) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                resolve(e.target.result);
            };

            reader.onerror = function(error) {
                reject(error);
            }

            reader.readAsDataURL(image);
        });
    },

    // Update new part to local storage and display
    async updatePart(input) {
        // Convert image to base 64
        const base64Image = await this.convertImageToBase64(input.imageInput);

        // Format input 
        const newPart = {
            category: input.categoryInput,
            name: input.partNameInput,
            image: base64Image,
            quantity: parseInt(input.quantityInput),
            cost: parseFloat(input.costInput).toFixed(2)
        }
        
        // Update to local
        parts.push(newPart);
        savePartsToLocal();

        // Update display
        filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);
    },

    // Launch function
    launcher() {
        // Add icon clicked
        $("#addBtn").on("click", function() {
            $("#addPartModal").modal("show");
        });

        // Modal clear button clicked
        $("#modalClearPartBtn").on("click", function() {
            addFunction.clearInput();
            addFunction.clearError();
        });

        // Modal add button clicked
        $("#modalAddPartBtn").on("click", function() {
            addFunction.clearError();

            // Get input and check
            const newPart = addFunction.getInput();
            const valid = addFunction.validateInput(newPart);

            // Update part if valid
            if (valid) {
                addFunction.updatePart(newPart);

                // Clear and close modal
                addFunction.clearInput();
                $("#addPartModal").modal("hide");
            }
        });
    }
}

// Edit function
const editFunction = {
    partBackup: {},

    // Clear all error message
    clearErrorMessage() {
        $(".cost-edit-error").text("");
        $(".quantity-edit-error").text("");
    },

    // Enter edit mode (toggle buttons and edit fields)
    enterEditMode() {
        // Quantity 
        $(".quantity-display").hide();
        $(".quantity-edit-field").removeClass("d-none").show();

        // Cost
        $(".cost-display").hide();
        $(".cost-edit-field").removeClass("d-none").show();

        // Edit buttons
        $("#editBtn").hide();
        $("#finishEditBtn").removeClass("d-none").show();
        $("#cancelEditBtn").removeClass("d-none").show();
        $("#deleteColumn").removeClass("d-none").show();
        $(".delete-part-btn").removeClass("d-none").show();
    },

    // Exit edit mode
    exitEditMode() {
        // Quantity
        $(".quantity-display").show();
        $(".quantity-edit-field").hide();

        // Cost
        $(".cost-display").show();
        $(".cost-edit-field").hide();

        // Edit buttons
        $("#editBtn").show();
        $("#finishEditBtn").hide();
        $("#cancelEditBtn").hide();
        $("#deleteColumn").hide();
        $(".delete-part-btn").hide();
    },

    // Update data function
    updateData() {
        let errorParts = [];

        // Loop through each table row
        $("#inventoryTableBody tr").each(function() {
            let rowHasError = false;

            // Get part name from data attribute
            const partName = $(this).data("part-name");

            // Get values after edit
            const newCost = parseFloat($(this).find(".cost-edit-field").val()).toFixed(2);
            const newQuantity = parseFloat($(this).find(".quantity-edit-field").val());

            // Get error message elements
            const costErrorElement = $(this).find(".cost-edit-error");
            const quantityErrorElement = $(this).find(".quantity-edit-error");

            // Find parts
            const partIndex = parts.findIndex(part => part.name === partName);

            if (partIndex !== -1) {
                // Check cost inputs
                if (isNaN(newCost)) {
                    // Check NaN
                    costErrorElement.text("Please enter a number.");
                    rowHasError = true;

                } else if (newCost < 0) {
                    // Check negative
                    costErrorElement.text("Cost should not be negative.");
                    rowHasError = true;
                }

                // Check quantity inputs
                if (isNaN(newQuantity)) {
                    // Check NaN
                    quantityErrorElement.text("Please enter a number.");
                    rowHasError = true;  

                } else if (newQuantity < 0) {
                    // Check negative
                    quantityErrorElement.text("Quantity should not be negative.");
                    rowHasError = true;

                } else if (!Number.isInteger(newQuantity)) {
                    // Check not integer
                    quantityErrorElement.text("Quantity should be an integer.");
                    rowHasError = true;
                }

                // Check has error
                if (rowHasError) {
                    // Add to error parts if row has error
                    errorParts.push($(this))

                } else {
                    // Update parts data if no error
                    parts[partIndex].cost = newCost;
                    parts[partIndex].quantity = newQuantity;
                }
            }
        });

        // Has error
        if (errorParts.length !== 0) {
            // Add border to error parts
            errorParts.forEach(part => {
                addBorderTemporarily(part);
            });

            // Scroll to first error part
            scrollToTargetCenter(errorParts[0])

            return false;
        }

        // Save updated data to local storage
        savePartsToLocal();

        // Update display
        filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);

        // Return true if success
        return true;
    },

    // Get latest parts data
    getLatestParts() {
        const latestParts = localStorage.getItem("parts");

        if (latestParts) {
            parts = JSON.parse(latestParts);
        }

        return parts;
    },

    // Delete part function
    deletePart(partName) {
        // Find index of part name in parts array
        const partIndex = parts.findIndex(part => part.name === partName);

        if (partIndex !== -1) {
            // Remove part from array
            parts.splice(partIndex, 1);
        }

        // Update display and enter again edit mode
        filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);
        this.enterEditMode();
    },

    // Run Edit Function
    runEdit() {
        // Edit button click
        $("#editBtn").on("click", function() {
            // Backup parts and enter edit mode
            editFunction.partBackup = JSON.parse(JSON.stringify(parts));
            editFunction.enterEditMode();
        });

        // Finish edit button click
        $("#finishEditBtn").on("click", function() {
            // Clear error message
            editFunction.clearErrorMessage();

            // Update Data
            const editSuccess = editFunction.updateData();

            // Enter edit mode if success
            if (editSuccess) {
                editFunction.exitEditMode();
            }
        });

        // Cancel button click
        $("#cancelEditBtn").on("click", function() {
            editFunction.exitEditMode();
            editFunction.clearErrorMessage();

            // Restore old parts and reset edit fields
            parts = editFunction.partBackup;
            filterFunction.updateResult(currentSearchQuery, selectedCategories, selectedAvailability, selectedPriceRange);
        });

        // Delete button click
        $("#inventoryTableBody").off("click", ".delete-part-btn").on("click", ".delete-part-btn", function() {
            // Get part
            const selectedPartName = $(this).closest("tr").data("part-name");
            
            // Confirm deletion
            const confirmDelete = confirm(`Are you sure you want to delete part ${selectedPartName} ?`);

            // Delete part if confirm
            if (confirmDelete) {
                editFunction.deletePart(selectedPartName);
            }
        });
    }
};

// Function to scroll to selected part if coming from dashboard
function scrollToSelectedPart() {
    const partName = localStorage.getItem("scrollToSelectedPart");

    if (partName) {
        // Get targeted part
        const targetPart = $(`tr[data-part-name="${partName}"]`);

        if (targetPart.length > 0) {
            // Check table has scroll container
            const tableContainer = $("#inventoryTable");
            const hasScrollContainer = tableContainer.length > 0 && tableContainer[0].scrollHeight > tableContainer[0].clientHeight;

            if (hasScrollContainer) {
                // Scroll within table container
                const containerTop = tableContainer.scrollTop();
                const targetTop = targetPart.position().top;
                const containerHeight = tableContainer.height();
                const targetHeight = targetPart.outerHeight();
                const scrollPosition = containerTop + targetTop - (containerHeight / 2) + (targetHeight / 2);

                tableContainer.animate({
                    scrollTop: scrollPosition
                }, 50);
                
                scrollToTargetCenter(tableContainer);

            } else {
                // Original behaviour
                scrollToTargetCenter(targetPart);
            }

            // Scroll to part and add background color temporarily
            targetPart.find('td').css({
                "background-color": "#ffcccc",
                "transition": "background-color 1s ease-out"
            });
            
            setTimeout(() => {
                targetPart.find("td").css("background-color", "");

                setTimeout(() => {
                    targetPart.find('td').css("transition", "");
                }, 1000);
            }, 2000);
        }

        // Remove local storage after use
        localStorage.removeItem("scrollToSelectedPart");
    }
}

// Run all functions
$(document).ready(function() {
    // Check permission
    checkAdmin();

    // Get parts data
    getPartsFromLocal();

    // Run filter
    filterFunction.runFilter();

    // Display parts (latest)
    filterFunction.displayParts(parts);

    // Run add function
    addFunction.launcher();

    // Run edit function
    editFunction.runEdit();

    // Run scroll function after a short delay
    setTimeout(() => {
        scrollToSelectedPart();
    }, 100);
});