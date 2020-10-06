import Sequelize from "sequelize";
import { DatabaseConnection } from "./databaseConnection";
import { EmployeeFieldName, DatabaseTableName } from "./constants/databaseNames";
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from "sequelize";
import EmployeeModel from "./models/employeeModel";

export const employeeExists = async (): => {
	return EmployeeModel.queryActiveExists();
};
