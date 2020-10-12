import { Request, Response } from "express";
import { Resources, ResourceKey } from "../resourceLookup";
import * as ProductQuery from "./commands/products/productQuery";
import { ViewNameLookup, ParameterLookup, RouteLookup } from "./lookups/routingLookup";
import * as ProductCreateCommand from "./commands/products/productCreateCommand";
import * as ProductDeleteCommand from "./commands/products/productDeleteCommand";
import * as ProductUpdateCommand from "./commands/products/productUpdateCommand";
import { CommandResponse, Product, ProductDetailPageResponse, ApiResponse, ProductSaveResponse, ProductSaveRequest, ActiveUser } from "./typeDefinitions";
import * as EmployeeHelper from "./commands/employees/helpers/employeeHelper";
import * as ValidateActiveUser from "./commands/activeUsers/validateActiveUserCommand";

const processStartProductDetailError = (res: Response, error: any, elevated: boolean): void => {
	let errorMessage: (string | undefined) = "";
	if ((error.status != null) && (error.status >= 500)) {
		errorMessage = error.message;
	}

	res.status((error.status || 500))
		.render(
			ViewNameLookup.ProductDetail,
			<ProductDetailPageResponse>{
				product: <Product>{
					id: "",
					count: 0,
					lookupCode: ""
				},
				errorMessage: errorMessage,
				isElevatedUser: elevated
			});
};

export const start = async (req: Request, res: Response): Promise<void> => {

	let checked = false;

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<Product>> => {
			checked = EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification);
			return ProductQuery.queryById(req.params[ParameterLookup.ProductId]);
		}).then((productsCommandResponse: CommandResponse<Product>): void => {
			return res.render(
				ViewNameLookup.ProductDetail,
				<ProductDetailPageResponse>{
					product: productsCommandResponse.data,
					isElevatedUser: checked
				});
		}).catch((error: any): void => {
			return processStartProductDetailError(res, error, checked);
		});
};

const saveProduct = async (
	req: Request,
	res: Response,
	performSave: (productSaveRequest: ProductSaveRequest) => Promise<CommandResponse<Product>>
): Promise<void> => {

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<Product>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<Product>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}
			return performSave(req.body);
		}).then((createProductCommandResponse: CommandResponse<Product>): void => {
			res.status(createProductCommandResponse.status)
				.send(<ProductSaveResponse>{
					product: <Product>createProductCommandResponse.data
				});
		}).catch((error: any): void => {
			res.status(error.status || 500)
				.send(<ApiResponse>{
					errorMessage: (error.message
						|| Resources.getString(ResourceKey.PRODUCT_UNABLE_TO_SAVE)),
						redirectUrl: RouteLookup.ProductListing
				});
		});
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
	saveProduct(req, res, ProductUpdateCommand.execute);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
	saveProduct(req, res, ProductCreateCommand.execute);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<CommandResponse<void>> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<void>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}
			return ProductDeleteCommand.execute(req.params[ParameterLookup.ProductId]);
		}).then((deleteProductCommandResponse: CommandResponse<void>): void => {
			res.send(<ApiResponse>{
					redirectUrl: RouteLookup.ProductListing
				});
		}).catch((error: any): void => {
			res.status(error.status || 500)
				.send(<ApiResponse>{
					errorMessage: (error.message
						|| Resources.getString(ResourceKey.PRODUCT_UNABLE_TO_DELETE)),
						redirectUrl: RouteLookup.ProductListing
				});
		});
};
