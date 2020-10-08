import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { EmployeeModel } from "../models/employeeModel";
import * as EmployeeHelper from "./helpers/employeeHelper";
import * as EmployeeRepository from "../models/employeeModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";

//This function validates the sace request
//Returns a command response of type Emplployee
const validateSaveRequest = (
	saveEmployeeRequest: EmployeeSaveRequest
): CommandResponse<Employee> => {

	//Possible error message
	let errorMessage: string = "";

	//I defined a helper function similar to the product helper function
	//This function checks to see if the first/last name is blank
	//I Generate the key based off the resource key and the resulting string
	//Resources should already be defined for active user/employee
	if (Helper.isBlankString(saveEmployeeRequest.firstName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
	}
	else if (Helper.isBlankString(saveEmployeeRequest.lastName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
	}

	//If there are errors return a response
	//With status 422 and the error message
	//If it is validated return a response with code 200
	return ((errorMessage === "")
		? <CommandResponse<Employee>>{ status: 200 }
		: <CommandResponse<Employee>>{
			status: 422,
			message: errorMessage
		});
};

//This defined a function that executes the command. In this case an update
//It takes in a save request object. This way if we change the data
//layer then we don'e have to modify the controllers/routes since
//It uses the save reqeust
export const execute = async (
	saveEmployeeRequest: EmployeeSaveRequest
): Promise<CommandResponse<Employee>> => {

	//Checks to see if the data from the request is valid
	//If the code issn't the success result 200 then reject the promise
	const validationResponse: CommandResponse<Employee> =
		validateSaveRequest(saveEmployeeRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	//This is a common transaction. From what I understand
	//we can put all the database calls in one place and execute them
	//all at once so we arent waiting on multiple database calls.
	//We make this transaction global so we aren't passing it from function to function
	let updateTransaction: Sequelize.Transaction;

	//Start a database transaction which is a promise
	return DatabaseConnection.createTransaction()
		//Start the steps of the transaction. Pass in the database transaction and say
		//we either return an Employee object which is seperated the EmployeeModel
		//This way we can seperate the EmployeeModel from the rest of the application
		.then((createdTransaction: Sequelize.Transaction): Promise<EmployeeModel | null> => {
			updateTransaction = createdTransaction;

			//Get the an EmployeeModel from thr database based on the query id
			//Return a promise on the EmployeeModel
			return EmployeeRepository.queryById(
				<string>saveEmployeeRequest.id,
				updateTransaction);

		//This is the next step in the promise chain. It can take in the EmployeeModel or null
		}).then((queriedEmployee: (EmployeeModel | null)): Promise<EmployeeModel> => {
			//If there is no object to update then return a rejected promise with
			//the failed response object
			if (queriedEmployee == null) {
				return Promise.reject(<CommandResponse<Employee>>{
					status: 404,
					message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
				});
			}

			//If it is created update the object based off the save request and pass the
			//object to the next step of the promise
			return queriedEmployee.update(

				<Object>{
					firstname: saveEmployeeRequest.firstName,
					lastname: saveEmployeeRequest.lastName,
					password: saveEmployeeRequest.password,
					classification: saveEmployeeRequest.classification
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: updateTransaction
				});

		//The next step of the promise is to wrap things up
		}).then((updatedEmployee: EmployeeModel): CommandResponse<Employee> => {

			//Commit the transaction to the database calls
			updateTransaction.commit();

			//return the created employee and map it to the Employee object for layer seperation
			return <CommandResponse<Employee>>{
				status: 200,
				data: EmployeeHelper.mapEmployeeData(updatedEmployee)//i defined the mapping function based off the productHelper
			};
		//Catch any errors and return the failed command object
		}).catch((error: any): Promise<CommandResponse<Employee>> => {

			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<Employee>>{
				status: (error.status || 500),
				message: (error.messsage
					|| Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE))
			});
		});
};
