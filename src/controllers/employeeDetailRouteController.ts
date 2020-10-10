import { Request, Response } from "express";
import * as Helper from "./helpers/routeControllerHelper";
import { Resources, ResourceKey } from "../resourceLookup";
import * as EmployeeQuery from "./commands/employees/employeeQuery";
import * as EmployeeCreate from "./commands/employees/employeeCreateCommand";
import * as EmployeeUpdate from "./commands/employees/employeeUpdateCommand";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";
import { CommandResponse, Employee, EmployeeSaveRequest, ActiveUser, ApiResponse, EmployeeDetailPageResponse } from "./typeDefinitions";
import { ViewNameLookup, ParameterLookup, RouteLookup, QueryParameterLookup } from "./lookups/routingLookup";

interface CanCreateEmployee {
	employeeExists: boolean;
	isElevatedUser: boolean;
}

const determineCanCreateEmployee = async (req: Request): Promise<CanCreateEmployee> => {
	// TODO: Logic to determine if the user associated with the current session
	//  is able to create an employee
	return <CanCreateEmployee>{ employeeExists: false, isElevatedUser: false };
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): void => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return res.redirect(Helper.buildNoPermissionsRedirectUrl());
			}

			res.render(
				ViewNameLookup.EmployeeDetail,
				<EmployeeDetailPageResponse>{
					isElevatedUser: canCreateEmployee.isElevatedUser
				});
		}).catch((error: any): void => {
			return res.redirect(
				RouteLookup.MainMenu
				+ "/?" + QueryParameterLookup.ErrorCode
				+ "=" + error
			);
		});
};

export const startWithEmployee = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<Employee>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<Employee>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			return EmployeeQuery.queryById(req.params[ParameterLookup.EmployeeId]);
		}).then((employeeCommandResponse: CommandResponse<Employee>): void => {
			res.render(
				ViewNameLookup.EmployeeDetail,
				<EmployeeDetailPageResponse>{
					employee: employeeCommandResponse.data,
					isElevatedUser: true
				});
		}).catch((error: any): void => {
			let errorMessage: (string | undefined) = "";
			if ((error.status != null)) {
				errorMessage = error.message;
			}

			let route = "";

			if (errorMessage === Resources.getString(ResourceKey.USER_NO_PERMISSIONS)) {
				route = RouteLookup.MainMenu;
			}
			else if (errorMessage === Resources.getString(ResourceKey.USER_NOT_FOUND)) {
				route = "";
			}
			else {
				route = RouteLookup.EmployeeDetail;
			}
			res.redirect(
				route
				+ "/?" + QueryParameterLookup.ErrorCode
				+ "=" + errorMessage
			);
		});
};

const saveEmployee = async (
	req: Request,
	res: Response,
	performSave: (
		employeeSaveRequest: EmployeeSaveRequest,
		isInitialEmployee?: boolean
	) => Promise<CommandResponse<Employee>>
): Promise<void> => {

	if (Helper.handleInvalidApiSession(req, res)) {
		return;
	}

	let employeeExists: boolean;

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): Promise<CommandResponse<Employee>> => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return Promise.reject(<CommandResponse<boolean>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			employeeExists = canCreateEmployee.employeeExists;

			return performSave(req.body, !employeeExists);
		}).then((saveEmployeeCommandResponse: CommandResponse<Employee>): void => {
			res.status(saveEmployeeCommandResponse.status)
				.send(saveEmployeeCommandResponse.data);
		}).catch((error: any): void => {
			return Helper.processApiError(
				error,
				res,
				<Helper.ApiErrorHints>{
					defaultErrorMessage: Resources.getString(
						ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
				});
		});
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
	ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<void> => {
			return saveEmployee(req, res, EmployeeUpdate.execute);
		}).catch((error: any): void => {
			res.redirect(
				RouteLookup.SignIn
				+ "/?" + QueryParameterLookup.ErrorCode
				+ "=" + error.message
			);
		});
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
	ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<void> => {
			return saveEmployee(req, res, EmployeeCreate.execute);
		}).catch((error: any): void => {
			res.redirect(
				RouteLookup.SignIn
				+ "/?" + QueryParameterLookup.ErrorCode
				+ "=" + error.message
			);
		});
};
