import Sequelize from "sequelize";
import { DatabaseConnection } from "./databaseConnection";
import { EmployeeFieldName, DatabaseTableName } from "./constants/databaseNames";
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from "sequelize";
import * as EmployeeModel from "./models/employeeModel";
import * as ActiveUserModel from "./models/activeUserModel";
var session = require("express-session");

export const employeeSignIn = async (
	employeeId: number,
	password: string,
	session: Express.session
): => {
	if((req.body.password) === (EmployeeModel.queryByEmployeeId(req.body.employeeId)).password) {

		let createTransaction: Sequelize.Transaction;

		return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<ActiveUserModel | null> => {
			createTransaction = createdTransaction;
			if(ActiveUserModel.queryByEmployeeId(req.body.employeeId) {
				ActiveUserModel.queryByEmployeeId(req.body.EmployeeId).sessionKey = session.key;
				ActiveUserModel.queryByEmployeeId(req.body.EmployeeId).sessionKey.update();
				createTransaction.update();
			} else {
				ActiveUserModel.create(
					employeeId: req.body.EmployeeId,
					sessionKey: session.key
				);
			}
		};
	}
};