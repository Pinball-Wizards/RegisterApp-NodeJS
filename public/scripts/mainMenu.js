// Opted not to use getter and setter functions for ID.

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startTranzxButton").addEventListener("click", startTranzx);
    document.getElementById("viewProductsButton").addEventListener("click", viewProducts);
    document.getElementById("createEmployButton").addEventListener("click", createEmploy);
    document.getElementById("salesReportButton").addEventListener("click", salesReport);
    document.getElementById("cashierReportButton").addEventListener("click", cashiReport);
});

function startTranzx(event){
    displayError("Functionality has not yet been implemented.");
}

function viewProducts(event){
    location.href = '/productListing';
}

function createEmploy(event){
    location.href = '/employeeDetail';
}

function salesReport(event){
    displayError("Functionality has not yet been implemented.");
}

function cashiReport(event){
    displayError("Functionality has not yet been implemented.");
}