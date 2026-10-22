<template>
  <div id="reviewQuestionView">
    <h2>题目审核</h2>
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
      <template #difficulty="{ record }">
        <a-tag v-if="record.difficulty === 0" color="green">简单</a-tag>
        <a-tag v-else-if="record.difficulty === 1" color="orange">中等</a-tag>
        <a-tag v-else-if="record.difficulty === 2" color="red">困难</a-tag>
      </template>
      <template #user="{ record }">
        <span v-if="record.user">{{ record.user.userName || "未知用户" }}</span>
        <span v-else>未知用户</span>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="text" @click="handleView(record)">查看</a-button>
          <a-button type="text" status="success" @click="handleReview(record, 1)">通过</a-button>
          <a-button type="text" status="danger" @click="handleReject(record)">拒绝</a-button>
        </a-space>
      </template>
    </a-table>

    <!-- 查看题目详情弹窗 -->
    <a-modal v-model:visible="detailVisible" title="题目详情" :footer="false" width="800px">
      <template v-if="currentQuestion">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="题号">{{ currentQuestion.questionNumber }}</a-descriptions-item>
          <a-descriptions-item label="标题">{{ currentQuestion.title }}</a-descriptions-item>
          <a-descriptions-item label="难度">
            <a-tag v-if="currentQuestion.difficulty === 0" color="green">简单</a-tag>
            <a-tag v-else-if="currentQuestion.difficulty === 1" color="orange">中等</a-tag>
            <a-tag v-else-if="currentQuestion.difficulty === 2" color="red">困难</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="标签">
            <a-tag v-for="(tag, i) in parseTags(currentQuestion.tags)" :key="i">{{ tag }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
        <a-divider />
        <h4>题目描述</h4>
        <MdViewer :value="currentQuestion.content || ''" />
        <h4 style="margin-top: 16px;">参考答案</h4>
        <MdViewer :value="currentQuestion.answer || ''" />
        <h4 style="margin-top: 16px;">判题用例</h4>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow: auto; max-height: 200px;">{{ formatJson(currentQuestion.judgeCase) }}</pre>
        <h4 style="margin-top: 16px;">判题配置</h4>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow: auto; max-height: 200px;">{{ formatJson(currentQuestion.judgeConfig) }}</pre>
        <a-divider />
        <!-- 审核操作按钮 -->
        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <a-button status="danger" @click="handleRejectFromDetail">拒绝</a-button>
          <a-button type="primary" status="success" @click="handleApproveFromDetail">同意</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 拒绝原因弹窗 -->
    <a-modal v-model:visible="rejectVisible" title="拒绝原因" @ok="confirmReject" @cancel="rejectVisible = false">
      <a-textarea v-model="rejectRemark" placeholder="请输入拒绝原因" :auto-size="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listReviewQuestionsUsingPost, reviewQuestionUsingPost } from "@/api/questionController";
import MdViewer from "@/components/MdViewer.vue";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const detailVisible = ref(false);
const currentQuestion = ref<any>(null);

const rejectVisible = ref(false);
const rejectRemark = ref("");
const rejectTarget = ref<any>(null);

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
    title: "出题人",
    slotName: "user",
    width: 120,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    width: 160,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 200,
  },
];

const parseTags = (tags: string) => {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
};

const formatJson = (str: string) => {
  if (!str) return "";
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
};

const loadData = async () => {
  try {
    const res = await listReviewQuestionsUsingPost({
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

const handleView = (record: any) => {
  currentQuestion.value = record;
  detailVisible.value = true;
};

const handleReview = async (record: any, status: number) => {
  try {
    const res = await reviewQuestionUsingPost({
      id: record.id,
      reviewStatus: status,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success(status === 1 ? "审核通过" : "已拒绝");
      loadData();
    } else {
      message.error("操作失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("操作失败");
  }
};

// 从详情弹窗中同意（关闭弹窗并刷新列表）
const handleApproveFromDetail = async () => {
  if (!currentQuestion.value) return;
  try {
    const res = await reviewQuestionUsingPost({
      id: currentQuestion.value.id,
      reviewStatus: 1,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("审核通过");
      detailVisible.value = false;
      loadData();
    } else {
      message.error("操作失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("操作失败");
  }
};

// 从详情弹窗中拒绝（打开拒绝原因弹窗）
const handleRejectFromDetail = () => {
  if (!currentQuestion.value) return;
  rejectTarget.value = currentQuestion.value;
  rejectRemark.value = "";
  rejectVisible.value = true;
};

const handleReject = (record: any) => {
  rejectTarget.value = record;
  rejectRemark.value = "";
  rejectVisible.value = true;
};

const confirmReject = async () => {
  if (!rejectTarget.value) return;
  try {
    const res = await reviewQuestionUsingPost({
      id: rejectTarget.value.id,
      reviewStatus: 2,
      reviewRemark: rejectRemark.value,
    });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("已拒绝");
      rejectVisible.value = false;
      detailVisible.value = false;
      loadData();
    } else {
      message.error("操作失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("操作失败");
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#reviewQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
