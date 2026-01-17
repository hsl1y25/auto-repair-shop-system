// Set appointments array
let appointments = [];

// Format time
const timeOptions = {
    "8": "08:00 AM", 
    "9": "09:00 AM", 
    "10": "10:00 AM", 
    "11": "11:00 AM", 
    "12": "12:00 PM", 
    "13": "01:00 PM",
    "14": "02:00 PM", 
    "15": "03:00 PM", 
    "16": "04:00 PM", 
    "17": "05:00 PM"
};

// Format service type
const serviceType = {
    "general": "General Inspection and Care",
    "repair": "Repair Broken Parts",
    "update": "Update Parts",
    "other": "Other"
};

// Function to get appointments from local storage
function getAppointmentsFromLocal() {
    const savedAppointments = localStorage.getItem("appointments");

    if (savedAppointments) {
        // If local storage exist
        appointments = JSON.parse(savedAppointments);
    } else {
        // Local storage not found, add sample data to local storage (for demo only)
        appointments = [
            {
                name: "John Doe",
                email: "john@gmail.com",
                phone: "60123456789",
                make: "Perodua",
                model: "Myvi",
                serviceType: "general",
                date: "2026-03-09",
                time: "9",
                notes: "-"
            },

            {
                name: "Ali",
                email: "ali@gmail.com",
                phone: "601125695849",
                make: "Proton",
                model: "X50",
                serviceType: "repair",
                date: "2026-02-19",
                time: "13",
                notes: "Engine fails"
            },

            {
                name: "Peter",
                email: "peter@gmail.com",
                phone: "60178965258",
                make: "Perodua",
                model: "Bezza",
                serviceType: "update",
                date: "2026-01-05",
                time: "14",
                notes: "change tires"
            },

            {
                name: "May",
                email: "may@gmail.com",
                phone: "601259456252",
                make: "Honda",
                model: "City",
                serviceType: "other",
                date: "2026-01-03",
                time: "16",
                notes: "-"
            },

            {
                name: "Edwin",
                email: "edwin@gmail.com",
                phone: "601965841256",
                make: "Perodua",
                model: "Axia",
                serviceType: "repair",
                date: "2026-02-19",
                time: "14",
                notes: "repair air conditioner"
            },

            {
                name: "Jane",
                email: "jane@gmail.com",
                phone: "60132569524",
                make: "Toyota",
                model: "Camry",
                serviceType: "general",
                date: "2026-03-26",
                time: "12",
                notes: "-"
            }
        ];

        saveAppointmentsToLocal();
    }
}

// Function to update data to local storage
function saveAppointmentsToLocal() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

// Submit function
const submitAppointment = {
    // Clear all error messages
    clearError() {
        $("#emailError").text("");
        $("#phoneNumberError").text("");
        $("#dateError").text("");
        $("#errorMessage").text("");
    },

    // Clear all input fields
    clearInputs() {
        $("#name").val("");
        $("#email").val("");
        $("#phone").val("");
        $("#make").val("");
        $("#model").val("");
        $("#serviceType").val("");
        $("#date").val("");
        $("#time").val("");
        $("#notes").val("");
    },

    getInputs() {
        return {
            name: $("#name").val().trim(),
            email: $("#email").val().trim(),
            phone: $("#phone").val().replace(/\s/g, ''),
            make: $("#make").val().trim(),
            model: $("#model").val().trim(),
            serviceType: $("#serviceType").val(),
            date: $("#date").val(),
            time: $("#time").val(),
            notes: $("#notes").val()
        };
    },

    validateInputs(inputs) {
        let errorParts = [];

        // Check if any empty field
        for (let key in inputs) {
            if ((inputs[key] === null || inputs[key] === "") && key !== "notes") {
                $("#errorMessage").text("Please fill in all required fields.");
                errorParts.push($(`#${key}`));
            }
        }

        // Check email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(inputs.email) && inputs.email !== "") {
            $("#emailError").text("Invalid email address.");
            errorParts.push($("#email"));
        }

        // Check phone number only contain numbers
        const phonePattern = /^\d+$/;
        if (!phonePattern.test(inputs.phone) && inputs.phone !== "") {
            $("#phoneNumberError").text("Phone number should only contain numbers.");
            errorParts.push($("#phone"));
        }

        // Check date is future date
        if (new Date(inputs.date) <= new Date()) {
            $("#dateError").text("Please select a future date.");
            errorParts.push($("#date"));
        }

        // Check date is not weekend
        const dateDay = new Date(inputs.date).getUTCDay();
        if ([6, 0].includes(dateDay)) {
            $("#dateError").text("We are not available on weekend. Please select a weekday.");
            errorParts.push($("#date"));
        }

        // Check if notes empty
        if (inputs.notes === "") {
            inputs.notes = "-";
        }

        if (errorParts.length !== 0) {
            // Scroll to error part and add border
            scrollToTargetCenter(errorParts[0]);

            errorParts.forEach(part => {
                addBorderTemporarily(part);
            });
            
            return false;
        }

        // Return true if pass all checks
        return true;
    },

    saveAppointment(inputs) {
        // Push new appointment to array
        appointments.push(inputs);

        // Update new appointments to local storage
        saveAppointmentsToLocal();
    },

    successMessage() {
        // Show success modal
        $("#submitDate").text(new Date());
        $("#successModal").modal("show");

        // Close button
        $("#modalCloseBtn").on("click", function() {
            $("#successModal").modal("hide");
        });

        // Download button
        $("#modalDownloadBtn").on("click", function() {
            submitAppointment.downloadAppointment();
        });
    },

    downloadAppointment() {
        // Get added appointment
        const appointment = appointments[appointments.length - 1];

        // Create receipt content
        const receipt = `
    =====================================================================
                      TWELVE AUTO - APPOINTMENT RECEIPT        
    =====================================================================

    Submission Time:  ${new Date()}

    ---------------------------------------------------------------------
     PERSONAL INFORMATION
    ---------------------------------------------------------------------
    Full Name:        ${appointment.name}
    Email:            ${appointment.email}
    Phone Number:     ${appointment.phone}

    ---------------------------------------------------------------------
     VEHICLE INFORMATION
    ---------------------------------------------------------------------
    Make:             ${appointment.make}
    Model:            ${appointment.model}

    ---------------------------------------------------------------------
     SERVICE DETAILS
    ---------------------------------------------------------------------
    Service Type:     ${serviceType[appointment.serviceType]}
    Service Date:     ${appointment.date}
    Preferred Time:   ${timeOptions[appointment.time]}
    Additional Notes: ${appointment.notes}
    
    ---------------------------------------------------------------------

    Thank you for choosing Twelve Auto!
    Please stay updated. Any changes will be informed via email or phone.

    =====================================================================
        `;

        // Download function
        const blob = new Blob([receipt], {type: "text/plain"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Appointment_Receipt_${new Date().toLocaleString()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    launcher() {
        // Book button on click
        $("#bookBtn").on("click", function() {
            submitAppointment.clearError();
            const appointment = submitAppointment.getInputs();

            if (submitAppointment.validateInputs(appointment)) {
                submitAppointment.saveAppointment(appointment);
                submitAppointment.clearInputs();
                submitAppointment.successMessage();
            }
        }); 
    }
};

$(document).ready(function() {
    // Load appointments data 
    getAppointmentsFromLocal();

    // Run submit functions
    submitAppointment.launcher();
});