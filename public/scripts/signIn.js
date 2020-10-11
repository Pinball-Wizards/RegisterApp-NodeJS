import * as Helper from "../../src/controllers/commands/helpers/helper";

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm() {
	var employeeID = document.getElementById("employeeID").value;
	var password = document.getElementById("password").value;
	if(Helper.isBlankString(employeeID.toString()) && Number.isInteger(employeeID) && Helper.isBlankString(password)){
		return true;
	} else {
		if(Helper.isBlankString(employeeID)){
			document.getElementById("errorTest").innerHTML = "* Employee ID field empty.";
		}
		else if(Helper.isBlankString(password)){
			document.getElementById("errorTest").innerHTML = "* Password field empty.";
		}
		else if(!Number.isInteger(employeeID)){
			document.getElementById("errorTest").innerHTML = "* Employee ID entry not a valid number.";
		}
		return false;
	}
}
