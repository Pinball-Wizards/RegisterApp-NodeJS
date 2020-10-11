import { Request, Response } from "express";
import * as ActiveEmployeeExistsQuery from "./commands/employees/activeEmployeeExistsQuery";
import { ViewNameLookup, ParameterLookup, RouteLookup } from "./lookups/routingLookup";
import { PageResponse, CommandResponse, ApiResponse, SignIn } from "./typeDefinitions";
import * as EmployeeSignInCommand from "./commands/employees/employeeSignInCommand";
import * as ClearActiveUser from "./commands/activeUsers/clearActiveUserCommand";
import { Resources, ResourceKey } from "../resourceLookup";

export const start = async (req: Request, res: Response): Promise<void> => {
	return ActiveEmployeeExistsQuery.employeeExists()
	.then ((exisits: boolean): Promise<void> => {
		return Promise.resolve(res.render(ViewNameLookup.SignIn));
	}).catch((error: any): void => {
		res.redirect(ViewNameLookup.EmployeeDetail);
	});
};

export const signIn = async (req: Request, res: Response, error: any
): Promise<void> => {
	// TODO: Use the credentials provided in the request body (req.body)
	//  and the "id" property of the (Express.Session)req.session variable
	//  to sign in the user
	EmployeeSignInCommand.signInRequest((<Express.Session>req.session), req.body)
	.then((activeUser: CommandResponse<SignIn>): Promise<void> => {
		return Promise.resolve(res.redirect(ViewNameLookup.MainMenu));
	}).catch((error: any): void => {
		return res.render(
			ViewNameLookup.SignIn,
			<String>error.message
		);
	});
};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	// TODO: Sign out the user associated with req.session.id
	ClearActiveUser.execute((<Express.Session>req.session).id)
	.then((signInCommandResponse: CommandResponse<SignIn>): void => {
		res.send(<ApiResponse>{
			redirectUrl: RouteLookup.SignIn
		});
	}).catch((error: any): void => {
		res.status(error.status || 500)
			.send(<ApiResponse>{
				errorMessage: (error.message
					|| Resources.getString(ResourceKey.USER_UNABLE_TO_SIGN_OUT))
			});
	});

};
