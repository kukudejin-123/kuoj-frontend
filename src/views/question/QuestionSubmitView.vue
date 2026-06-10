<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
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
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
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
      <template #status="{ record }">
        <a-tag :color="getSubmitStatusColor(record.status)">
          {{ formatStatus(record.status) }}
        </a-tag>
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
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    },
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
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
    title: "判题信息",
    slotName: "judgeInfo",
    width: 200,
  },
  {
    title: "状态",
    slotName: "status",
    width: 100,
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
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
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
};

/**
 * 获取判题结果颜色
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
    case 'Presentation Error':
      return 'gold';
    case 'Output Limit Exceeded':
      return 'orange';
    default:
      return 'gray';
  }
};

/**
 * 获取判题结果文本
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
  return statusMap[status] || status || '未知';
};

/**
 * 获取提交状态颜色
 */
const getSubmitStatusColor = (status: string) => {
  switch (status) {
    case '0':
      return 'gray';
    case '1':
      return 'blue';
    case '2':
      return 'green';
    case '3':
      return 'red';
    default:
      return 'gray';
  }
};

/**
 * 根据 status 返回对应的状态字符串
 */
const formatStatus = (status: string) => {
  switch (status) {
    case "0":
      return "待判题";
    case "1":
      return "判题中";
    case "2":
      return "成功";
    case "3":
      return "失败";
    default:
      return "未知状态";
  }
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
