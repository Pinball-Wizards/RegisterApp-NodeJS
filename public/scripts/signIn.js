document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm() {
	var employeeID = document.getElementById("employeeID").value;
	var password = document.getElementById("password").value;
	if(employeeID != '' && Number.isInteger(employeeID) && password != ''){
		return true;
	} else {
		if(employeeID == ''){
			document.getElementById("errorTest").innerHTML = "* Employee ID field empty.";
		}
		if(password == ''){
			document.getElementById("errorTest").innerHTML = "* Password field empty.";
		}
		if(!Number.isInteger(employeeID)){
			document.getElementById("errorTest").innerHTML = "* Employee ID entry not a number.";
		}
		return false;
	}
}
