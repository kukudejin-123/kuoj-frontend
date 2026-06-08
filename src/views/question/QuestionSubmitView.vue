<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select v-model="searchParams.language" :style="{ width: '320px' }" placeholder="选择编程语言">
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table :ref="tableRef" :columns="columns" :data="dataList" :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }" @page-change="onPageChange">
      <template #code="{ record }">
        <pre v-if="record.code" style="max-width: 300px; max-height: 150px; overflow: auto; background: #f5f5f5; padding: 8px; border-radius: 4px;"><code>{{ record.code }}</code></pre>
        <span v-else style="color: #999;">代码已隐藏</span>
      </template>
      <template #judgeInfo="{ record }">
        <a-descriptions :data="transformJudgeInfo(record.judgeInfo)" layout="inline-horizontal" size="small" />
      </template>
      <!-- 判题状态 -->
      <template #status="{ record }">
        {{ formatStatus(record.status) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
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
    }
  );
  if (res.code === 0) {
    // console.log('res.data---question_submit',res.data);
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
    title: "题目标题",
    dataIndex: "questionVO.title",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "提交者",
    dataIndex: "userVO.userName",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
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
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
// 将 judgeInfo 对象转换为 descriptions 需要的数组形式
const transformJudgeInfo = (judgeInfo: Record<string, any>) => {
  return Object.keys(judgeInfo).map(key => {

    if (key === 'time') {
      return {
        label: key,
        value: `${judgeInfo[key]}ms`
      };
    }

    if (key === 'memory') {
      return {
        label: key,
        value: `${judgeInfo[key]}kb`
      };
    }

    return {
      label: key,
      value: `${judgeInfo[key]}`
    };
  });
};

// 根据 status 返回对应的状态字符串
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
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
