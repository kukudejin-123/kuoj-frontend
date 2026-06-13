/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionSubmitVO } from './QuestionSubmitVO';

export type BaseResponse_Page_QuestionSubmitVO_ = {
    code?: number;
    data?: {
        current?: number;
        records?: Array<QuestionSubmitVO>;
        size?: number;
        total?: number;
    };
    message?: string;
};