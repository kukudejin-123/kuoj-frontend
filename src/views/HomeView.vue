<template>
  <div id="homeView">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">
          <span class="gradient-text">酷OJ</span>
          在线判题系统
        </h1>
        <p class="banner-desc">
          一个专注于算法竞赛的在线评测平台，支持多语言提交、多种判题策略
        </p>
        <div class="banner-actions">
          <a-button type="primary" size="large" @click="router.push('/questions')">
            开始做题
            <template #icon><icon-edit /></template>
          </a-button>
          <a-button size="large" @click="router.push('/contests')">
            查看比赛
            <template #icon><icon-trophy /></template>
          </a-button>
        </div>
      </div>
      <div class="banner-illustration">
        <div class="code-block">
          <div class="code-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <pre class="code-content"><code>public class Solution {
    public int solve(int n) {
        return n * n + 1;
    }
}</code></pre>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <icon-file />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalQuestions }}</span>
            <span class="stat-label">题目总数</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <icon-check-circle />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalSubmissions }}</span>
            <span class="stat-label">总提交数</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <icon-user-group />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">注册用户</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <icon-trophy />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalContests }}</span>
            <span class="stat-label">已举办比赛</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 近期比赛 -->
      <div class="content-card contests-section">
        <div class="card-header">
          <h2>
            <icon-trophy style="margin-right: 8px; color: #ff7d00" />
            近期比赛
          </h2>
          <a-link @click="router.push('/contests')">查看全部</a-link>
        </div>
        <div class="contests-list" v-if="contests.length > 0">
          <div
            class="contest-item"
            v-for="contest in contests"
            :key="contest.id"
            @click="router.push(`/contest/${contest.id}`)"
          >
            <div class="contest-status" :class="getContestStatusClass(contest)">
              {{ getContestStatusText(contest) }}
            </div>
            <div class="contest-info">
              <h3 class="contest-title">{{ contest.title }}</h3>
              <div class="contest-meta">
                <span>
                  <icon-clock-circle />
                  {{ formatTime(contest.startTime) }}
                </span>
                <span>
                  <icon-user />
                  {{ contest.participantCount || 0 }} 人参与
                </span>
              </div>
            </div>
          </div>
        </div>
        <a-empty v-else description="暂无比赛" />
      </div>

      <!-- 热门题目 -->
      <div class="content-card questions-section">
        <div class="card-header">
          <h2>
            <icon-fire style="margin-right: 8px; color: #f53f3f" />
            热门题目
          </h2>
          <a-link @click="router.push('/questions')">查看全部</a-link>
        </div>
        <div class="questions-list" v-if="questions.length > 0">
          <div
            class="question-item"
            v-for="question in questions"
            :key="question.id"
            @click="router.push(`/view/question/${question.id}`)"
          >
            <div class="question-number">#{{ question.questionNumber }}</div>
            <div class="question-info">
              <h3 class="question-title">{{ question.title }}</h3>
              <div class="question-meta">
                <a-tag :color="getDifficultyColor(question.difficulty)" size="small">
                  {{ getDifficultyText(question.difficulty) }}
                </a-tag>
                <span class="accept-rate">
                  通过率: {{ calculateRate(question) }}%
                </span>
              </div>
            </div>
            <div class="question-stats">
              <span>
                <icon-check-circle style="color: #00b42a" />
                {{ question.acceptedNum || 0 }}
              </span>
              <span>
                <icon-send style="color: #165dff" />
                {{ question.submitNum || 0 }}
              </span>
            </div>
          </div>
        </div>
        <a-empty v-else description="暂无题目" />
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-links">
      <div class="quick-link-card" @click="router.push('/questions')">
        <icon-code-block class="quick-icon" />
        <span>题库</span>
      </div>
      <div class="quick-link-card" @click="router.push('/contests')">
        <icon-trophy class="quick-icon" />
        <span>比赛</span>
      </div>
      <div class="quick-link-card" @click="router.push('/ranking')">
        <icon-bar-chart class="quick-icon" />
        <span>排行榜</span>
      </div>
      <div class="quick-link-card" @click="router.push('/teams')">
        <icon-user-group class="quick-icon" />
        <span>团队</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  listQuestionVoByPageUsingPost,
  getGlobalStatisticsUsingGet,
} from "@/api/questionController";
import {
  listContestByPageUsingPost,
} from "@/api/contestController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import {
  IconEdit,
  IconTrophy,
  IconFile,
  IconCheckCircle,
  IconUserGroup,
  IconClockCircle,
  IconUser,
  IconFire,
  IconCodeBlock,
  IconBarChart,
  IconSend,
} from "@arco-design/web-vue/es/icon";

const router = useRouter();

// 统计数据
const stats = reactive({
  totalQuestions: 0,
  totalSubmissions: 0,
  totalUsers: 0,
  totalContests: 0,
});

// 比赛列表
const contests = ref<any[]>([]);
// 题目列表
const questions = ref<any[]>([]);

