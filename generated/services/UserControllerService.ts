/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse_LoginUserVO_ } from '../models/BaseResponse_LoginUserVO_';
import type { BaseResponse_Page_UserVO_ } from '../models/BaseResponse_Page_UserVO_';
import type { BaseResponse_UserVO_ } from '../models/BaseResponse_UserVO_';
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { UserAddRequest } from '../models/UserAddRequest';
import type { UserLoginRequest } from '../models/UserLoginRequest';
import type { UserQueryRequest } from '../models/UserQueryRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { UserUpdateMyRequest } from '../models/UserUpdateMyRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserControllerService {

    public static addUserUsingPost(
requestBody?: UserAddRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/add',
            body: requestBody,
        });
    }

    public static deleteUserUsingPost(
requestBody?: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/delete',
            body: requestBody,
        });
    }

    public static getLoginUserUsingGet(): CancelablePromise<BaseResponse_LoginUserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/get/login',
        });
    }

    public static getUserByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/get/vo',
            query: {
                'id': id,
            },
        });
    }

    public static listUserByPageUsingPost(
requestBody?: UserQueryRequest,
): CancelablePromise<BaseResponse_Page_UserVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/list/page/vo',
            body: requestBody,
        });
    }

    public static userLoginUsingPost(
requestBody?: UserLoginRequest,
): CancelablePromise<BaseResponse_LoginUserVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/login',
            body: requestBody,
        });
    }

    public static userLogoutUsingPost(): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/logout',
        });
    }

    public static userRegisterUsingPost(
requestBody?: UserRegisterRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/register',
            body: requestBody,
        });
    }

    public static updateMyUserUsingPost(
requestBody?: UserUpdateMyRequest,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/update/my',
            body: requestBody,
        });
    }

    public static updateUserUsingPost(
requestBody?: UserUpdateRequest,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/update',
            body: requestBody,
        });
    }

}