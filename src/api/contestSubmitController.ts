// @ts-ignore
/* eslint-disable */
import request from '@/request';

// ==================== 比赛提交相关接口 ====================

/** 提交代码 POST /contest_submit/do */
export async function doContestSubmitUsingPost(
  body: API.ContestSubmitAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/contest_submit/do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取提交详情 GET /contest_submit/get */
export async function getContestSubmitByIdUsingGet(
  id: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseContestSubmitVO_>(`/contest_submit/get?id=${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取提交列表 POST /contest_submit/list/page */
export async function listContestSubmitByPageUsingPost(
  body: API.ContestSubmitQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageContestSubmitVO_>('/contest_submit/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户在比赛中已通过的题目ID列表 GET /contest_submit/accepted_questions */
export async function getUserAcceptedQuestionsUsingGet(
  contestId: number,
  options?: { [key: string]: any },
) {
  return request<any>(`/contest_submit/accepted_questions?contestId=${contestId}`, {
    method: 'GET',
    ...(options || {}),
  });
}