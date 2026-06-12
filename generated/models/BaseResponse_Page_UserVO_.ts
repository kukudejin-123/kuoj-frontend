/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserVO } from './UserVO';

export type BaseResponse_Page_UserVO_ = {
    code?: number;
    data?: {
        current?: number;
        records?: Array<UserVO>;
        size?: number;
        total?: number;
    };
    message?: string;
};