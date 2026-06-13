<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item label="题号">
        <a-input v-model="searchParams.questionId" placeholder="请输入题号" allow-clear style="width: 120px" />
      </a-form-item>
      <a-form-item label="判题结果">
        <a-select v-model="searchParams.judgeResult" placeholder="全部" allow-clear style="width: 140px">
          <a-option value="成功">通过</a-option>
          <a-option value="答案错误">答案错误</a-option>
          <a-option value="超时">时间超限</a-option>
          <a-option value="内存溢出">内存超限</a-option>
          <a-option value="编译错误">编译错误</a-option>
          <a-option value="运行错误">运行错误</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="编程语言">
        <a-select v-model="searchParams.language" placeholder="全部" allow-clear style="width: 120px">
          <a-option value="java">Java</a-option>
          <a-option value="cpp">C++</a-option>
          <a-option value="go">Go</a-option>
          <a-option value="python">Python</a-option>
          <a-option value="javascript">JavaScript</a-option>
          <a-option value="c">C</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="提交者">
        <a-input v-model="searchParams.userName" placeholder="请输入用户名" allow-clear style="width: 120px" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="doSubmit">搜索</a-button>
          <a-button @click="doClear">清空</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
      :scroll="{ x: 1000 }"
    >
      <template #questionNumber="{ record }">
        P{{ record.questionVO?.questionNumber || '-' }}
      </template>
      <template #questionTitle="{ record }">
        <a-link @click="toQuestionPage(record.questionVO)">
          {{ record.questionVO?.title || '-' }}
        </a-link>
      </template>
      <template #language="{ record }">
        <a-tag :color="getLanguageColor(record.language)">
          {{ record.language }}
        </a-tag>
      </template>
      <template #judgeInfo="{ record }">
        <div v-if="record.judgeInfo">
          <a-tag :color="getStatusColor(record.judgeInfo.message)">
            {{ getStatusText(record.judgeInfo.message) }}
          </a-tag>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            <span v-if="record.judgeInfo.time">耗时: {{ record.judgeInfo.time }}ms</span>
            <span v-if="record.judgeInfo.memory" style="margin-left: 8px;">内存: {{ record.judgeInfo.memory }}KB</span>
          </div>
        </div>
        <span v-else style="color: #999">-</span>
      </template>
      <template #userName="{ record }">
        {{ record.userVO?.userName || '-' }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #optional="{ record }">
        <a-button type="primary" size="small" @click="viewCode(record)">
          查看代码
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, computed } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<any>({
  questionId: undefined,
  language: undefined,
  judgeResult: undefined,
  userName: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  // 构建查询参数
  const params: any = {
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  };

  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(params);
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    slotName: "questionNumber",
    width: 80,
  },
  {
    title: "题目",
    slotName: "questionTitle",
    width: 200,
  },
  {
    title: "编程语言",
    slotName: "language",
    width: 100,
  },
  {
    title: "判题结果",
    slotName: "judgeInfo",
    width: 200,
  },
  {
    title: "提交者",
    slotName: "userName",
    width: 120,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    width: 150,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 100,
    fixed: "right",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

const router = useRouter();

/**
 * 跳转到做题页面
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const viewCode = (record: any) => {
  router.push({
    path: `/view/code/${record.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadData();
};

/**
 * 清空筛选条件
 */
const doClear = () => {
  searchParams.value = {
    questionId: undefined,
    language: undefined,
    judgeResult: undefined,
    userName: undefined,
    pageSize: 10,
    current: 1,
  };
  loadData();
};

/**
 * 获取判题结果颜色
 */
const getStatusColor = (status: string) => {
  if (!status) return 'gray';
  const s = status.trim();
  // 英文匹配
  if (s === 'Accepted') return 'green';
  if (s === 'Wrong Answer' || s === 'Runtime Error') return 'red';
  if (s === 'Time Limit Exceeded') return 'orange';
  if (s === 'Memory Limit Exceeded') return 'purple';
  if (s === 'Compile Error') return 'gray';
  // 中文匹配（后端 getValue 返回中文）
  if (s === '成功') return 'green';
  if (s === '答案错误' || s === '运行错误') return 'red';
  if (s === '超时') return 'orange';
  if (s === '内存溢出') return 'purple';
  if (s === '编译错误') return 'gray';
  return 'gray';
};

/**
 * 获取判题结果文本
 */
const getStatusText = (status: string) => {
  if (!status) return '未知';
  const s = status.trim();
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
  return enMap[s] || cnMap[s] || s || '未知';
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
  };
  return colorMap[language?.toLowerCase()] || "gray";
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>