<template>
  <div id="contestDetailView">
    <!-- 比赛基本信息 -->
    <a-card v-if="contest" :title="contest.contestName">
      <template #extra>
        <a-space>
          <a-button
            v-if="!contest.hasJoin && contest.status !== 2"
            type="primary"
            @click="handleJoin"
          >
            报名参赛
          </a-button>
          <a-button
            v-if="contest.hasJoin && contest.status === 0"
            status="warning"
            @click="handleQuit"
          >
            取消报名
          </a-button>
        </a-space>
      </template>
      <a-descriptions :column="{ xs: 1, md: 2, lg: 3 }">
        <a-descriptions-item label="比赛描述">
          {{ contest.contestDesc || '暂无描述' }}
        </a-descriptions-item>
        <a-descriptions-item label="比赛类型">
          <a-tag v-if="contest.contestType === 0" color="arcoblue">ACM</a-tag>
          <a-tag v-else color="green">IOI</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="比赛状态">
          <a-tag v-if="contest.status === 0" color="gray">未开始</a-tag>
          <a-tag v-else-if="contest.status === 1" color="green">进行中</a-tag>
          <a-tag v-else color="red">已结束</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="开始时间">
          {{ moment(contest.startTime).format("YYYY-MM-DD HH:mm:ss") }}
        </a-descriptions-item>
        <a-descriptions-item label="结束时间">
          {{ moment(contest.endTime).format("YYYY-MM-DD HH:mm:ss") }}
        </a-descriptions-item>
        <a-descriptions-item label="参赛人数">
          {{ contest.participantCount }}
        </a-descriptions-item>
        <a-descriptions-item label="题目数量">
          {{ contest.questionCount }}
        </a-descriptions-item>
        <a-descriptions-item label="创建者">
          <a-link @click="toUserProfile(contest.createUser?.id)">
            {{ contest.createUser?.userName || '未知' }}
          </a-link>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ moment(contest.createTime).format("YYYY-MM-DD HH:mm") }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-divider />

    <!-- 比赛进行中或已结束时显示Tab -->
    <a-tabs v-if="contest && (contest.status === 1 || contest.status === 2)" v-model:active-key="activeTab">
      <!-- 题目列表Tab -->
      <a-tab-pane key="problems" title="题目列表">
        <a-card v-if="contest.hasJoin || contest.status === 2">
          <a-table :columns="questionColumns" :data="questionList" :loading="questionLoading" :pagination="{ pageSize: 10 }">
            <template #questionLabel="{ record }">
              <a-link @click="toContestQuestion(record)">
                {{ record.questionLabel }}. {{ record.title }}
              </a-link>
            </template>
            <template #difficulty="{ record }">
              <a-tag v-if="record.difficulty === 0" color="green">简单</a-tag>
              <a-tag v-else-if="record.difficulty === 1" color="orange">中等</a-tag>
              <a-tag v-else color="red">困难</a-tag>
            </template>
            <template #rate="{ record }">
              {{ record.submitNum > 0 ? ((record.acceptedNum / record.submitNum) * 100).toFixed(1) + '%' : '0%' }}
            </template>
            <template #optional="{ record }">
              <a-button type="primary" size="small" @click="toContestQuestion(record)">
                做题
              </a-button>
            </template>
          </a-table>
        </a-card>
        <a-card v-else>
          <a-empty description="请先报名参赛">
            <template #image>
              <icon-user-group style="font-size: 48px; color: #999" />
            </template>
          </a-empty>
        </a-card>
      </a-tab-pane>

      <!-- 排行榜Tab -->
      <a-tab-pane key="ranking" title="排行榜">
        <a-card>
          <a-table :columns="rankingColumns" :data="rankingList" :loading="rankingLoading" :pagination="{ pageSize: 20, showTotal: true }">
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
                <a-avatar :size="24">
                  <img v-if="record.user?.userAvatar" :src="record.user.userAvatar" alt="avatar" />
                  <span v-else>{{ record.user?.userName?.charAt(0) || 'U' }}</span>
                </a-avatar>
                <a-link @click="toUserProfile(record.userId)">
                  {{ record.user?.userName || '未知用户' }}
                </a-link>
              </a-space>
            </template>
            <template #problemStats="{ record }">
              <a-space v-if="record.problemStats">
                <a-tag v-for="(stats, label) in record.problemStats" :key="label"
                  :color="stats[0] >= 0 ? 'green' : 'red'">
                  {{ label }}
                  <span v-if="stats[0] >= 0">({{ stats[0] }}+{{ stats[1] * 20 }})</span>
                  <span v-else>(-{{ stats[1] }})</span>
                </a-tag>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- 比赛未开始提示 -->
    <a-card v-else-if="contest?.status === 0">
      <a-empty description="比赛尚未开始，请等待">
        <template #image>
          <icon-clock-circle style="font-size: 48px; color: #999" />
        </template>
      </a-empty>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getContestByIdUsingGet,
  getContestQuestionsUsingGet,
  joinContestUsingPost,
  quitContestUsingPost,
} from "@/api/contestController";
import { getContestRankingUsingGet } from "@/api/rankingController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { IconClockCircle, IconUserGroup } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();

