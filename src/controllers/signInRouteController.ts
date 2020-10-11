import { Request, Response } from "express";
import * as ActiveEmployeeExistsQuery from "./commands/employees/activeEmployeeExistsQuery";
import { Resources } from "../resourceLookup";
import * as Helper from "./helpers/routeControllerHelper";
import { ViewNameLookup, ParameterLookup, RouteLookup } from "./lookups/routingLookup";
import { PageResponse, CommandResponse, ApiResponse, ActiveUser, MainMenuPageResponse } from "./typeDefinitions";
import * as ActiveUserModel from "./commands/models/activeUserModel";
import * as EmployeeModel from "./commands/models/employeeModel";
import * as DatabaseConnection from "./commands/models/databaseConnection";
import * as EmployeeSignInCommand from "./commands/employees/employeeSignInCommand";
import * as ClearActiveUser from "./commands/activeUsers/clearActiveUserCommand";
import { error } from "console";

export const start = async (req: Request, res: Response): Promise<void> => {
	if(ActiveEmployeeExistsQuery.employeeExists()){
		res.render(
			ViewNameLookup.SignIn
		);
	} else {
		res.redirect(ViewNameLookup.MainMenu);
		//SHOULD REDIRECT TO EMPLOYEE DETAIL VIEW BUT DONT HAVE YET
	}
};

export const signIn = async (req: Request, res: Response, error: any
): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	EmployeeSignInCommand.signInRequest((<Express.Session>req.session), req.body);
	let errorMessage: (string) = "";
	if(error.status == 404) {
		errorMessage = error.message;
		
		res.render(
			ViewNameLookup.SignIn,
			<String>errorMessage
		);
	} else {
		res.redirect(ViewNameLookup.MainMenu);
	}
};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
	ClearActiveUser.execute((<Express.Session>req.session).id);
	res.send(<ApiResponse>{
		redirectUrl: RouteLookup.SignIn
	});
};
