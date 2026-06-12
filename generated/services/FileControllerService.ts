/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileControllerService {

    public static uploadFileUsingPost(
file?: Blob,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/file/upload',
            formData: {
                'file': file,
            },
        });
    }

}