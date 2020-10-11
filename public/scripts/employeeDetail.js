let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Things that need doing when the view is loaded
	document.getElementById("saveButton").addEventListener("click", saveActionClick);
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call
	if(document.getElementById('firstName').value == ""){
		alert('Error: First name must be filled');
		document.getElementById('firstName').focus();
		return false;
	}

	if(document.getElementById('lastName').value == ""){
		alert('Error: Last name must be filled');
		document.getElementById('lastName').focus();
		return false;
	}

	if(document.getElementById('password').value == ""){
		alert('Error: Password must be filled');
		document.getElementById('password').focus();
		return false;
	}

	if(document.getElementById('password').value != document.getElementById('confirmPassword').value){
		alert('Error: Password and Confirm Password do not match');
		return false;
	}

	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	const employeeId = getEmployeeId();
	const employeeIdIsDefined = ((employeeId != null) && (employeeId.trim() !== ""));
	const saveActionUrl = ("/api/employeeDetail/" + (employeeIdIsDefined ? employeeId : ""));

	const saveEmployeeRequest = {
		id: employeeId,
		firstName: getEmployeeFirstName(),
		lastName: getEmployeeLastName(),
		password: getEmployeePassword(),
		classification: getEmployeeClassification(),
		employeeId: getEmployeeEmployeeId(),
	};

	if(employeeIdIsDefined) {
		ajaxPut(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if(isSuccessReponse(callbackResponse)){
				displayEmployeeSavedAlertModal();
			}
		});
	} else {
		ajaxPost(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if(isSuccessReponse(callbackResponse)){
				displayEmployeeSavedAlertModal();

				if((callbackResponse.data != null)
					&&(callbackResponse.data.employee != null)
					&&(callbackResponse.data.employee.id.trim() !== "")){

						document.getElementById("employeeEmployeeId").classList.remove("hidden");
						setEmployeeId(callbackResponse.data.employee.id.trim());
						setEmployeeEmployeeId(callbackResponse.data.employee.employeeId.trim());
				}
			}
		});

	}
};
		

function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	getSavedAlertModalElement().style.display = "none";
}

function getEmployeeId() {
	return getEmployeeIdElement().value;
}

function setEmployeeId(id) {
	getEmployeeIdElement().value = id;
}

function getEmployeeIdElement() {
	return document.getElementById("employeeId");
}

function getEmployeeFirstName() {
	return getEmployeeFirstNameElement().value;
}

function getEmployeeFirstNameElement() {
	return document.getElementById("firstName");
}
function getEmployeeLastName() {
	return getEmployeeLastNameElement().value;
}

function getEmployeeLastNameElement() {
	return document.getElementById("lastName");
}
function getEmployeePassword() {
	return getEmployeePasswordElement().value;
}

function getEmployeePasswordElement() {
	return document.getElementById("password");
}
function getEmployeeEmployeeId() {
	return getEmployeeEmployeeIdElement().value;
}

function setEmployeeEmployeeId(id) {
	getEmployeeEmployeeIdElement().value = id;
}

function getEmployeeEmployeeIdElement() {
	return document.getElementById("employeeEmployeeId");
}

function getEmployeeManager() {
	return getEmployeeManagerElement().value;
}

function getEmployeeManagerElement() {
	return document.getElementById("managerId");
}
function getEmployeeClassification() {
	return getEmployeeClassificationElement().value;
}

function getEmployeeClassificationElement() {
	return document.getElementById("employeeType");
}
// End save
