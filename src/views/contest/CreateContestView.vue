<template>
  <div id="createContestView">
    <a-card title="创建比赛">
      <a-form :model="form" layout="vertical" @submit-success="handleSubmit">
        <a-form-item label="比赛名称" field="contestName" :rules="[{ required: true, message: '请输入比赛名称' }]">
          <a-input v-model="form.contestName" placeholder="请输入比赛名称" />
        </a-form-item>

        <a-form-item label="比赛描述" field="contestDesc">
          <a-textarea v-model="form.contestDesc" placeholder="请输入比赛描述" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>

        <a-form-item label="比赛类型" field="contestType" :rules="[{ required: true, message: '请选择比赛类型' }]">
          <a-radio-group v-model="form.contestType">
            <a-radio :value="0">ACM</a-radio>
            <a-radio :value="1">IOI</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 可见性：队长创建时固定为私有（仅展示，不可修改） -->
        <a-form-item label="可见性">
          <a-radio-group v-if="isAdmin" v-model="form.visibility">
            <a-radio :value="0">公开（所有人都能参加）</a-radio>
            <a-radio :value="1">私有（仅指定团队可参加）</a-radio>
          </a-radio-group>
          <a-radio-group v-else :model-value="1" disabled>
            <a-radio :value="1">私有（仅本团队成员可参加）</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 私有比赛时选择允许的团队 -->
        <a-form-item v-if="isAdmin && form.visibility === 1" label="允许参加的团队" field="allowedTeamIds">
          <a-select v-model="form.allowedTeamIds" placeholder="请选择允许参加的团队" multiple allow-clear allow-search>
            <a-option v-for="team in teamList" :key="team.id" :value="String(team.id)">{{ team.teamName }}</a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开始时间" field="startTime" :rules="[{ required: true, message: '请选择开始时间' }]">
          <a-date-picker v-model="form.startTime" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </a-form-item>

        <a-form-item label="结束时间" field="endTime" :rules="[{ required: true, message: '请选择结束时间' }]">
          <a-date-picker v-model="form.endTime" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </a-form-item>

        <a-form-item label="选择题目">
          <a-button type="primary" size="small" @click="showQuestionModal" style="margin-bottom: 10px">
            选择题目
          </a-button>
          <div v-if="selectedQuestions.length > 0">
            <a-tag v-for="(q, index) in selectedQuestions" :key="q.id" closable @close="removeQuestion(index)" style="margin: 4px">
              {{ String.fromCharCode(65 + index) }}. {{ q.title }}
              <a-tag v-if="q.isPublic === 0" color="red" size="small" style="margin-left: 4px">不公开</a-tag>
            </a-tag>
          </div>
          <a-alert v-else type="info" message="请点击按钮选择题目" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="submitting">
              创建比赛
            </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 选择题目弹窗 -->
    <a-modal v-model:visible="questionModalVisible" title="选择题目" :width="800" @ok="handleQuestionSelect">
      <a-form :model="questionSearch" layout="inline" style="margin-bottom: 16px">
        <a-form-item field="title" label="题目名称">
          <a-input v-model="questionSearch.title" placeholder="请输入题目名称" allow-clear />
        </a-form-item>
        <a-form-item field="isPublic" label="公开状态">
          <a-select
            v-model="questionSearch.isPublic"
            placeholder="请选择"
            allow-clear
            style="width: 120px"
            @change="searchQuestions"
          >
            <a-option :value="undefined">全部</a-option>
            <a-option :value="1">公开</a-option>
            <a-option :value="0">不公开</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchQuestions">搜索</a-button>
          <a-button style="margin-left: 8px" @click="clearQuestionSearch">清空</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="questionColumns"
        :data="questionList"
        :pagination="{
          showTotal: true,
          pageSize: questionSearch.pageSize,
          current: questionSearch.current,
          total: questionTotal,
        }"
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
        @page-change="onQuestionPageChange"
        row-key="id"
      >
        <template #title="{ record }">
          <span>{{ record.title }}</span>
          <a-tag v-if="record.isPublic === 0" color="red" size="small" style="margin-left: 8px">
            不公开
          </a-tag>
        </template>
        <template #difficulty="{ record }">
          <a-tag v-if="record.difficulty === 0" color="green">简单</a-tag>
          <a-tag v-else-if="record.difficulty === 1" color="orange">中等</a-tag>
          <a-tag v-else color="red">困难</a-tag>
        </template>
        <template #tags="{ record }">
          <a-tag v-for="(tag, index) in record.tags" :key="index" color="arcoblue" style="margin: 2px">
            {{ tag }}
          </a-tag>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Message } from "@arco-design/web-vue";
import { addContestUsingPost, addCaptainContestUsingPost } from "@/api/contestController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { listTeamByPageUsingPost } from "@/api/teamController";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const store = useStore();
const submitting = ref(false);
const questionModalVisible = ref(false);

const isAdmin = computed(() => store.state.user.loginUser?.userRole === ACCESS_ENUM.ADMIN);

const form = reactive({
  contestName: "",
  contestDesc: "",
  contestType: 0,
  visibility: 0,
  allowedTeamIds: [] as string[],
  startTime: "",
  endTime: "",
  questionIds: [] as number[],
});

// 团队列表（用于私有比赛选择）
const teamList = ref<any[]>([]);

