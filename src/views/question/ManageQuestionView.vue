<template>
  <div id="manageQuestionView">
    <a-form :model="searchParams" layout="inline" style="margin-bottom: 16px;">
      <a-form-item field="isPublic" label="可见性">
        <a-select v-model="searchParams.isPublic" placeholder="全部" allow-clear style="width: 150px;">
          <a-option :value="1">公开</a-option>
          <a-option :value="0">仅比赛可见</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-table :ref="tableRef" :columns="columns" :data="dataList" :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }" @page-change="onPageChange">
      <!-- 自定义内容列 -->
      <template #content="{ record }">
        <div class="ellipsed-column">
          {{ record.content }}
        </div>
      </template>
      <!-- 自定义标签列 -->
      <template #tags="{ record }">
        <div style="width: 110px;">
          <a-tag v-for="tag in JSON.parse(record.tags)" :key="tag" :checkable="true" :default-checked="true"
            style="margin-left: 10px;" color="green">
            {{ tag }}
          </a-tag>
        </div>
      </template>
      <!-- 自定义可见性列 -->
      <template #isPublic="{ record }">
        <a-tag v-if="record.isPublic === 1" color="green">公开</a-tag>
        <a-tag v-else-if="record.isPublic === 0" color="orange">仅比赛可见</a-tag>
        <a-tag v-else color="gray">未设置</a-tag>
      </template>
      <template #createTime="{ record }">
        <div style="width: 100px;">
          {{ moment(record.createTime).format("YYYY-MM-DD") }}
        </div>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>

    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Page_Question_,
  Question,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
  isPublic: undefined as number | undefined,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    console.log('res--manage', res.data);

    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 搜索按钮点击
 */
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadData();
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
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    slotName: "content",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "可见性",
    slotName: "isPublic",
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

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style scoped>
#manageQuestionView .ellipsed-column {
  width: 150px;
  height: 50px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>