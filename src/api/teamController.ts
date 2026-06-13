// @ts-ignore
/* eslint-disable */
import request from '@/request';

// ==================== 团队相关接口 ====================

/** 创建团队 POST /team/add */
export async function addTeamUsingPost(
  body: API.TeamAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/team/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除团队 POST /team/delete */
export async function deleteTeamUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新团队 POST /team/update */
export async function updateTeamUsingPost(
  body: API.TeamUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取团队详情 GET /team/get */
export async function getTeamByIdUsingGet(
  id: number,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseTeamVO_>(`/team/get?id=${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页获取团队列表 POST /team/list/page */
export async function listTeamByPageUsingPost(
  body: API.TeamQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageTeamVO_>('/team/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取我的团队列表 POST /team/my/list */
export async function listMyTeamUsingPost(
  body: API.TeamQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageTeamVO_>('/team/my/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出团队 POST /team/quit */
export async function quitTeamUsingPost(
  body: API.TeamQuitRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/quit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邀请成员 POST /team/invite */
export async function inviteUserUsingPost(
  body: API.TeamInviteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 移除成员 POST /team/kick */
export async function kickUserUsingPost(
  body: API.TeamKickRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/kick', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 转让队长 POST /team/transfer */
export async function transferCaptainUsingPost(
  body: API.TeamInviteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/team/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取团队成员列表 POST /team/members */
export async function listTeamMembersUsingPost(
  body: API.TeamUserQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageTeamUserVO_>('/team/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}