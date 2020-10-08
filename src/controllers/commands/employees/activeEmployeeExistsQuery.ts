import { DatabaseConnection } from "../models/databaseConnection";
import { EmployeeFieldName, DatabaseTableName } from "../models/constants/databaseNames";
import { EmployeeModel } from "../models/employeeModel";

export const employeeExists = async (): Promise<EmployeeModel | null> => {
	return EmployeeModel.queryActiveExists;
};
