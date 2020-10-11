import Sequelize from "sequelize";
import * as DatabaseConnection from "../models/databaseConnection";
import { EmployeeFieldName, DatabaseTableName } from "../models/constants/databaseNames";
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from "sequelize";
import * as EmployeeModel from "../models/employeeModel";
import * as ActiveUserRepository from "../models/activeUserModel";
import { Express, Request, Response } from "express";
import * as Helper from "../helpers/helper";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, Employee, SignInRequest } from "../../typeDefinitions";

export const execute = async (sessionKey: string): Promise<CommandResponse<ActiveUserRepository.ActiveUserModel> | void> => {
	return ActiveUserRepository.queryBySessionKey(sessionKey)
		.then((queriedActiveUser: (ActiveUserRepository.ActiveUserModel | null)): Promise<CommandResponse<ActiveUserRepository.ActiveUserModel> | void> => {
			if (!queriedActiveUser) {
				return Promise.reject(<CommandResponse<ActiveUserRepository.ActiveUserModel>>{
					status: 404,
					message: Resources.getString(ResourceKey.USER_NOT_FOUND)
				});
			}

			return queriedActiveUser.destroy();
	});
};