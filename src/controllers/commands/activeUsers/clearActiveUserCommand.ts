import * as ActiveUserRepository from "../models/activeUserModel";
import { ActiveUserModel } from "../models/activeUserModel";
import { Resources, ResourceKey } from "../../../resourceLookup";
import { CommandResponse, SignIn } from "../../typeDefinitions";

export const execute = async (sessionKey: string): Promise<CommandResponse<SignIn>> => {
	return ActiveUserRepository.queryBySessionKey(sessionKey)
		.then((queriedActiveUser: (ActiveUserModel | null)): Promise<void> => {
			if (queriedActiveUser == null) {
				return Promise.reject(<CommandResponse<ActiveUserModel>>{
					status: 404,
					message: Resources.getString(ResourceKey.USER_SESSION_NOT_FOUND)
				});
			}

			return queriedActiveUser.destroy();
	}).then((): Promise<CommandResponse<SignIn>> => {
		return Promise.resolve(<CommandResponse<SignIn>>{
			status: 200,
		});
	});
};