document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm() {
	var employeeID = document.getElementById("employeeID").value;
	var password = document.getElementById("password").value;
	if(employeeID != '' && Number.isInteger(employeeID) && password != ''){
		return true;
	} else {
		document.getElementById("errorTest").innerHTML = "* Error in input entries."
	}
	// return true;
}
