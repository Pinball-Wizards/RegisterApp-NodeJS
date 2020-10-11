import Sequelize from "sequelize";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeModel from "../models/employeeModel";
import * as ActiveUserRepository from "../models/activeUserModel";
import { ActiveUserModel } from "../models/activeUserModel";
import * as Helper from "../helpers/helper";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, SignInRequest } from "../../typeDefinitions";

export const signInRequest = async (
	session: Express.Session,
	signInReq: SignInRequest
): Promise<string | void | null> => {
	if (Helper.isBlankString(signInReq.password)) {
		return Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
	}
	if (!(/^\d+$/.test(signInReq.employeeId)) || Helper.isBlankString(signInReq.employeeId)) {
		return Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID);
	}

	EmployeeModel.queryByEmployeeId(Number(signInReq.employeeId))
	.then((queriedEmployee: (EmployeeModel.EmployeeModel | null)): Promise<ActiveUserModel> => {
		if (queriedEmployee == null) {
			return Promise.reject(<CommandResponse<Employee>>{
				status: 404,
				message: Resources.getString(ResourceKey.EMPLOYEE_NOT_FOUND)
			});
		}
		if (queriedEmployee.password != <unknown>signInReq.password) {
			return Promise.reject(<CommandResponse<Employee>>{
				status: 404,
				message: Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID)
			});
		}

		let signInTransaction: Sequelize.Transaction;

		return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<ActiveUserModel | null> => { // Promise
			signInTransaction = createdTransaction;

			return ActiveUserRepository.queryByEmployeeId(
				signInReq.employeeId,
				signInTransaction);
		}).then((queriedEmployee: ActiveUserModel | null): Promise<ActiveUserModel> => { // Promise
			if (queriedEmployee == null) {
				return ActiveUserModel.create(
				<Object>{
					sessionKey: session.key,
					employeeId: signInReq.employeeId
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: signInTransaction
				});
			}

			return (queriedEmployee.update(
				<Object>{
					sessionKey: session.key
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: signInTransaction
				}
			));
		});
	});
};
