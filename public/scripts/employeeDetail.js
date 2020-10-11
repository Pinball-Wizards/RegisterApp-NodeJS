const { isVariableDeclarationList } = require("typescript");

let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	// TODO: Things that need doing when the view is loaded
	document.getElementById("saveButton").addEventListener("click", saveActionClick);
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call
	
	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	const employeeId = getEmployeeId();
	const employeeIdIsDefined = ((employeeId != null) && (productId.trim() !== ""));
	const saveActionUrl = ("/api/employeeDetail/" + (employeeIdIsDefined ? employeeId : ""));

	const saveEmployeeRequest = {
		id: employeeId,
	};

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
					&&(callbackResponse.data.product != null)
					&&(callbackResponse.data.product.id.trim() !== "")){

						document.getElementById("deleteActionContainer").classList.remove("hidden");
						setProductId(callbackResponse.data.product.id.trim());
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
// End save
