/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionVO } from './QuestionVO';

export type BaseResponse_Page_QuestionVO_ = {
    code?: number;
    data?: {
        current?: number;
        records?: Array<QuestionVO>;
        size?: number;
        total?: number;
    };
    message?: string;
};