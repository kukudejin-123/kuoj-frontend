/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse_ListString_ } from '../models/BaseResponseListString_';
import type { BaseResponse_Page_QuestionSubmitVO_ } from '../models/BaseResponse_Page_QuestionSubmitVO_';
import type { BaseResponse_Page_QuestionVO_ } from '../models/BaseResponse_Page_QuestionVO_';
import type { BaseResponse_QuestionVO_ } from '../models/BaseResponse_QuestionVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionAddRequest } from '../models/QuestionAddRequest';
import type { QuestionQueryRequest } from '../models/QuestionQueryRequest';
import type { QuestionSubmitAddRequest } from '../models/QuestionSubmitAddRequest';
import type { QuestionSubmitQueryRequest } from '../models/QuestionSubmitQueryRequest';
import type { QuestionUpdateRequest } from '../models/QuestionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionControllerService {

    public static addQuestionUsingPost(
requestBody?: QuestionAddRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/add',
            body: requestBody,
        });
    }

    public static deleteQuestionUsingPost(
requestBody?: DeleteRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/delete',
            body: requestBody,
        });
    }

    public static getQuestionByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question/get',
            query: {
                'id': id,
            },
        });
    }

    public static getQuestionVoByIdUsingGet(
id: number,
): CancelablePromise<BaseResponse_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question/get/vo',
            query: {
                'id': id,
            },
        });
    }

    public static listQuestionByPageUsingPost(
requestBody?: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/list/page',
            body: requestBody,
        });
    }

    public static listQuestionVoByPageUsingPost(
requestBody?: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/list/page/vo',
            body: requestBody,
        });
    }

    public static listMyQuestionVoByPageUsingPost(
requestBody?: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/my/list/page/vo',
            body: requestBody,
        });
    }

    public static doQuestionSubmitUsingPost(
requestBody?: QuestionSubmitAddRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/question_submit/do',
            body: requestBody,
        });
    }

    public static listQuestionSubmitByPageUsingPost(
requestBody?: QuestionSubmitQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSubmitVO_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/question_submit/list/page',
            body: requestBody,
        });
    }

    public static getAllTagsUsingGet(): CancelablePromise<BaseResponse_ListString_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question/tags',
        });
    }

    public static updateQuestionUsingPost(
requestBody?: QuestionUpdateRequest,
): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/question/update',
            body: requestBody,
        });
    }

}