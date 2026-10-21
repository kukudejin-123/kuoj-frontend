<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionNumber" label="题号" style="min-width: 160px">
        <a-input-number v-model="searchParams.questionNumber" placeholder="请输入题号" allow-clear :min="1000" />
      </a-form-item>
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item field="difficulty" label="难度" style="min-width: 160px">
        <a-select v-model="searchParams.difficulty" placeholder="请选择难度" allow-clear>
          <a-option :value="0">简单</a-option>
          <a-option :value="1">中等</a-option>
          <a-option :value="2">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 200px">
        <a-select v-model="searchParams.tagInput" placeholder="请选择标签" allow-clear allow-search>
          <a-option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="sortField" label="排序" style="min-width: 160px">
        <a-select v-model="searchParams.sortField" placeholder="排序方式" allow-clear>
          <a-option value="questionNumber">按题号</a-option>
          <a-option value="submitNum">按提交数</a-option>
          <a-option value="acceptedNum">按通过数</a-option>
          <a-option value="createTime">按创建时间</a-option>
        </a-select>
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
    >
      <template #difficulty="{ record }">
        <a-tag v-if="record.difficulty === 0" color="green">简单</a-tag>
        <a-tag v-else-if="record.difficulty === 1" color="orange">中等</a-tag>
        <a-tag v-else-if="record.difficulty === 2" color="red">困难</a-tag>
        <a-tag v-else color="gray">未知</a-tag>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="arcoblue"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        <span>{{ calculateRate(record) }}%</span>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)">
            做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Question,
  QuestionControllerService as GeneratedQuestionControllerService,
} from "../../../generated";
import { getAllTagsUsingGet, listQuestionVoByPageUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
// 所有标签列表
const allTags = ref<string[]>([]);
// 搜索参数
const searchParams = ref<any>({
  questionNumber: undefined,
  title: "",
  tagInput: "",
  difficulty: undefined,
  sortField: undefined,
  sortOrder: "descend",
  pageSize: 8,
  current: 1,
});

// 计算通过率（返回 0-100 之间的值，a-progress 需要百分比）
const calculateRate = (record: any) => {
  if (!record.submitNum || record.submitNum === 0) return 0;
  const rate = (record.acceptedNum || 0) / record.submitNum;
  // 上限保护，防止 acceptedNum > submitNum 时显示超过 100%
  return Math.min(Math.round(rate * 100), 100);
};

// 加载所有标签
const loadAllTags = async () => {
  try {
    const res = await getAllTagsUsingGet();
    // 兼容两种返回格式
    if (res.data?.code === 0 || res.code === 0) {
      const tagsData = res.data?.data ?? res.data ?? [];
      allTags.value = Array.isArray(tagsData) ? tagsData : [];
    } else {
      console.error("加载标签失败:", res.data?.message || res.message);
    }
  } catch (e) {
    console.error("加载标签异常", e);
  }
};

const loadData = async () => {
  // 构建查询参数
  const params: any = {
    title: searchParams.value.title,
    pageSize: searchParams.value.pageSize,
    current: searchParams.value.current,
  };
  // 添加题号筛选
  if (searchParams.value.questionNumber !== undefined && searchParams.value.questionNumber !== null) {
    params.questionNumber = searchParams.value.questionNumber;
  }
  // 添加难度筛选
  if (searchParams.value.difficulty !== undefined && searchParams.value.difficulty !== null) {
    params.difficulty = searchParams.value.difficulty;
  }
  // 添加标签筛选
  if (searchParams.value.tagInput) {
    params.tags = [searchParams.value.tagInput];
  }
  // 添加排序
  if (searchParams.value.sortField) {
    params.sortField = searchParams.value.sortField;
    params.sortOrder = searchParams.value.sortOrder;
  }

  try {
    const res = await listQuestionVoByPageUsingPost(params);
    // 兼容两种返回格式
    const resData = res.data || res;
    if (resData.code === 0) {
      dataList.value = resData.data?.records || resData.records || [];
      total.value = resData.data?.total || resData.total || 0;
    } else {
      message.error("加载失败，" + (resData.message || ""));
    }
  } catch (e) {
    message.error("加载失败");
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadAllTags();
  loadData();
});

const columns = [
  {
    title: "题号",
    dataIndex: "questionNumber",
    width: 80,
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "难度",
    slotName: "difficulty",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
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
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
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
 * 清空搜索条件
 */
const doClear = () => {
  searchParams.value = {
    questionNumber: undefined,
    title: "",
    tagInput: "",
    difficulty: undefined,
    sortField: undefined,
    sortOrder: "descend",
    pageSize: 8,
    current: 1,
  };
  loadData();
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
