import { Request, Response } from "express";
import * as ActiveEmployeeExistsQuery from "..commands/employees/activeEmployeeExistsQuery";
import { Resources } from "../resourceLookup";
import * as Helper from "./helpers/routeControllerHelper";
import { ViewNameLookup, QueryParameterLookup } from "./lookups/routingLookup";
import { PageResponse, CommandResponse, ActiveUser, MainMenuPageResponse } from "./typeDefinitions";
import * as ActiveUserModel from "..commands/models/activeUserModel";
import * as EmployeeModel from "..commands/models/employeeModel";
import * as DatabaseConnection from "../commands/models/databaseConnection";

export const start = async (req: Request, res: Response): Promise<void> => {
	if(ActiveEmployeeExistsQuery.employeeExists){
		return res.render(
			ViewNameLookup.SignIn
		);
	} else {
		return res.redirect(ViewNameLookup.MainMenu);
		//SHOULD REDIRECT TO EMPLOYEE DETAIL VIEW BUT DONT HAVE YET
	}
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	var data = req.body;
	//IF PASSWORD AND ID CORRECT, CREATE RECORD IN ACTIVEUSER TABLE
	if(data.password===(EmployeeModel.queryByEmployeeId(data.employeeId).password)) {
		var DatabaseConnect = DatabaseConnection.createTransaction();
//		ActiveUserModel.init(
//			employeeId = data.employeeId;
//			sessionKey = (<Express.Session>req.session).id;
	}
};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
};
