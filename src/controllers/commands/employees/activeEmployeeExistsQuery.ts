import { DatabaseConnection } from "../models/databaseConnection";
import { EmployeeFieldName, DatabaseTableName } from "../models/constants/databaseNames";
import * as EmployeeRepository from "../models/employeeModel";

export const employeeExists = async (): Promise<boolean> => {
	if(EmployeeRepository.queryActiveExists != null) {
		return true;
	} else {
		return false;
	}
};
