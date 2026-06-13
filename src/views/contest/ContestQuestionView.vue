<template>
  <div id="contestQuestionView">
    <!-- 左侧题目侧边栏 -->
    <div class="sidebar-trigger" @click="sidebarVisible = !sidebarVisible">
      <div class="trigger-content">
        <icon-unordered-list v-if="!sidebarVisible" />
        <icon-menu-fold v-else />
        <span class="trigger-text">题目</span>
      </div>
    </div>

    <!-- 侧边栏 -->
    <transition name="slide">
      <div v-if="sidebarVisible" class="sidebar-panel">
        <div class="sidebar-header">
          <span class="sidebar-title">题目列表</span>
          <a-button type="text" size="small" @click="sidebarVisible = false">
            <icon-close />
          </a-button>
        </div>
        <div class="sidebar-content">
          <div
            v-for="q in questionList"
            :key="q.questionId"
            :class="['question-item', currentQuestionId === q.questionId ? 'active' : '']"
            @click="switchQuestion(q)"
          >
            <div class="question-label">{{ q.questionLabel }}</div>
            <div class="question-info">
              <div class="question-title">{{ q.title }}</div>
              <div class="question-meta">
                <span v-if="q.submitNum > 0" style="color: #86909c; font-size: 12px">
                  通过率: {{ ((q.acceptedNum / q.submitNum) * 100).toFixed(1) }}%
                </span>
                <span v-else style="color: #86909c; font-size: 12px">暂无提交</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-footer">
          <a-button @click="goBackToContest" long type="outline">
            返回比赛
          </a-button>
        </div>
      </div>
    </transition>

    <!-- 主内容区域 -->
    <div class="main-content" :style="{ marginLeft: sidebarVisible ? '200px' : '0' }">
      <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs v-model:active-key="activeTab" @tab-click="handleTabClick">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="questionLabel + '. ' + question.title">
              <a-descriptions title="判题条件" :column="{ xs: 1, md: 2, lg: 3 }">
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit ?? 0 }}ms
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig?.memoryLimit ?? 0 }}kb
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig?.stackLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="输入模式">
                  <a-tag :color="question.judgeConfig?.inputMode === 'loop' ? 'orange' : 'green'">
                    {{ question.judgeConfig?.inputMode === 'loop' ? '循环输入' : '单次输入' }}
                  </a-tag>
                </a-descriptions-item>
              </a-descriptions>
              <a-alert
                v-if="question.judgeConfig?.inputMode === 'loop'"
                type="warning"
                style="margin-top: 16px;"
              >
                <template #title>循环输入模式</template>
                此题需要使用循环读取输入，例如：<br/>
                Java: <code>while (scanner.hasNextInt()) { ... }</code><br/>
                C++: <code>while (cin >> a >> b) { ... }</code><br/>
                Python: <code>for line in sys.stdin: ...</code>
              </a-alert>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag v-for="(tag, index) of question.tags" :key="index" color="green">
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="mySubmit" title="我的提交">
            <a-card title="我的提交记录">
              <template #extra>
                <a-button type="primary" size="small" @click="refreshMySubmits">
                  刷新
                </a-button>
              </template>
              <a-spin :loading="mySubmitsLoading" style="width: 100%;">
                <div v-if="mySubmitsList.length === 0 && !mySubmitsLoading" style="text-align: center; padding: 40px; color: #999;">
                  暂无提交记录，快去提交代码吧！
                </div>
                <a-table
                  v-else
                  :data="mySubmitsList"
                  :pagination="mySubmitsPagination"
                  @page-change="onMySubmitsPageChange"
                  :bordered="{ cell: true }"
                >
                  <template #columns>
                    <a-table-column title="提交时间" data-index="createTime" :width="170">
                      <template #cell="{ record }">
                        {{ formatTime(record.submitTime || record.createTime) }}
                      </template>
                    </a-table-column>
                    <a-table-column title="编程语言" data-index="language" :width="100">
                      <template #cell="{ record }">
                        <a-tag :color="getLanguageColor(record.language)">{{ record.language }}</a-tag>
                      </template>
                    </a-table-column>
                    <a-table-column title="判题结果" :width="120">
                      <template #cell="{ record }">
                        <a-tag :color="getResultColor(record)">
                          {{ getResultText(record) }}
                        </a-tag>
                      </template>
                    </a-table-column>
                    <a-table-column title="执行时间" :width="100">
                      <template #cell="{ record }">
                        <span v-if="getJudgeTime(record.judgeInfo)">{{ getJudgeTime(record.judgeInfo) }} ms</span>
                        <span v-else>-</span>
                      </template>
                    </a-table-column>
                    <a-table-column title="内存占用" :width="100">
                      <template #cell="{ record }">
                        <span v-if="getJudgeMemory(record.judgeInfo)">{{ getJudgeMemory(record.judgeInfo) }} KB</span>
                        <span v-else>-</span>
                      </template>
                    </a-table-column>
                    <a-table-column title="操作" :width="100" fixed="right">
                      <template #cell="{ record }">
                        <a-button type="text" size="small" @click="viewSubmitDetail(record)">
                          查看详情
                        </a-button>
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </a-spin>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="language" label="编程语言" style="min-width: 240px">
            <a-select v-model="form.language" :style="{ width: '320px' }" placeholder="选择编程语言">
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>python</a-option>
              <a-option>javascript</a-option>
              <a-option>c</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-divider size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit" :loading="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交代码' }}
        </a-button>
      </a-col>
    </a-row>
    </div>

    <!-- 判题结果弹窗 -->
    <a-modal
      v-model:visible="resultModalVisible"
      title="判题结果"
      :footer="false"
      :closable="!isPolling"
    >
      <div v-if="isPolling" style="text-align: center; padding: 20px;">
        <a-spin size="large" />
        <p style="margin-top: 16px;">正在判题中，请稍候...</p>
      </div>
      <div v-else-if="judgeResult">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="判题结果">
            <a-tag :color="getResultColor(judgeResult)">
              {{ getResultText(judgeResult) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="执行时间" v-if="getJudgeTime(judgeResult.judgeInfo)">
            {{ getJudgeTime(judgeResult.judgeInfo) }} ms
          </a-descriptions-item>
          <a-descriptions-item label="内存占用" v-if="getJudgeMemory(judgeResult.judgeInfo)">
            {{ getJudgeMemory(judgeResult.judgeInfo) }} KB
          </a-descriptions-item>
        </a-descriptions>
        <div style="margin-top: 16px; text-align: right;">
          <a-button style="margin-right: 8px" @click="goToMySubmits">查看提交记录</a-button>
          <a-button type="primary" @click="closeResultModal">关闭</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 提交详情弹窗 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="提交详情"
      :footer="false"
      width="800px"
    >
      <div v-if="currentSubmit">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="提交时间">
            {{ formatTime(currentSubmit.submitTime || currentSubmit.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="编程语言">
            <a-tag :color="getLanguageColor(currentSubmit.language)">{{ currentSubmit.language }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="判题结果">
            <a-tag :color="getResultColor(currentSubmit)">
              {{ getResultText(currentSubmit) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="执行时间" v-if="getJudgeTime(currentSubmit.judgeInfo)">
            {{ getJudgeTime(currentSubmit.judgeInfo) }} ms
          </a-descriptions-item>
          <a-descriptions-item label="内存占用" v-if="getJudgeMemory(currentSubmit.judgeInfo)">
            {{ getJudgeMemory(currentSubmit.judgeInfo) }} KB
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="code-section">
          <div class="code-header">
            <span class="code-title">提交代码</span>
            <a-button v-if="currentSubmit.code" type="primary" size="small" @click="copyCode">复制代码</a-button>
          </div>
          <pre class="code-block"><code>{{ currentSubmit.code || '无权查看代码' }}</code></pre>
        </div>

        <div style="margin-top: 16px; text-align: right;">
          <a-button @click="closeDetailModal">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import { QuestionControllerService } from "../../../generated";
import { doContestSubmitUsingPost, listContestSubmitByPageUsingPost, getContestSubmitByIdUsingGet } from "@/api/contestSubmitController";
import { getContestQuestionsUsingGet } from "@/api/contestController";

import { IconUnorderedList, IconMenuFold, IconClose } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
const store = useStore();

const sidebarVisible = ref(true);
const question = ref<any>(null);
const questionLabel = ref("");
const contestId = ref<number>(0);
const currentQuestionId = ref<number>(0);
const questionList = ref<any[]>([]);

// 当前激活的tab
const activeTab = ref('question');

const form = ref({
  language: "java",
  code: "",
});

// 提交相关
const isSubmitting = ref(false);

// ========== 我的提交记录相关 ==========
const mySubmitsLoading = ref(false);
const mySubmitsList = ref<any[]>([]);
const mySubmitsPagination = computed(() => ({
  current: mySubmitsCurrentPage.value,
  pageSize: 10,
  total: mySubmitsTotal.value,
}));
const mySubmitsCurrentPage = ref(1);
const mySubmitsTotal = ref(0);

// 判题结果弹窗
const resultModalVisible = ref(false);
const isPolling = ref(false);
const judgeResult = ref<any>(null);
let pollingTimer: any = null;

// 提交详情弹窗
const detailModalVisible = ref(false);
const currentSubmit = ref<any>(null);

const changeCode = (value: string) => {
  form.value.code = value;
};

// 加载比赛题目列表
const loadQuestionList = async () => {
  const id = route.params.id as string;
  if (!id) return;

  const res = await getContestQuestionsUsingGet(Number(id));
  if (res.data?.code === 0 || res.code === 0) {
    const resData = res.data?.data || res.data;
    if (resData && resData.length > 0) {
      questionList.value = resData[0].questionList || [];
    }
  }
};

// 加载当前题目
const loadQuestion = async (questionId: number) => {
  if (!questionId) return;

  // 从列表中获取题目标签
  const q = questionList.value.find(item => item.questionId === questionId);
  if (q) {
    questionLabel.value = q.questionLabel || "A";
  }

  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(questionId as any);
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

// 切换题目
const switchQuestion = (q: any) => {
  if (q.questionId === currentQuestionId.value) return;

  // 更新路由
  router.push(`/contest/${contestId.value}/question/${q.questionId}?label=${q.questionLabel}`);

  // 加载新题目
  currentQuestionId.value = q.questionId;
  questionLabel.value = q.questionLabel;
  loadQuestion(q.questionId);

  // 重置提交记录
  mySubmitsCurrentPage.value = 1;
  mySubmitsList.value = [];

  // 重置代码
  form.value.code = "";
};

// 返回比赛详情
const goBackToContest = () => {
  router.push(`/contest/${contestId.value}`);
};

// 初始化加载数据
const loadData = async () => {
  const questionId = route.params.questionId as string;
  contestId.value = Number(route.params.id);

  // 先加载题目列表
  await loadQuestionList();

  // 加载当前题目
  if (questionId) {
    currentQuestionId.value = Number(questionId);
    questionLabel.value = (route.query.label as string) || "A";
    await loadQuestion(Number(questionId));
  }
};

// 加载我的提交记录
const loadMySubmits = async () => {
  if (!question.value?.id) return;

  const loginUser = store.state.user.loginUser;
  if (!loginUser || !loginUser.id) {
    mySubmitsList.value = [];
    return;
  }

  mySubmitsLoading.value = true;
  try {
    const res = await listContestSubmitByPageUsingPost({
      contestId: contestId.value,
      questionId: question.value.id,
      userId: loginUser.id,
      current: mySubmitsCurrentPage.value,
      pageSize: 10,
    });
    if (res.data?.code === 0 || res.code === 0) {
      const resData = res.data?.data || res.data;
      mySubmitsList.value = resData?.records || [];
      mySubmitsTotal.value = resData?.total || 0;
    }
  } catch (error) {
    message.error("加载提交记录失败");
  } finally {
    mySubmitsLoading.value = false;
  }
};

// 刷新我的提交记录
const refreshMySubmits = () => {
  mySubmitsCurrentPage.value = 1;
  loadMySubmits();
};

// 分页变化
const onMySubmitsPageChange = (page: number) => {
  mySubmitsCurrentPage.value = page;
  loadMySubmits();
};

// 查看提交详情
const viewSubmitDetail = async (record: any) => {
  try {
    const res = await getContestSubmitByIdUsingGet(record.id);
    if (res.data?.code === 0 || res.code === 0) {
      currentSubmit.value = res.data?.data || res.data;
      detailModalVisible.value = true;
    } else {
      currentSubmit.value = record;
      detailModalVisible.value = true;
    }
  } catch (error) {
    currentSubmit.value = record;
    detailModalVisible.value = true;
  }
};

// 关闭详情弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentSubmit.value = null;
};

// 跳转到我的提交记录tab
const goToMySubmits = () => {
  resultModalVisible.value = false;
  activeTab.value = 'mySubmit';
  mySubmitsCurrentPage.value = 1;
  loadMySubmits();
};

// 复制代码
const copyCode = () => {
  if (!currentSubmit.value?.code) {
    message.warning("没有可复制的代码");
    return;
  }
  navigator.clipboard.writeText(currentSubmit.value.code).then(() => {
    message.success("代码已复制到剪贴板");
  }).catch(() => {
    message.error("复制失败");
  });
};

// 提交代码
const doSubmit = async () => {
  if (!question.value?.id) return;
  if (isSubmitting.value) {
    message.warning("正在提交中，请勿重复点击");
    return;
  }
  if (!form.value.code || form.value.code.trim() === '') {
    message.error("请输入代码");
    return;
  }

  isSubmitting.value = true;
  resultModalVisible.value = true;
  isPolling.value = true;
  judgeResult.value = null;

  try {
    const res = await doContestSubmitUsingPost({
      contestId: contestId.value,
      questionId: question.value.id,
      language: form.value.language,
      code: form.value.code,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("提交成功，正在判题...");
      const submitId = res.data?.data || res.data;
      startPolling(submitId);
    } else {
      message.error("提交失败，" + (res.data?.message || res.message));
      resultModalVisible.value = false;
      isPolling.value = false;
    }
  } catch (error: any) {
    message.error("提交失败，" + (error.message || "系统错误"));
    resultModalVisible.value = false;
    isPolling.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// 开始轮询判题结果
const startPolling = (submitId: number) => {
  let pollCount = 0;
  const maxPollCount = 60;

  const poll = async () => {
    pollCount++;
    if (pollCount > maxPollCount) {
      stopPolling();
      message.warning("判题超时，请稍后刷新查看结果");
      resultModalVisible.value = false;
      return;
    }

    try {
      const res = await getContestSubmitByIdUsingGet(submitId);
      if ((res.data?.code === 0 || res.code === 0)) {
        const record = res.data?.data || res.data;
        if (record) {
          if (record.status === '2' || record.status === '3') {
            judgeResult.value = record;
            isPolling.value = false;
            stopPolling();
            mySubmitsCurrentPage.value = 1;
            loadMySubmits();
          } else {
            pollingTimer = setTimeout(poll, 500);
          }
        } else {
          pollingTimer = setTimeout(poll, 500);
        }
      } else {
        pollingTimer = setTimeout(poll, 500);
      }
    } catch (error) {
      pollingTimer = setTimeout(poll, 500);
    }
  };

  poll();
};

// 停止轮询
const stopPolling = () => {
  if (pollingTimer) {
    clearTimeout(pollingTimer);
    pollingTimer = null;
  }
};

// 关闭结果弹窗
const closeResultModal = () => {
  resultModalVisible.value = false;
};

// Tab切换事件
const handleTabClick = (key: string) => {
  if (key === 'mySubmit') {
    mySubmitsCurrentPage.value = 1;
    loadMySubmits();
  }
};

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return "-";
  const date = new Date(time);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 获取判题结果颜色
const getResultColor = (record: any) => {
  if (!record) return 'gray';
  const judgeInfo = record.judgeInfo;
  let msg = null;

  if (judgeInfo) {
    if (typeof judgeInfo === 'string') {
      try {
        const info = JSON.parse(judgeInfo);
        msg = info?.message;
      } catch {
        msg = judgeInfo;
      }
    } else {
      msg = judgeInfo.message;
    }
  }

  if (msg) {
    const m = msg.trim();
    if (m === 'Accepted') return 'green';
    if (m === 'Wrong Answer' || m === 'Runtime Error') return 'red';
    if (m === 'Time Limit Exceeded') return 'orange';
    if (m === 'Memory Limit Exceeded') return 'purple';
    if (m === 'Compile Error') return 'gray';
    if (m === '成功') return 'green';
    if (m === '答案错误' || m === '运行错误') return 'red';
    if (m === '超时') return 'orange';
    if (m === '内存溢出') return 'purple';
    if (m === '编译错误') return 'gray';
  }

  const status = record.status;
  if (status === '0') return 'gray';
  if (status === '1') return 'blue';
  if (status === '2') return 'green';
  if (status === '3') return 'red';
  return 'gray';
};

// 获取判题结果文本
const getResultText = (record: any) => {
  if (!record) return '-';
  const judgeInfo = record.judgeInfo;
  let msg = null;

  if (judgeInfo) {
    if (typeof judgeInfo === 'string') {
      try {
        const info = JSON.parse(judgeInfo);
        msg = info?.message;
      } catch {
        msg = judgeInfo;
      }
    } else {
      msg = judgeInfo.message;
    }
  }

  const enMap: Record<string, string> = {
    'Accepted': '通过',
    'Wrong Answer': '答案错误',
    'Time Limit Exceeded': '时间超限',
    'Memory Limit Exceeded': '内存超限',
    'Compile Error': '编译错误',
    'Runtime Error': '运行错误',
  };
  const cnMap: Record<string, string> = {
    '成功': '通过',
    '答案错误': '答案错误',
    '超时': '时间超限',
    '内存溢出': '内存超限',
    '编译错误': '编译错误',
    '运行错误': '运行错误',
  };

  if (msg) {
    const m = msg.trim();
    if (enMap[m]) return enMap[m];
    if (cnMap[m]) return cnMap[m];
    if (m !== '-') return m;
  }

  const status = record.status;
  if (status === '0') return '待判题';
  if (status === '1') return '判题中';
  if (status === '2') return '通过';
  if (status === '3') return '失败';
  return '-';
};

const getJudgeTime = (judgeInfo: any) => {
  if (!judgeInfo) return null;
  try {
    const info = typeof judgeInfo === 'string' ? JSON.parse(judgeInfo) : judgeInfo;
    return info?.time || null;
  } catch {
    return null;
  }
};

const getJudgeMemory = (judgeInfo: any) => {
  if (!judgeInfo) return null;
  try {
    const info = typeof judgeInfo === 'string' ? JSON.parse(judgeInfo) : judgeInfo;
    return info?.memory || null;
  } catch {
    return null;
  }
};

// 获取语言颜色
const getLanguageColor = (language: string) => {
  const colorMap: Record<string, string> = {
    java: "orange",
    cpp: "blue",
    c: "gray",
    python: "green",
    go: "cyan",
    javascript: "gold",
  };
  return colorMap[language?.toLowerCase()] || "gray";
};

onMounted(() => {
  loadData();
});

onUnmounted(() => {
  stopPolling();
});

watchEffect(() => {
  if (question.value?.sourceCode) {
    form.value.code = question.value.sourceCode;
  }
});
</script>

<style>
#contestQuestionView {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* 侧边栏触发器 */
.sidebar-trigger {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 80px;
  background: #165dff;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.sidebar-trigger:hover {
  width: 40px;
  background: #4080ff;
}

.trigger-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 18px;
}

.trigger-text {
  font-size: 12px;
  margin-top: 4px;
  writing-mode: vertical-rl;
}

/* 侧边栏面板 */
.sidebar-panel {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e5e6eb;
  z-index: 99;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e6eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f8fa;
}

.sidebar-title {
  font-weight: 600;
  font-size: 16px;
  color: #1d2129;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #e5e6eb;
}

/* 题目项 */
.question-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;
}

.question-item:hover {
  background-color: #f2f3f5;
}

.question-item.active {
  background-color: #e8f3ff;
  border-left-color: #165dff;
}

.question-label {
  width: 32px;
  height: 32px;
  background: #86909c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.question-item.active .question-label {
  background: #165dff;
}

.question-info {
  margin-left: 12px;
  flex: 1;
  overflow: hidden;
}

.question-title {
  font-size: 14px;
  color: #1d2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-item.active .question-title {
  color: #165dff;
  font-weight: 500;
}

.question-meta {
  margin-top: 4px;
}

/* 主内容区域 */
.main-content {
  transition: margin-left 0.3s;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

#contestQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

.code-section {
  margin-top: 16px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.code-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
}
</style>