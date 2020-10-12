let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Things that need doing when the view is loaded
	document.getElementById("saveButton").addEventListener("click", saveActionClick);
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call
	if(document.getElementById('firstName').value == ""){
        displayError('Error: First name must be filled');
        document.getElementById('firstName').focus();
        return false;
    }

    if(document.getElementById('lastName').value == ""){
        displayError('Error: Last name must be filled');
        document.getElementById('lastName').focus();
        return false;
    }

    if(document.getElementById('password').value == ""){
        displayError('Error: Password must be filled');
        document.getElementById('password').focus();
        return false;
    }

    if(document.getElementById('password').value != document.getElementById('confirmPassword').value){
        displayError('Error: Password and Confirm Password do not match');
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
		ajaxPatch(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if(isSuccessResponse(callbackResponse)){
				displayEmployeeSavedAlertModal();
			}
		});
	} else {
		ajaxPost(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if(isSuccessResponse(callbackResponse)){
				displayEmployeeSavedAlertModal();
				if(callbackResponse.data != null) {
					if(callbackResponse.data.id != null) {
						setEmployeeId(callbackResponse.data.id);
						setEmployeeEmployeeId(callbackResponse.data.employeeId);
						console.log(callbackResponse.data.redirectUrl);
						
					}
					if(callbackResponse.data.redirectUrl != null)
					{
						window.location.replace(callbackResponse.data.redirectUrl);
					}	
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

function getSavedAlertModalElement() {
	return document.getElementById("employeeSavedAlertModal");
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
	document.getElementById("idContainer").classList.remove("hidden");
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
