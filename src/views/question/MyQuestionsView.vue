<template>
  <div id="myQuestionsView">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2>我的出题</h2>
      <a-button type="primary" @click="toAddQuestion">提交新题目</a-button>
    </div>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
      row-key="id"
    >
      <template #reviewStatus="{ record }">
        <a-tag v-if="record.reviewStatus === 0" color="orange">待审核</a-tag>
        <a-tag v-else-if="record.reviewStatus === 1" color="green">已通过</a-tag>
        <a-tag v-else-if="record.reviewStatus === 2" color="red">已拒绝</a-tag>
        <a-tag v-else color="gray">未知</a-tag>
      </template>
      <template #difficulty="{ record }">
        <a-tag v-if="record.difficulty === 0" color="green">简单</a-tag>
        <a-tag v-else-if="record.difficulty === 1" color="orange">中等</a-tag>
        <a-tag v-else-if="record.difficulty === 2" color="red">困难</a-tag>
      </template>
      <template #reviewRemark="{ record }">
        <span v-if="record.reviewRemark">{{ record.reviewRemark }}</span>
        <span v-else style="color: #999;">-</span>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { listMyQuestionsUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const router = useRouter();
const dataList = ref([]);
const total = ref(0);

const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const columns = [
  {
    title: "题号",
    dataIndex: "questionNumber",
    width: 80,
  },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "难度",
    slotName: "difficulty",
    width: 80,
  },
  {
    title: "审核状态",
    slotName: "reviewStatus",
    width: 100,
  },
  {
    title: "审核备注",
    slotName: "reviewRemark",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    width: 160,
  },
];

const loadData = async () => {
  try {
    const res = await listMyQuestionsUsingPost({
      current: searchParams.value.current,
      pageSize: searchParams.value.pageSize,
    });
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

const onPageChange = (page: number) => {
  searchParams.value.current = page;
  loadData();
};

const toAddQuestion = () => {
  router.push("/question/user/add");
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#myQuestionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
