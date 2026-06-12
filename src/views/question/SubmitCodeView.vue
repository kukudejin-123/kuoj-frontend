<template>
  <div id="submitCodeView">
    <a-card v-if="submitRecord" :title="`提交记录 #${submitRecord.id}`">
      <template #extra>
        <a-space>
          <a-button v-if="submitRecord.code" type="primary" @click="copyCode">
            复制代码
          </a-button>
          <a-button @click="goBack">返回</a-button>
        </a-space>
      </template>

      <a-descriptions :data="descriptionsData" layout="inline-horizontal" :column="{ xs: 1, md: 2, lg: 3 }" />

      <a-divider />

      <div class="code-section">
        <div class="code-header">
          <span class="code-title">提交代码</span>
          <span class="code-language">{{ submitRecord.language }}</span>
        </div>
        <pre class="code-block"><code>{{ submitRecord.code || '无权查看代码' }}</code></pre>
      </div>

      <a-divider />

      <div class="judge-section" v-if="submitRecord.judgeInfo">
        <div class="judge-header">判题信息</div>
        <a-descriptions :data="judgeInfoData" layout="inline-horizontal" :column="{ xs: 1, md: 2, lg: 3 }" />
      </div>
    </a-card>

    <a-empty v-else description="加载中或记录不存在" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

interface Props {
  id: string;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();

const submitRecord = ref<any>(null);
const loading = ref(false);

const loadData = async () => {
  const submitId = props.id || route.params.id;
  if (!submitId) {
    message.error("提交记录ID不能为空");
    return;
  }
  loading.value = true;
  try {
    // 使用列表接口查询
    console.log("查询提交记录，ID:", submitId);
    const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost({
      current: 1,
      pageSize: 1,
      id: submitId as any,
    });
    console.log("查询结果:", res);
    if (res.code === 0 && res.data?.records && res.data.records.length > 0) {
      submitRecord.value = res.data.records[0];
    } else {
      message.error("提交记录不存在或无权查看：" + (res.message || "未知错误"));
    }
  } catch (error) {
    console.error("加载提交记录失败:", error);
    message.error("加载失败");
  } finally {
    loading.value = false;
  }
};

const descriptionsData = computed(() => {
  if (!submitRecord.value) return [];
  return [
    { label: "题目标题", value: submitRecord.value.questionVO?.title || "-" },
    { label: "编程语言", value: submitRecord.value.language || "-" },
    { label: "判题状态", value: formatStatus(submitRecord.value.status) },
    { label: "提交者", value: submitRecord.value.userVO?.userName || "-" },
    { label: "提交时间", value: submitRecord.value.createTime || "-" },
  ];
});

const judgeInfoData = computed(() => {
  if (!submitRecord.value?.judgeInfo) return [];
  const info = submitRecord.value.judgeInfo;
  const data = [];
  if (info.message !== undefined) {
    data.push({ label: "结果", value: info.message });
  }
  if (info.time !== undefined) {
    data.push({ label: "执行时间", value: `${info.time}ms` });
  }
  if (info.memory !== undefined) {
    data.push({ label: "内存占用", value: `${info.memory}KB` });
  }
  return data;
});

const copyCode = () => {
  if (!submitRecord.value?.code) {
    message.warning("没有可复制的代码");
    return;
  }
  navigator.clipboard.writeText(submitRecord.value.code).then(() => {
    message.success("代码已复制到剪贴板");
  }).catch((err) => {
    console.error("复制失败:", err);
    message.error("复制失败");
  });
};

const goBack = () => {
  router.back();
};

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

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#submitCodeView {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.code-language {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
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
  max-height: 600px;
  overflow-y: auto;
}

.judge-section {
  margin-top: 16px;
}

.judge-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
</style>