// 加载统计数据
const loadStats = async () => {
  try {
    // 调用全局统计接口
    const res = await getGlobalStatisticsUsingGet();
    if (res.data?.code === 0 || res.code === 0) {
      const data = res.data?.data || res.data;
      stats.totalQuestions = data.totalQuestions || 0;
      stats.totalSubmissions = data.totalSubmissions || 0;
      stats.totalUsers = data.totalUsers || 0;
      stats.totalContests = data.totalContests || 0;
    }
  } catch (e) {
    console.error("加载统计失败", e);
  }
};

// 加载近期比赛
const loadContests = async () => {
  try {
    const res = await listContestByPageUsingPost({
      pageSize: 5,
      current: 1,
      sortField: "startTime",
      sortOrder: "descend",
    });
    if (res.data?.code === 0 || res.code === 0) {
      const data = res.data?.data || res.data;
      contests.value = data.records || [];
    }
  } catch (e) {
    console.error("加载比赛失败", e);
  }
};

// 加载热门题目
const loadQuestions = async () => {
  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 6,
      current: 1,
      sortField: "submitNum",
      sortOrder: "descend",
    });
    if (res.data?.code === 0 || res.code === 0) {
      const data = res.data?.data || res.data;
      questions.value = data.records || [];
    }
  } catch (e) {
    console.error("加载题目失败", e);
  }
};

// 格式化时间
const formatTime = (time: string) => {
  return moment(time).format("YYYY-MM-DD HH:mm");
};

// 获取比赛状态
const getContestStatusClass = (contest: any) => {
  const now = moment();
  const start = moment(contest.startTime);
  const end = moment(contest.endTime);

  if (now.isBefore(start)) return "status-upcoming";
  if (now.isAfter(end)) return "status-ended";
  return "status-ongoing";
};

const getContestStatusText = (contest: any) => {
  const now = moment();
  const start = moment(contest.startTime);
  const end = moment(contest.endTime);

  if (now.isBefore(start)) return "未开始";
  if (now.isAfter(end)) return "已结束";
  return "进行中";
};

// 获取难度颜色
const getDifficultyColor = (difficulty: number) => {
  const colors: Record<number, string> = {
    0: "green",
    1: "orange",
    2: "red",
  };
  return colors[difficulty] || "gray";
};

// 获取难度文字
const getDifficultyText = (difficulty: number) => {
  const texts: Record<number, string> = {
    0: "简单",
    1: "中等",
    2: "困难",
  };
  return texts[difficulty] || "未知";
};

// 计算通过率
const calculateRate = (record: any) => {
  if (!record.submitNum || record.submitNum === 0) return 0;
  return Math.round((record.acceptedNum / record.submitNum) * 100);
};

onMounted(() => {
  loadStats();
  loadContests();
  loadQuestions();
});
</script>

<style scoped>
#homeView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

/* 欢迎横幅 */
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 16px;
  padding: 40px 50px;
  margin-bottom: 24px;
  color: #fff;
  overflow: hidden;
  position: relative;
}

.welcome-banner::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(22, 93, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.banner-content {
  flex: 1;
  z-index: 1;
}

.banner-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(90deg, #165dff, #00f2fe, #43e97b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
  max-width: 400px;
}

.banner-actions {
  display: flex;
  gap: 16px;
}

.banner-illustration {
  position: relative;
  z-index: 1;
}

.code-block {
  background: #0d1117;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.code-header {
  background: #161b22;
  padding: 12px 16px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.code-content {
  padding: 20px;
  margin: 0;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 14px;
  color: #c9d1d9;
  line-height: 1.6;
}

.code-content code {
  color: inherit;
}

/* 统计数据 */
.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
}

.stat-label {
  font-size: 14px;
  color: #86909c;
  margin-top: 4px;
}

/* 主要内容 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.content-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

/* 比赛列表 */
.contests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contest-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f7f8fa;
  cursor: pointer;
  transition: background 0.2s;
}

.contest-item:hover {
  background: #f0f1f3;
}

.contest-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-upcoming {
  background: #e8fffb;
  color: #00b42a;
}

.status-ongoing {
  background: #fff7e8;
  color: #ff7d00;
}

.status-ended {
  background: #f2f3f5;
  color: #86909c;
}

.contest-info {
  flex: 1;
  min-width: 0;
}

.contest-title {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contest-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #86909c;
}

.contest-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 题目列表 */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f7f8fa;
  cursor: pointer;
  transition: background 0.2s;
}

.question-item:hover {
  background: #f0f1f3;
}

.question-number {
  font-size: 14px;
  font-weight: 600;
  color: #165dff;
  min-width: 50px;
}

.question-info {
  flex: 1;
  min-width: 0;
}

.question-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.accept-rate {
  font-size: 12px;
  color: #86909c;
}

.question-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #86909c;
}

.question-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 快速入口 */
.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-link-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.quick-link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.quick-icon {
  font-size: 32px;
  color: #165dff;
}

.quick-link-card span {
  font-size: 15px;
  font-weight: 500;
  color: #1d2129;
}

/* 响应式 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .quick-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }

  .banner-title {
    font-size: 32px;
  }

  .banner-desc {
    max-width: 100%;
  }

  .banner-actions {
    justify-content: center;
  }

  .banner-illustration {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