const contest = ref<any>(null);
const questionList = ref<any[]>([]);
const rankingList = ref<any[]>([]);
const questionLoading = ref(false);
const rankingLoading = ref(false);
const activeTab = ref("problems");

const questionColumns = [
  {
    title: "题目",
    slotName: "questionLabel",
  },
  {
    title: "难度",
    slotName: "difficulty",
    width: 100,
  },
  {
    title: "通过率",
    slotName: "rate",
    width: 100,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 80,
  },
];

const rankingColumns = [
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
    title: "通过",
    dataIndex: "acceptedCount",
    width: 80,
  },
  {
    title: "罚时",
    dataIndex: "totalTime",
    width: 100,
  },
  {
    title: "题目状态",
    slotName: "problemStats",
  },
];

// 加载比赛详情
const loadContest = async () => {
  const id = route.params.id as string;
  if (!id) return;

  const res = await getContestByIdUsingGet(Number(id));
  if (res.data?.code === 0 || res.code === 0) {
    contest.value = res.data?.data || res.data;
    // 加载题目列表
    if (contest.value.status === 1 || contest.value.status === 2) {
      loadQuestions();
      loadRanking();
    }
  } else {
    message.error("获取比赛详情失败：" + (res.data?.message || res.message));
  }
};

// 加载题目列表
const loadQuestions = async () => {
  const id = route.params.id as string;
  questionLoading.value = true;
  try {
    const res = await getContestQuestionsUsingGet(Number(id));
    if (res.data?.code === 0 || res.code === 0) {
      const resData = res.data?.data || res.data;
      if (resData && resData.length > 0) {
        questionList.value = resData[0].questionList || [];
      }
    }
  } finally {
    questionLoading.value = false;
  }
};

// 加载排行榜
const loadRanking = async () => {
  const id = route.params.id as string;
  rankingLoading.value = true;
  try {
    const res = await getContestRankingUsingGet(Number(id));
    if (res.data?.code === 0 || res.code === 0) {
      rankingList.value = res.data?.data || res.data || [];
    }
  } finally {
    rankingLoading.value = false;
  }
};

// 报名参赛
const handleJoin = async () => {
  const res = await joinContestUsingPost(contest.value.id);
  if (res.data?.code === 0 || res.code === 0) {
    message.success("报名成功");
    loadContest();
  } else {
    message.error("报名失败：" + (res.data?.message || res.message));
  }
};

// 取消报名
const handleQuit = async () => {
  const res = await quitContestUsingPost(contest.value.id);
  if (res.data?.code === 0 || res.code === 0) {
    message.success("取消报名成功");
    loadContest();
  } else {
    message.error("取消报名失败：" + (res.data?.message || res.message));
  }
};

// 跳转到用户主页
const toUserProfile = (userId: number) => {
  router.push(`/user/profile/${userId}`);
};

// 跳转到做题页面
const toContestQuestion = (record: any) => {
  router.push(`/contest/${contest.value.id}/question/${record.questionId}?order=${record.questionOrder}`);
};

onMounted(() => {
  loadContest();
});
</script>

<style scoped>
#contestDetailView {
  padding: 20px;
}
</style>