const loadTeams = async () => {
  try {
    // 后端限制 pageSize 最大为 20，需要分页加载
    const allTeams: any[] = [];
    let current = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await listTeamByPageUsingPost({ current, pageSize: 20 });
      const resData = res.data || res;
      if (resData.code === 0) {
        const records = resData.data?.records || resData.records || [];
        allTeams.push(...records);
        const total = resData.data?.total || resData.total || 0;
        hasMore = allTeams.length < total && records.length > 0;
        current++;
      } else {
        hasMore = false;
      }
    }
    teamList.value = allTeams;
  } catch (e) {
    console.error("加载团队列表失败", e);
  }
};

// 题目搜索
const questionSearch = reactive({
  title: "",
  isPublic: undefined as number | undefined,
  current: 1,
  pageSize: 10,
});
const questionList = ref<any[]>([]);
const questionTotal = ref(0);
const selectedQuestions = ref<any[]>([]);
const selectedKeys = ref<(number | string)[]>([]);
// 存储所有已选题目（用普通对象，避免响应式问题）
let allQuestionsDict: Record<string, any> = {};

const questionColumns = [
  { title: "题号", dataIndex: "questionNumber", width: 80 },
  { title: "标题", slotName: "title" },
  { title: "难度", slotName: "difficulty", width: 100 },
  { title: "标签", slotName: "tags" },
];

// 行选择配置
const rowSelection = {
  type: "checkbox" as const,
  showCheckedAll: true,
};

// 搜索题目
const searchQuestions = async () => {
  const res = await listQuestionVoByPageUsingPost({
    title: questionSearch.title,
    isPublic: questionSearch.isPublic,
    current: questionSearch.current,
    pageSize: questionSearch.pageSize,
  });
  if (res.data?.code === 0 || res.code === 0) {
    const resData = res.data?.data || res.data;
    questionList.value = resData?.records || [];
    questionTotal.value = resData?.total || 0;

    // 将当前页的题目添加到字典中
    questionList.value.forEach((q) => {
      allQuestionsDict[String(q.id)] = q;
    });
    console.log("字典内容:", allQuestionsDict);
  }
};

// 打开题目选择弹窗
const showQuestionModal = () => {
  questionModalVisible.value = true;
  searchQuestions();
};

// 题目分页变化
const onQuestionPageChange = (page: number) => {
  questionSearch.current = page;
  searchQuestions();
};

// 清空搜索条件
const clearQuestionSearch = () => {
  questionSearch.title = "";
  questionSearch.isPublic = undefined;
  questionSearch.current = 1;
  searchQuestions();
};

// 移除已选题目
const removeQuestion = (index: number) => {
  const removed = selectedQuestions.value.splice(index, 1)[0];
  selectedKeys.value = selectedKeys.value.filter((id) => String(id) !== String(removed.id));
  delete allQuestionsDict[String(removed.id)];
};

// 确认选择题目
const handleQuestionSelect = () => {
  console.log("选中的keys:", selectedKeys.value);
  console.log("字典内容:", allQuestionsDict);

  // 根据选中的keys构建已选题目列表
  const questions: any[] = [];
  selectedKeys.value.forEach((id) => {
    const q = allQuestionsDict[String(id)];
    if (q) {
      questions.push(q);
    }
  });

  selectedQuestions.value = questions;
  console.log("选中的题目:", selectedQuestions.value);

  questionModalVisible.value = false;
};

// 提交表单
const handleSubmit = async () => {
  if (selectedQuestions.value.length === 0) {
    Message.error("请选择至少一道题目");
    return;
  }

  if (form.startTime && form.endTime && new Date(form.startTime) >= new Date(form.endTime)) {
    Message.error("开始时间必须早于结束时间");
    return;
  }

  // 管理员创建私有比赛时必须选择至少一个团队
  if (isAdmin.value && form.visibility === 1 && form.allowedTeamIds.length === 0) {
    Message.error("私有比赛必须选择至少一个允许参加的团队");
    return;
  }

  submitting.value = true;
  try {
    const questionIds = selectedQuestions.value.map((q) => q.id);
    // 管理员使用 addContest，队长使用 addCaptainContest
    const apiFunc = isAdmin.value ? addContestUsingPost : addCaptainContestUsingPost;
    const submitData: any = {
      contestName: form.contestName,
      contestDesc: form.contestDesc,
      contestType: form.contestType,
      startTime: form.startTime,
      endTime: form.endTime,
      questionIds: questionIds,
    };
    // 管理员创建时传递可见性和团队
    if (isAdmin.value) {
      submitData.visibility = form.visibility;
      if (form.visibility === 1 && form.allowedTeamIds.length > 0) {
        submitData.allowedTeamIds = JSON.stringify(form.allowedTeamIds.map(Number));
      }
    }
    const res = await apiFunc(submitData);

    if (res.data?.code === 0 || res.code === 0) {
      Message.success("创建比赛成功");
      router.push("/contests");
    } else {
      Message.error("创建失败：" + (res.data?.message || res.message));
    }
  } finally {
    submitting.value = false;
  }
};

// 取消
const handleCancel = () => {
  router.back();
};

onMounted(() => {
  loadTeams();
});
</script>

<style scoped>
#createContestView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
