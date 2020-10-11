import Sequelize from "sequelize";
import * as DatabaseConnection from "../models/databaseConnection";
import * as EmployeeRepository from "../models/employeeModel";
import { EmployeeModel } from "../models/employeeModel";
import * as ActiveUserRepository from "../models/activeUserModel";
import { ActiveUserModel } from "../models/activeUserModel";
import * as Helper from "../helpers/helper";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, SignIn, SignInRequest } from "../../typeDefinitions";

export const signInRequest = async (
	session: Express.Session,
	signInReq: SignInRequest
): Promise<CommandResponse<SignIn>> => {
	if (Helper.isBlankString(signInReq.password)) {
		return <CommandResponse<SignIn>>{
			status: 422,
			message: Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID)
		};
	}
	if (!(/^\d+$/.test(signInReq.employeeId)) || Helper.isBlankString(signInReq.employeeId)) {
		return <CommandResponse<SignIn>>{
			status: 422,
			message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
		};
	}

	return EmployeeRepository.queryByEmployeeId(Number(signInReq.employeeId))
	.then((queriedEmployee: (EmployeeModel | null)): Promise<CommandResponse<SignIn>> => {
		if (queriedEmployee == null) {
			return Promise.reject(<CommandResponse<SignIn>>{
				status: 404,
				message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
			});
		}
		if (queriedEmployee.password != <unknown>signInReq.password) {
			return Promise.reject(<CommandResponse<SignIn>>{
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
		}).then((queriedActiveEmployee: ActiveUserModel | null): Promise<ActiveUserModel> => { // Promise
			if (queriedActiveEmployee == null) {
				return ActiveUserModel.create(
				<Object>{
					sessionKey: session.key,
					employeeId: signInReq.employeeId,
					classification: queriedEmployee.classification
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: signInTransaction
				});
			}

			return (queriedActiveEmployee.update(
				<Object>{
					sessionKey: session.key
				},
				<Sequelize.InstanceUpdateOptions>{
					transaction: signInTransaction
				}
			));
		}).then((activeUser: ActiveUserModel): Promise<CommandResponse<SignIn>> => {
			signInTransaction.commit();

			return Promise.resolve(<CommandResponse<SignIn>>{
				status: 201,
				data: <SignIn>{
					sessionKey: activeUser.sessionKey
				}
			});
		}).catch((error: any): Promise<CommandResponse<SignIn>> => {
			if (signInTransaction != null) {
				signInTransaction.rollback();
			}

			return Promise.reject(<CommandResponse<SignIn>>{
				status: (error.status || 500),
				message: (error.message
					|| Resources.getString(ResourceKey.USER_UNABLE_TO_SIGN_IN))
			});
		});
	});
};
