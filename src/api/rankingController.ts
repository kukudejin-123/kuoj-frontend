// @ts-ignore
/* eslint-disable */
import request from '@/request';

// ==================== 排行榜相关接口 ====================

/** 获取总排行榜（分页） POST /ranking/list/page */
export async function listUserRankingByPageUsingPost(
  body: API.UserRankingQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserRankingVO_>('/ranking/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前用户排名信息 GET /ranking/user */
export async function getUserRankingUsingGet(
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserRankingVO_>('/ranking/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取指定用户排名信息 GET /ranking/user/{userId} */
export async function getUserRankingByIdUsingGet(
  userId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserRankingVO_>(`/ranking/user/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取比赛排行榜 GET /ranking/contest/{contestId} */
export async function getContestRankingUsingGet(
  contestId: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListContestRankingVO_>(`/ranking/contest/${contestId}`, {
    method: 'GET',
    ...(options || {}),
  });
}