<template>
  <div id="rankingView">
    <!-- 当前用户排名卡片 -->
    <a-card v-if="myRanking" title="我的排名" style="margin-bottom: 16px">
      <a-descriptions :column="{ xs: 1, md: 2, lg: 4 }">
        <a-descriptions-item label="排名">
          <span style="font-size: 24px; font-weight: bold; color: #165dff">
            #{{ myRanking.rank }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="积分">
          <a-tag :color="getRatingColor(myRanking.rating)" size="large">
            {{ myRanking.rating }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="参赛次数">
          {{ myRanking.totalContests }}
        </a-descriptions-item>
        <a-descriptions-item label="通过题目">
          {{ myRanking.totalAccepted }}
        </a-descriptions-item>
        <a-descriptions-item label="总提交">
          {{ myRanking.totalSubmissions }}
        </a-descriptions-item>
        <a-descriptions-item label="通过率">
          {{ myRanking.totalSubmissions > 0 ? ((myRanking.totalAccepted / myRanking.totalSubmissions) * 100).toFixed(1) + '%' : '0%' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 用户排行榜 -->
    <a-card title="用户排行榜">
      <template #extra>
        <a-space>
          <a-input-search
            v-model="searchParams.userName"
            placeholder="搜索用户名"
            style="width: 200px"
            @search="loadRanking"
          />
        </a-space>
      </template>
      <a-table
        :columns="columns"
        :data="rankingList"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #rank="{ record }">
          <span v-if="record.rank === 1" style="color: #f53f3f; font-weight: bold">
            🥇 {{ record.rank }}
          </span>
          <span v-else-if="record.rank === 2" style="color: #ff7d00; font-weight: bold">
            🥈 {{ record.rank }}
          </span>
          <span v-else-if="record.rank === 3" style="color: #00b42a; font-weight: bold">
            🥉 {{ record.rank }}
          </span>
          <span v-else>{{ record.rank }}</span>
        </template>
        <template #user="{ record }">
          <a-space>
            <a-avatar :size="32">
              <img v-if="record.user?.userAvatar" :src="record.user.userAvatar" alt="avatar" />
              <span v-else>{{ record.user?.userName?.charAt(0) || 'U' }}</span>
            </a-avatar>
            <a-link @click="toUserProfile(record.userId)">
              {{ record.user?.userName || '未知用户' }}
            </a-link>
          </a-space>
        </template>
        <template #rating="{ record }">
          <a-tag :color="getRatingColor(record.rating)">
            {{ record.rating }}
          </a-tag>
        </template>
        <template #accuracy="{ record }">
          {{ record.totalSubmissions > 0 ? ((record.totalAccepted / record.totalSubmissions) * 100).toFixed(1) + '%' : '0%' }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  listUserRankingByPageUsingPost,
  getUserRankingUsingGet,
} from "@/api/rankingController";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

const loading = ref(false);
const rankingList = ref<any[]>([]);
const myRanking = ref<any>(null);

const searchParams = reactive({
  userName: "",
  current: 1,
  pageSize: 20,
});

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
});

const columns = [
  {
    title: "排名",
    slotName: "rank",
    width: 80,
  },
  {
    title: "用户",
    slotName: "user",
  },
  {
    title: "积分",
    slotName: "rating",
    width: 100,
  },
  {
    title: "参赛次数",
    dataIndex: "totalContests",
    width: 100,
  },
  {
    title: "通过题目",
    dataIndex: "totalAccepted",
    width: 100,
  },
  {
    title: "总提交",
    dataIndex: "totalSubmissions",
    width: 100,
  },
  {
    title: "通过率",
    slotName: "accuracy",
    width: 100,
  },
];

// 加载排行榜
const loadRanking = async () => {
  loading.value = true;
  try {
    const res = await listUserRankingByPageUsingPost({
      ...searchParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (res.data?.code === 0 || res.code === 0) {
      const data = res.data?.data || res.data;
      rankingList.value = data.records || [];
      pagination.total = data.total || 0;
    } else {
      message.error("获取排行榜失败：" + (res.data?.message || res.message));
    }
  } finally {
    loading.value = false;
  }
};

// 加载当前用户排名
const loadMyRanking = async () => {
  try {
    const res = await getUserRankingUsingGet();
    if (res.data?.code === 0 || res.code === 0) {
      myRanking.value = res.data?.data || res.data;
    }
  } catch (e) {
    // 未登录或获取失败，忽略
  }
};

// 分页变化
const onPageChange = (page: number) => {
  pagination.current = page;
  loadRanking();
};

// 每页条数变化
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.current = 1;
  loadRanking();
};

// 跳转到用户主页
const toUserProfile = (userId: number) => {
  router.push(`/user/profile/${userId}`);
};

// 根据积分获取颜色
const getRatingColor = (rating: number) => {
  if (rating >= 2000) return "red";
  if (rating >= 1800) return "orange";
  if (rating >= 1600) return "gold";
  if (rating >= 1400) return "green";
  return "gray";
};

onMounted(() => {
  loadRanking();
  loadMyRanking();
});
</script>

<style scoped>
#rankingView {
  padding: 20px;
}
</style>