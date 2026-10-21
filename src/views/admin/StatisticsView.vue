<template>
  <div id="statisticsView">
    <h2>数据统计</h2>

    <!-- 总览卡片 -->
    <a-row :gutter="16" style="margin-bottom: 16px;">
      <a-col :span="6">
        <a-statistic title="总用户数" :value="overview.totalUsers || 0" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="活跃用户" :value="overview.activeUsers || 0" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="总题目数" :value="overview.totalQuestions || 0" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="待审核题目" :value="overview.pendingReview || 0" />
      </a-col>
    </a-row>
    <a-row :gutter="16" style="margin-bottom: 24px;">
      <a-col :span="6">
        <a-statistic title="总提交数" :value="overview.totalSubmissions || 0" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="通过提交数" :value="overview.acceptedSubmissions || 0" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="总通过率" :value="overview.acceptRate || 0" suffix="%" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="总比赛数" :value="overview.totalContests || 0" />
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <!-- 用户活跃度 -->
      <a-col :span="12">
        <a-card title="用户活跃度（近30天）" style="margin-bottom: 16px;">
          <a-descriptions :column="1">
            <a-descriptions-item label="新增用户">{{ activity.newUsersLast30Days || 0 }}</a-descriptions-item>
            <a-descriptions-item label="活跃用户">{{ activity.activeUsersLast30Days || 0 }}</a-descriptions-item>
            <a-descriptions-item label="提交次数">{{ activity.submissionsLast30Days || 0 }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <h4>近7天提交趋势</h4>
          <div ref="trendChart" style="height: 200px;"></div>
        </a-card>
      </a-col>

      <!-- 题目通过率分布 -->
      <a-col :span="12">
        <a-card title="题目通过率分布" style="margin-bottom: 16px;">
          <div ref="passRateChart" style="height: 250px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <!-- 提交次数分布 -->
      <a-col :span="12">
        <a-card title="用户提交次数分布" style="margin-bottom: 16px;">
          <div ref="submitDistChart" style="height: 250px;"></div>
        </a-card>
      </a-col>

      <!-- 语言使用分布 -->
      <a-col :span="12">
        <a-card title="编程语言使用分布" style="margin-bottom: 16px;">
          <div ref="langChart" style="height: 250px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 热门题目 -->
    <a-card title="热门题目 Top 10" style="margin-top: 16px;">
      <a-table
        :columns="topQuestionColumns"
        :data="passRate.topQuestions || []"
        :pagination="false"
        row-key="questionNumber"
      >
        <template #passRate="{ record }">
          {{ record.passRate }}%
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getOverviewUsingGet,
  getUserActivityUsingGet,
  getQuestionPassRateUsingGet,
  getSubmitDistributionUsingGet,
  getLanguageDistributionUsingGet,
} from "@/api/statisticsController";
import message from "@arco-design/web-vue/es/message";

const overview = ref<any>({});
const activity = ref<any>({});
const passRate = ref<any>({});
const submitDist = ref<any>({});
const langDist = ref<any>({});

const trendChart = ref<HTMLElement>();
const passRateChart = ref<HTMLElement>();
const submitDistChart = ref<HTMLElement>();
const langChart = ref<HTMLElement>();

const topQuestionColumns = [
  { title: "题号", dataIndex: "questionNumber", width: 80 },
  { title: "标题", dataIndex: "title", ellipsis: true, tooltip: true },
  { title: "提交数", dataIndex: "submitNum", width: 100 },
  { title: "通过数", dataIndex: "acceptedNum", width: 100 },
  { title: "通过率", slotName: "passRate", width: 100 },
];

// 简单的柱状图渲染（使用 div 模拟）
const renderBarChart = (container: HTMLElement | undefined, data: { label: string; value: number }[], color: string) => {
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...data.map((d) => d.value), 1);
  data.forEach((item) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;margin-bottom:8px;gap:8px;";
    const label = document.createElement("span");
    label.style.cssText = "width:60px;text-align:right;font-size:12px;color:#666;flex-shrink:0;";
    label.textContent = item.label;
    const barContainer = document.createElement("div");
    barContainer.style.cssText = "flex:1;background:#f0f0f0;border-radius:4px;height:20px;position:relative;";
    const bar = document.createElement("div");
    bar.style.cssText = `width:${(item.value / max) * 100}%;background:${color};height:100%;border-radius:4px;transition:width 0.3s;`;
    const value = document.createElement("span");
    value.style.cssText = "position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:12px;color:#333;";
    value.textContent = String(item.value);
    barContainer.appendChild(bar);
    barContainer.appendChild(value);
    row.appendChild(label);
    row.appendChild(barContainer);
    container.appendChild(row);
  });
};

const loadData = async () => {
  try {
    const [overviewRes, activityRes, passRateRes, submitDistRes, langDistRes] = await Promise.all([
      getOverviewUsingGet(),
      getUserActivityUsingGet(),
      getQuestionPassRateUsingGet(),
      getSubmitDistributionUsingGet(),
      getLanguageDistributionUsingGet(),
    ]);

    const getData = (res: any) => res.data?.data || res.data || res;
    overview.value = getData(overviewRes) || {};
    activity.value = getData(activityRes) || {};
    passRate.value = getData(passRateRes) || {};
    submitDist.value = getData(submitDistRes) || {};
    langDist.value = getData(langDistRes) || {};

    // 渲染图表
    const trend = activity.value.dailyTrend || [];
    renderBarChart(trendChart.value, trend.map((t: any) => ({ label: t.date, value: t.count })), "#165DFF");

    const dist = passRate.value.distribution || [0, 0, 0, 0, 0];
    renderBarChart(passRateChart.value, [
      { label: "0-20%", value: dist[0] },
      { label: "20-40%", value: dist[1] },
      { label: "40-60%", value: dist[2] },
      { label: "60-80%", value: dist[3] },
      { label: "80-100%", value: dist[4] },
    ], "#00B42A");

    const sDist = submitDist.value.distribution || [0, 0, 0, 0, 0];
    renderBarChart(submitDistChart.value, [
      { label: "0次", value: sDist[0] },
      { label: "1-5次", value: sDist[1] },
      { label: "6-20次", value: sDist[2] },
      { label: "21-50次", value: sDist[3] },
      { label: "50+次", value: sDist[4] },
    ], "#FF7D00");

    const langs = langDist.value.languages || [];
    renderBarChart(langChart.value, langs.map((l: any) => ({ label: l.language, value: l.count })), "#722ED1");
  } catch (e) {
    message.error("加载统计数据失败");
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#statisticsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
