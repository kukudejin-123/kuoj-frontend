<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs v-model:active-key="activeTab" @tab-click="handleTabClick">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="`P${question.questionNumber || '-'} ${question.title}`">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
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
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
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
                        {{ formatTime(record.createTime) }}
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
                        <span v-if="record.judgeInfo?.time">{{ record.judgeInfo.time }} ms</span>
                        <span v-else>-</span>
                      </template>
                    </a-table-column>
                    <a-table-column title="内存占用" :width="100">
                      <template #cell="{ record }">
                        <span v-if="record.judgeInfo?.memory">{{ record.judgeInfo.memory }} KB</span>
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
          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
            >
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
        <a-button
          type="primary"
          style="min-width: 200px"
          @click="doSubmit"
          :loading="isSubmitting"
        >
          {{ isSubmitting ? '提交中...' : '提交代码' }}
        </a-button>
      </a-col>
    </a-row>

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
          <a-descriptions-item label="执行时间" v-if="judgeResult.judgeInfo?.time">
            {{ judgeResult.judgeInfo.time }} ms
          </a-descriptions-item>
          <a-descriptions-item label="内存占用" v-if="judgeResult.judgeInfo?.memory">
            {{ judgeResult.judgeInfo.memory }} KB
          </a-descriptions-item>
        </a-descriptions>
        <div style="margin-top: 16px; text-align: right;">
          <a-button type="primary" @click="goToSubmitList">查看提交记录</a-button>
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
            {{ formatTime(currentSubmit.createTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="编程语言">
            <a-tag :color="getLanguageColor(currentSubmit.language)">{{ currentSubmit.language }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="判题结果">
            <a-tag :color="getResultColor(currentSubmit)">
              {{ getResultText(currentSubmit) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="执行时间" v-if="currentSubmit.judgeInfo?.time">
            {{ currentSubmit.judgeInfo.time }} ms
          </a-descriptions-item>
          <a-descriptions-item label="内存占用" v-if="currentSubmit.judgeInfo?.memory">
            {{ currentSubmit.judgeInfo.memory }} KB
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
import { onMounted, ref, watchEffect, withDefaults, defineProps, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
  QuestionSubmitQueryRequest,
} from "../../../generated";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const router = useRouter();
const route = useRoute();
const store = useStore();

// 当前激活的tab
const activeTab = ref('question');

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any,
  );
  if (res.code === 0) {
    console.log("res.data", res.data);
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

// 提交相关状态
const isSubmitting = ref(false);
const resultModalVisible = ref(false);
const isPolling = ref(false);
const judgeResult = ref<any>(null);
let pollingTimer: any = null;

// 提交详情弹窗
const detailModalVisible = ref(false);
const currentSubmit = ref<any>(null);

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
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
    const res = await QuestionControllerService.doQuestionSubmitUsingPost({
      ...form.value,
      questionId: question.value.id,
    });
    if (res.code === 0) {
      message.success("提交成功，正在判题...");
      // 开始轮询判题结果
      startPolling(res.data);
    } else {
      message.error("提交失败," + res.message);
      resultModalVisible.value = false;
      isPolling.value = false;
    }
  } catch (error) {
    message.error("提交失败");
    resultModalVisible.value = false;
    isPolling.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * 开始轮询判题结果
 */
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
      const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost({
        current: 1,
        pageSize: 1,
        id: submitId as any,
      });

      if (res.code === 0 && res.data?.records && res.data.records.length > 0) {
        const record = res.data.records[0];
        // 状态：0-待判题，1-判题中，2-成功，3-失败
        if (record.status === '2' || record.status === '3') {
          judgeResult.value = record;
          isPolling.value = false;
          stopPolling();
        } else {
          pollingTimer = setTimeout(poll, 500);
        }
      } else {
        pollingTimer = setTimeout(poll, 500);
      }
    } catch (error) {
      console.error("轮询失败:", error);
      pollingTimer = setTimeout(poll, 500);
    }
  };

  poll();
};

/**
 * 停止轮询
 */
const stopPolling = () => {
  if (pollingTimer) {
    clearTimeout(pollingTimer);
    pollingTimer = null;
  }
};

/**
 * 获取判题结果颜色 - 根据 judgeInfo.message 或 status 判断
 */
const getResultColor = (record: any) => {
  if (!record) return 'gray';
  const judgeInfo = record.judgeInfo;
  let msg = null;

  // 解析 judgeInfo（可能是对象或字符串）
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

  // 根据 message 判断颜色
  if (msg) {
    const m = msg.trim();
    // 英文匹配
    if (m === 'Accepted') return 'green';
    if (m === 'Wrong Answer' || m === 'Runtime Error') return 'red';
    if (m === 'Time Limit Exceeded') return 'orange';
    if (m === 'Memory Limit Exceeded') return 'purple';
    if (m === 'Compile Error') return 'gray';
    // 中文匹配（后端 getValue 返回中文）
    if (m === '成功') return 'green';
    if (m === '答案错误' || m === '运行错误') return 'red';
    if (m === '超时') return 'orange';
    if (m === '内存溢出') return 'purple';
    if (m === '编译错误') return 'gray';
  }

  // 如果 message 为空或不匹配，根据 status 判断
  const status = record.status;
  if (status === '0') return 'gray';
  if (status === '1') return 'blue';
  if (status === '2') return 'green';
  if (status === '3') return 'red';
  return 'gray';
};

/**
 * 获取判题结果文本
 */
const getResultText = (record: any) => {
  if (!record) return '-';
  const judgeInfo = record.judgeInfo;
  let msg = null;

  // 解析 judgeInfo（可能是对象或字符串）
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

  // 英文映射
  const enMap: Record<string, string> = {
    'Accepted': '通过',
    'Wrong Answer': '答案错误',
    'Time Limit Exceeded': '时间超限',
    'Memory Limit Exceeded': '内存超限',
    'Compile Error': '编译错误',
    'Runtime Error': '运行错误',
    'Presentation Error': '格式错误',
    'Output Limit Exceeded': '输出超限',
    'Waiting': '等待中',
    'System Error': '系统错误',
  };
  // 中文映射（后端 getValue 返回中文）
  const cnMap: Record<string, string> = {
    '成功': '通过',
    '答案错误': '答案错误',
    '超时': '时间超限',
    '内存溢出': '内存超限',
    '编译错误': '编译错误',
    '运行错误': '运行错误',
    '展示错误': '格式错误',
    '输出溢出': '输出超限',
    '等待中': '等待中',
    '系统错误': '系统错误',
  };

  // 优先使用 message
  if (msg) {
    const m = msg.trim();
    if (enMap[m]) return enMap[m];
    if (cnMap[m]) return cnMap[m];
    if (m !== '-') return m;
  }

  // 最后根据 status 判断
  const status = record.status;
  if (status === '0') return '待判题';
  if (status === '1') return '判题中';
  if (status === '2') return '通过';
  if (status === '3') return '失败';
  return '-';
};

/**
 * 跳转到我的提交记录tab
 */
const goToSubmitList = () => {
  resultModalVisible.value = false;
  activeTab.value = 'mySubmit';
  mySubmitsCurrentPage.value = 1;
  loadMySubmits();
};

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

/**
 * 加载我的提交记录
 */
const loadMySubmits = async () => {
  if (!question.value?.id) return;

  const loginUser = store.state.user.loginUser;
  if (!loginUser || !loginUser.id) {
    mySubmitsList.value = [];
    return;
  }

  mySubmitsLoading.value = true;
  try {
    const params: QuestionSubmitQueryRequest = {
      current: mySubmitsCurrentPage.value,
      pageSize: 10,
      questionId: question.value.id,
      userId: loginUser.id,
      sortField: "createTime",
      sortOrder: "descend",
    };

    const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(params);
    if (res.code === 0) {
      mySubmitsList.value = res.data?.records || [];
      mySubmitsTotal.value = res.data?.total || 0;
    } else {
      message.error("加载失败：" + res.message);
    }
  } catch (error) {
    message.error("加载提交记录失败");
  } finally {
    mySubmitsLoading.value = false;
  }
};

/**
 * 刷新我的提交记录
 */
const refreshMySubmits = () => {
  mySubmitsCurrentPage.value = 1;
  loadMySubmits();
};

/**
 * 分页变化
 */
const onMySubmitsPageChange = (page: number) => {
  mySubmitsCurrentPage.value = page;
  loadMySubmits();
};

/**
 * 查看提交详情
 */
const viewSubmitDetail = (record: any) => {
  currentSubmit.value = record;
  detailModalVisible.value = true;
};

/**
 * 关闭详情弹窗
 */
const closeDetailModal = () => {
  detailModalVisible.value = false;
  currentSubmit.value = null;
};

/**
 * 复制代码 - 兼容HTTP环境
 */
const copyCode = async () => {
  if (!currentSubmit.value?.code) {
    message.warning("没有可复制的代码");
    return;
  }
  const code = currentSubmit.value.code;
  try {
    // 优先使用 navigator.clipboard（需要HTTPS）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code);
      message.success("代码已复制到剪贴板");
    } else {
      // 后备方案：使用 document.execCommand
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        message.success("代码已复制到剪贴板");
      } catch (err) {
        message.error("复制失败");
      }
      document.body.removeChild(textArea);
    }
  } catch (err) {
    message.error("复制失败");
  }
};

/**
 * Tab切换事件
 */
const handleTabClick = (key: string) => {
  if (key === 'mySubmit') {
    mySubmitsCurrentPage.value = 1;
    loadMySubmits();
  }
};

/**
 * 格式化时间
 */
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

/**
 * 获取语言颜色
 */
const getLanguageColor = (language: string) => {
  const colorMap: Record<string, string> = {
    java: "orange",
    cpp: "blue",
    c: "gray",
    python: "green",
    go: "cyan",
    javascript: "gold",
    typescript: "arcoblue",
  };
  return colorMap[language?.toLowerCase()] || "gray";
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 组件销毁时清理定时器
 */
onUnmounted(() => {
  stopPolling();
});

/**
 * 等question.value?.sourceCode有值之后再赋值
 */
watchEffect(() => {
  if (question.value?.sourceCode) {
    form.value.code = question.value.sourceCode;
  }
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
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