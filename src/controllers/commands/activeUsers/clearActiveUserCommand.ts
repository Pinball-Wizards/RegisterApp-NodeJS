import { ActiveUserModel } from "../models/activeUserModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import * as ActiveUserRepository from "../models/activeUserModel";
import { CommandResponse, ActiveUser } from "../../typeDefinitions";
var session = require("express-session");

export const clearActiveUser = async (sessionKey: string): Promise<CommandResponse<ActiveUser>> => {
	return ActiveUserRepository.queryBySessionKey(sessionKey)
		.then((queriedActiveUser: (ActiveUserModel | null)): Promise<CommandResponse<ActiveUser>> => {
			queriedActiveUser.destroy();
	});
};
