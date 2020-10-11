document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm() {

	var employeeID = document.getElementById("employeeId").value;
	var password = document.getElementById("password").value;

	if ((employeeID == null) || (employeeID.trim() === "")) {
		displayError("Please provide a non empty Employee Id.");
		return false;
	}

	if (isNaN(employeeID)) {
		displayError("EmployeeId must be a number");
		return false;
	}

	if ((password == null) || (password.trim() === "")) {
		displayError("Please provide a valid password.");
		return false;
	}

	return true;
}
