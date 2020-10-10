import { EmployeeClassification } from "../../models/constants/entityTypes";
import * as Helper from "../../helpers/helper";
import { Employee } from "../../../typeDefinitions";
import { EmployeeModel } from "../../models/employeeModel";
import * as bcrypt from "bcrypt";

export const hashString = (toHash: string): string => {
	return  bcrypt.hashSync(toHash, 10);
};

export const isElevatedUser = (employeeClassification: EmployeeClassification): boolean => {
	return employeeClassification != EmployeeClassification.NotDefined && employeeClassification != EmployeeClassification.Cashier;
};

export const mapEmployeeData = (queriedEmployee: EmployeeModel): Employee => {
	return <Employee>{
		id: queriedEmployee.id,
		active: queriedEmployee.active,
		lastName: queriedEmployee.lastName,
		createdOn: Helper.formatDate(queriedEmployee.createdOn),
		firstName: queriedEmployee.firstName,
		managerId: queriedEmployee.managerId,
		employeeId: queriedEmployee.employeeId,
		classification: queriedEmployee.classification
	};
};
