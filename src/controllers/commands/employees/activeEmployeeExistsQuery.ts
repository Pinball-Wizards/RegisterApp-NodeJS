import * as EmployeeRepository from "../models/employeeModel";
import { EmployeeModel } from "../models/employeeModel";
import { CommandResponse,  Employee } from "../../typeDefinitions";

export const employeeExists = async (): Promise<boolean> => {
	return EmployeeRepository.queryActiveExists()
	.then((queriedEmployee: (EmployeeModel | null)): Promise<boolean> =>  {
		if (queriedEmployee == null) {
			return Promise.reject(false);
		}
		else {
			return Promise.resolve(true);
		}
	});
};
