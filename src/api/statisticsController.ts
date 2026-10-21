// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** getOverview GET /api/statistics/overview */
export async function getOverviewUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMapStringObject_>('/statistics/overview', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getUserActivity GET /api/statistics/user-activity */
export async function getUserActivityUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMapStringObject_>('/statistics/user-activity', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getQuestionPassRate GET /api/statistics/question-pass-rate */
export async function getQuestionPassRateUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMapStringObject_>('/statistics/question-pass-rate', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getSubmitDistribution GET /api/statistics/submit-distribution */
export async function getSubmitDistributionUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMapStringObject_>('/statistics/submit-distribution', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getLanguageDistribution GET /api/statistics/language-distribution */
export async function getLanguageDistributionUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseMapStringObject_>('/statistics/language-distribution', {
    method: 'GET',
    ...(options || {}),
  });
}
