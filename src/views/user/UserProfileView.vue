<template>
  <div id="userProfileView">
    <a-row :gutter="[24, 24]">
      <!-- 左侧：用户信息卡片 -->
      <a-col :md="8" :xs="24">
        <a-card title="个人信息">
          <div style="text-align: center; margin-bottom: 24px;">
            <a-avatar :size="80" :style="{ backgroundColor: '#3370ff' }">
              {{ userInfo.userName ? userInfo.userName.charAt(0).toUpperCase() : 'U' }}
            </a-avatar>
            <h3 style="margin-top: 16px; margin-bottom: 4px;">{{ userInfo.userName || '未设置昵称' }}</h3>
            <a-tag :color="getUserRoleColor(userInfo.userRole)">
              {{ getUserRoleText(userInfo.userRole) }}
            </a-tag>
          </div>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="账号">
              {{ userInfo.userAccount }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ userInfo.userProfile || '这个人很懒，什么都没写~' }}
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              {{ formatTime(userInfo.createTime) }}
            </a-descriptions-item>
          </a-descriptions>
          <div style="margin-top: 24px; text-align: center;">
            <a-button type="primary" @click="showEditModal">
              编辑资料
            </a-button>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧：统计信息和提交记录 -->
      <a-col :md="16" :xs="24">
        <!-- 统计卡片 -->
        <a-row :gutter="[16, 16]" style="margin-bottom: 24px;">
          <a-col :span="8">
            <a-card>
              <a-statistic title="提交次数" :value="statistics.submitCount" show-group-separator>
                <template #suffix>
                  <span style="font-size: 14px; color: #999;">次</span>
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card>
              <a-statistic title="通过次数" :value="statistics.acceptCount" show-group-separator>
                <template #suffix>
                  <span style="font-size: 14px; color: #999;">次</span>
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card>
              <a-statistic title="通过率" :value="statistics.acceptRate" :precision="1">
                <template #suffix>%</template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>

        <!-- 最近提交记录 -->
        <a-card title="最近提交">
          <a-table
            :columns="columns"
            :data="submitList"
            :pagination="false"
            :loading="loading"
          >
            <template #status="{ record }">
              <a-tag :color="getStatusColor(record.judgeInfo?.message)">
                {{ getStatusText(record.judgeInfo?.message) }}
              </a-tag>
            </template>
            <template #createTime="{ record }">
              {{ formatTime(record.createTime) }}
            </template>
            <template #action="{ record }">
              <a-button type="text" size="small" @click="viewCode(record)">
                查看详情
              </a-button>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- 编辑资料弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑个人资料"
      @ok="handleUpdateUser"
      @cancel="editModalVisible = false"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="昵称">
          <a-input v-model="editForm.userName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="个人简介">
          <a-textarea
            v-model="editForm.userProfile"
            placeholder="介绍一下自己吧~"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { UserControllerService, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const router = useRouter();

// 用户信息
const userInfo = ref<any>({});
const loading = ref(false);

// 统计数据
const statistics = reactive({
  submitCount: 0,
  acceptCount: 0,
  acceptRate: 0,
});

// 最近提交记录
const submitList = ref([]);

// 编辑表单
const editModalVisible = ref(false);
const editForm = reactive({
  userName: "",
  userProfile: "",
});

// 表格列定义
const columns = [
  {
    title: "题目",
    dataIndex: "questionVO.title",
  },
  {
    title: "语言",
    dataIndex: "language",
    width: 100,
  },
  {
    title: "状态",
    slotName: "status",
    width: 120,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    width: 180,
  },
  {
    title: "操作",
    slotName: "action",
    width: 100,
  },
];

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code === 0 && res.data) {
      userInfo.value = res.data;
    } else {
      message.error("获取用户信息失败");
    }
  } catch (error) {
    message.error("获取用户信息失败");
  }
};

// 加载统计数据
const loadStatistics = async () => {
  try {
    // 调用统计接口获取提交次数和通过次数
    const statRes = await QuestionControllerService.getUserSubmitStatisticsUsingGet();
    if (statRes.code === 0 && statRes.data) {
      // 后端 Long 类型返回字符串，需要转换为数字
      statistics.submitCount = Number(statRes.data.submitCount) || 0;
      statistics.acceptCount = Number(statRes.data.acceptCount) || 0;

      if (statistics.submitCount > 0) {
        statistics.acceptRate = (statistics.acceptCount / statistics.submitCount) * 100;
      }
    }

    // 获取最近提交记录
    const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost({
      current: 1,
      pageSize: 10,
      userId: userInfo.value.id,
      sortField: "createTime",
      sortOrder: "descend",
    });

    if (res.code === 0 && res.data) {
      submitList.value = res.data.records || [];
    }
  } catch (error) {
    console.error("加载统计数据失败", error);
  }
};

// 显示编辑弹窗
const showEditModal = () => {
  editForm.userName = userInfo.value.userName || "";
  editForm.userProfile = userInfo.value.userProfile || "";
  editModalVisible.value = true;
};

// 更新用户信息
const handleUpdateUser = async () => {
  try {
    const res = await UserControllerService.updateMyUserUsingPost({
      userName: editForm.userName,
      userProfile: editForm.userProfile,
    });

    if (res.code === 0) {
      message.success("更新成功");
      editModalVisible.value = false;
      await loadUserInfo();
    } else {
      message.error("更新失败: " + res.message);
    }
  } catch (error) {
    message.error("更新失败");
  }
};

// 查看代码详情
const viewCode = (record: any) => {
  router.push(`/view/code/${record.id}`);
};

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return "-";
  return moment(time).format("YYYY-MM-DD HH:mm");
};

// 获取用户角色颜色
const getUserRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "user":
      return "blue";
    case "ban":
      return "gray";
    default:
      return "gray";
  }
};

// 获取用户角色文本
const getUserRoleText = (role: string) => {
  switch (role) {
    case "admin":
      return "管理员";
    case "user":
      return "普通用户";
    case "ban":
      return "已封禁";
    default:
      return "未知";
  }
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case "成功":
      return "green";
    case "答案错误":
      return "red";
    case "时间超限":
      return "orange";
    case "内存超限":
      return "orange";
    case "编译错误":
      return "purple";
    case "运行错误":
      return "red";
    default:
      return "gray";
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  return status || "未知";
};

onMounted(async () => {
  loading.value = true;
  await loadUserInfo();
  await loadStatistics();
  loading.value = false;
});
</script>

<style scoped>
#userProfileView {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
