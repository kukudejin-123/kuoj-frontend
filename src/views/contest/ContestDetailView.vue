<template>
  <div id="contestDetailView">
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

    <!-- 题目列表（比赛进行中且已报名可见） -->
    <a-card v-if="contest?.status === 1 && contest?.hasJoin" title="比赛题目">
      <a-table :columns="questionColumns" :data="questionList">
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

    <!-- 提示信息 -->
    <a-card v-else-if="contest?.status === 0">
      <a-empty description="比赛尚未开始，请等待">
        <template #image>
          <icon-clock-circle style="font-size: 48px; color: #999" />
        </template>
      </a-empty>
    </a-card>
    <a-card v-else-if="contest?.status === 1 && !contest?.hasJoin">
      <a-empty description="请先报名参赛">
        <template #image>
          <icon-user-group style="font-size: 48px; color: #999" />
        </template>
      </a-empty>
    </a-card>
    <a-card v-else-if="contest?.status === 2">
      <a-empty description="比赛已结束">
        <template #image>
          <icon-check-circle style="font-size: 48px; color: #999" />
        </template>
      </a-empty>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  getContestByIdUsingGet,
  getContestQuestionsUsingGet,
  joinContestUsingPost,
  quitContestUsingPost,
} from "@/api/contestController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { IconClockCircle, IconUserGroup, IconCheckCircle } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
const store = useStore();

const contest = ref<any>(null);
const questionList = ref<any[]>([]);

const questionColumns = [
  {
    title: "题目",
    slotName: "questionLabel",
  },
  {
    title: "难度",
    slotName: "difficulty",
  },
  {
    title: "通过率",
    slotName: "rate",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

// 加载比赛详情
const loadContest = async () => {
  const id = route.params.id as string;
  if (!id) return;

  const res = await getContestByIdUsingGet(Number(id));
  if (res.data?.code === 0 || res.code === 0) {
    contest.value = res.data?.data || res.data;
    // 如果比赛进行中且已报名，加载题目列表
    if (contest.value.status === 1 && contest.value.hasJoin) {
      loadQuestions();
    }
  } else {
    message.error("获取比赛详情失败：" + (res.data?.message || res.message));
  }
};

// 加载题目列表
const loadQuestions = async () => {
  const id = route.params.id as string;
  const res = await getContestQuestionsUsingGet(Number(id));
  if (res.data?.code === 0 || res.code === 0) {
    const resData = res.data?.data || res.data;
    if (resData && resData.length > 0) {
      questionList.value = resData[0].questionList || [];
    }
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
  router.push(`/contest/${contest.value.id}/question/${record.questionId}`);
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
