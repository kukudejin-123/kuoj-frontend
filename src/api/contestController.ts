// @ts-ignore
/* eslint-disable */
import request from '@/request';

// ==================== 比赛相关接口 ====================

/** 创建比赛 POST /contest/add */
export async function addContestUsingPost(
  body: API.ContestAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/contest/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除比赛 POST /contest/delete */
export async function deleteContestUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/contest/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新比赛 POST /contest/update */
export async function updateContestUsingPost(
  body: API.ContestUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/contest/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取比赛详情 GET /contest/get */
export async function getContestByIdUsingGet(
  id: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseContestVO_>(`/contest/get?id=${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取比赛列表 POST /contest/list/page */
export async function listContestByPageUsingPost(
  body: API.ContestQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageContestVO_>('/contest/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取比赛题目列表 GET /contest/questions */
export async function getContestQuestionsUsingGet(
  contestId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListContestVO_>(`/contest/questions?contestId=${contestId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 报名比赛 POST /contest/join */
export async function joinContestUsingPost(
  contestId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/contest/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { contestId },
    ...(options || {}),
  });
}

/** 取消报名 POST /contest/quit */
export async function quitContestUsingPost(
  contestId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/contest/quit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { contestId },
    ...(options || {}),
  });
}
