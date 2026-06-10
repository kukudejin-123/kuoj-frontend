<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}ms
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}kb
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="输入模式">
                  <a-tag :color="question.judgeConfig.inputMode === 'loop' ? 'orange' : 'green'">
                    {{ question.judgeConfig.inputMode === 'loop' ? '循环输入' : '单次输入' }}
                  </a-tag>
                </a-descriptions-item>
              </a-descriptions>
              <a-alert
                v-if="question.judgeConfig.inputMode === 'loop'"
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
          <a-descriptions-item label="判题状态">
            <a-tag :color="getStatusColor(judgeResult.judgeInfo?.message)">
              {{ getStatusText(judgeResult.judgeInfo?.message) }}
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, withDefaults, defineProps, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const question = ref<QuestionVO>();
const router = useRouter();

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
  const maxPollCount = 60; // 最多轮询60次（约30秒）

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
          // 判题完成
          judgeResult.value = record;
          isPolling.value = false;
          stopPolling();
        } else {
          // 继续轮询
          pollingTimer = setTimeout(poll, 500);
        }
      } else {
        // 继续轮询
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
 * 获取状态颜色
 */
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Accepted':
      return 'green';
    case 'Wrong Answer':
      return 'red';
    case 'Time Limit Exceeded':
      return 'orange';
    case 'Memory Limit Exceeded':
      return 'orange';
    case 'Compilation Error':
      return 'purple';
    case 'Runtime Error':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'Accepted': '答案正确',
    'Wrong Answer': '答案错误',
    'Time Limit Exceeded': '时间超限',
    'Memory Limit Exceeded': '内存超限',
    'Compilation Error': '编译错误',
    'Runtime Error': '运行错误',
    'Presentation Error': '格式错误',
    'Output Limit Exceeded': '输出超限',
    'Waiting': '等待中',
    'System Error': '系统错误',
  };
  return statusMap[status] || status || '未知状态';
};

/**
 * 跳转到提交记录列表
 */
const goToSubmitList = () => {
  resultModalVisible.value = false;
  router.push("/question_submit");
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
</style>
