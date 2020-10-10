import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { EmployeeModel } from "../models/employeeModel";
import * as EmployeeHelper from "./helpers/employeeHelper";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import { CommandResponse, Employee, EmployeeSaveRequest } from "../../typeDefinitions";
import { EmployeeClassification } from "../models/constants/entityTypes";

const validateSaveRequest = (
	saveEmployeeRequest: EmployeeSaveRequest
): CommandResponse<Employee> => {

	let errorMessage: string = "";

	if (Helper.isBlankString(saveEmployeeRequest.firstName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
	} else if (Helper.isBlankString(saveEmployeeRequest.lastName)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
		} else if (Helper.isBlankString(saveEmployeeRequest.password)) {
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
	}

	return ((errorMessage === "")
		? <CommandResponse<Employee>>{ status: 200 }
		: <CommandResponse<Employee>>{
			status: 422,
			message: errorMessage
		});
};

export const execute = async (
	saveEmployeeRequest: EmployeeSaveRequest,
	isInitialEmployee?: boolean
): Promise<CommandResponse<Employee>> => {

	const validationResponse: CommandResponse<Employee> =
		validateSaveRequest(saveEmployeeRequest);
	if (validationResponse.status !== 200) {
		return Promise.reject(validationResponse);
	}

	saveEmployeeRequest.password = EmployeeHelper.hashString(saveEmployeeRequest.password);

	const employeeToCreate: EmployeeModel = <EmployeeModel>{
		lastName: saveEmployeeRequest.lastName,
		password: Buffer.from(saveEmployeeRequest.password),
		firstName: saveEmployeeRequest.firstName,
		classification: (isInitialEmployee !== undefined && isInitialEmployee
			? EmployeeClassification.GeneralManager
			: saveEmployeeRequest.classification),
		active: true
	};

	let createTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<EmployeeModel> => {
			createTransaction = createdTransaction;

			return EmployeeModel.create(
				employeeToCreate,
				<Sequelize.CreateOptions>{
					transaction: createTransaction
				});
		}).then((createdEmployee: EmployeeModel): CommandResponse<Employee> => {

			createTransaction.commit();

			return <CommandResponse<Employee>>{
				status: 201,
				data: EmployeeHelper.mapEmployeeData(createdEmployee)
			};
		}).catch((error: any): Promise<CommandResponse<Employee>> => {
			if (createTransaction != null) {
				createTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<Employee>>{
				status: (error.status || 500),
				message: (error.message
					|| Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE))
			});
		});
	};