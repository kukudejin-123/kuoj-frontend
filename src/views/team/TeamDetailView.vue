<template>
  <div id="teamDetailView">
    <a-card v-if="team" :title="team.teamName">
      <template #extra>
        <a-space>
          <a-button v-if="team.hasJoin && team.userRole === 2" type="primary" @click="showInviteModal">
            邀请成员
          </a-button>
          <a-button v-if="team.hasJoin && team.userRole === 2" status="danger" @click="handleDelete">
            解散团队
          </a-button>
        </a-space>
      </template>
      <a-descriptions :column="{ xs: 1, md: 2, lg: 3 }">
        <a-descriptions-item label="团队描述">
          {{ team.teamDesc || '暂无描述' }}
        </a-descriptions-item>
        <a-descriptions-item label="成员数量">
          {{ team.memberCount }} / {{ team.maxMemberCount }}
        </a-descriptions-item>
        <a-descriptions-item label="队长">
          <a-link @click="toUserProfile(team.createUser?.id)">
            {{ team.createUser?.userName || '未知' }}
          </a-link>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ moment(team.createTime).format("YYYY-MM-DD HH:mm") }}
        </a-descriptions-item>
        <a-descriptions-item label="我的角色">
          <a-tag v-if="team.userRole === 0" color="gray">普通成员</a-tag>
          <a-tag v-if="team.userRole === 1" color="blue">管理员</a-tag>
          <a-tag v-if="team.userRole === 2" color="green">队长</a-tag>
          <a-tag v-if="!team.hasJoin" color="orange">未加入</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-divider />

    <a-card title="团队成员">
      <template #extra>
        <a-button v-if="team?.hasJoin && team?.userRole !== 2" status="warning" @click="handleQuit">
          退出团队
        </a-button>
      </template>
      <a-table
        :columns="memberColumns"
        :data="memberList"
        :pagination="{
          showTotal: true,
          pageSize: memberParams.pageSize,
          current: memberParams.current,
          total: memberTotal,
        }"
        @page-change="onMemberPageChange"
      >
        <template #userName="{ record }">
          <a-link @click="toUserProfile(record.user?.id)">
            {{ record.user?.userName || '未知' }}
          </a-link>
        </template>
        <template #userRole="{ record }">
          <a-tag v-if="record.userRole === 0" color="gray">普通成员</a-tag>
          <a-tag v-if="record.userRole === 1" color="blue">管理员</a-tag>
          <a-tag v-if="record.userRole === 2" color="green">队长</a-tag>
        </template>
        <template #joinTime="{ record }">
          {{ moment(record.joinTime).format("YYYY-MM-DD HH:mm") }}
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button
              v-if="team?.userRole === 2 && record.userRole !== 2"
              type="text"
              size="small"
              status="danger"
              @click="handleKick(record)"
            >
              移除
            </a-button>
            <a-button
              v-if="team?.userRole === 2 && record.userRole !== 2 && team?.userId !== record.userId"
              type="text"
              size="small"
              @click="handleTransfer(record)"
            >
              转让队长
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 邀请成员弹窗 -->
    <a-modal v-model:visible="inviteModalVisible" title="邀请成员" @ok="handleInvite">
      <a-form :model="inviteForm">
        <a-form-item label="用户ID">
          <a-input v-model="inviteForm.userId" placeholder="请输入要邀请的用户ID" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  getTeamByIdUsingGet,
  listTeamMembersUsingPost,
  quitTeamUsingPost,
  kickUserUsingPost,
  inviteUserUsingPost,
  transferCaptainUsingPost,
  deleteTeamUsingPost,
} from "@/api/teamController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const router = useRouter();
const route = useRoute();
const store = useStore();

const team = ref<any>(null);
const memberList = ref([]);
const memberTotal = ref(0);
const memberParams = ref({
  pageSize: 10,
  current: 1,
});

// 邀请弹窗
const inviteModalVisible = ref(false);
const inviteForm = ref({
  userId: "",
});

// 成员表格列
const memberColumns = [
  {
    title: "用户名",
    slotName: "userName",
  },
  {
    title: "角色",
    slotName: "userRole",
  },
  {
    title: "加入时间",
    slotName: "joinTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

// 加载团队详情
const loadTeam = async () => {
  const id = route.params.id as string;
  try {
    const res = await getTeamByIdUsingGet(Number(id));
    if (res.data?.code === 0 || res.code === 0) {
      team.value = res.data?.data || res.data;
    } else {
      message.error("加载失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("加载失败");
  }
};

// 加载团队成员
const loadMembers = async () => {
  const id = route.params.id as string;
  try {
    const res = await listTeamMembersUsingPost({
      teamId: Number(id),
      current: memberParams.value.current,
      pageSize: memberParams.value.pageSize,
    });
    if (res.data?.code === 0 || res.code === 0) {
      const resData = res.data?.data || res.data;
      memberList.value = resData?.records || [];
      memberTotal.value = resData?.total || 0;
    } else {
      message.error("加载失败");
    }
  } catch (e) {
    message.error("加载成员失败");
  }
};

// 成员分页变化
const onMemberPageChange = (page: number) => {
  memberParams.value.current = page;
  loadMembers();
};

// 跳转用户主页
const toUserProfile = (userId?: number) => {
  if (userId) {
    router.push(`/profile?userId=${userId}`);
  }
};

// 退出团队
const handleQuit = async () => {
  if (!team.value) return;
  try {
    const res = await quitTeamUsingPost({ teamId: team.value.id });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("退出成功");
      router.push("/teams");
    } else {
      message.error("退出失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("退出失败");
  }
};

// 移除成员
const handleKick = async (member: any) => {
  if (!team.value) return;
  try {
    const res = await kickUserUsingPost({
      teamId: team.value.id,
      userId: member.userId,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("移除成功");
      loadMembers();
      loadTeam();
    } else {
      message.error("移除失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("移除失败");
  }
};

// 显示邀请弹窗
const showInviteModal = () => {
  inviteModalVisible.value = true;
  inviteForm.value.userId = "";
};

// 邀请成员
const handleInvite = async () => {
  if (!team.value || !inviteForm.value.userId) {
    message.error("请输入用户ID");
    return;
  }
  try {
    const res = await inviteUserUsingPost({
      teamId: team.value.id,
      userId: inviteForm.value.userId,  // 直接传字符串，避免大数精度丢失
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("邀请成功");
      inviteModalVisible.value = false;
      loadMembers();
      loadTeam();
    } else {
      message.error("邀请失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("邀请失败");
  }
};

// 转让队长
const handleTransfer = async (member: any) => {
  if (!team.value) return;
  try {
    const res = await transferCaptainUsingPost({
      teamId: team.value.id,
      userId: member.userId,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("转让成功，您已成为普通成员");
      loadTeam();
      loadMembers();
    } else {
      message.error("转让失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("转让失败");
  }
};

// 解散团队
const handleDelete = async () => {
  if (!team.value) return;
  try {
    const res = await deleteTeamUsingPost({ id: team.value.id });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("解散成功");
      router.push("/teams");
    } else {
      message.error("解散失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("解散失败");
  }
};

onMounted(() => {
  loadTeam();
  loadMembers();
});
</script>

<style scoped>
#teamDetailView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>