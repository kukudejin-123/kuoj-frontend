<template>
  <div id="teamsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="teamName" label="团队名称" style="min-width: 240px">
        <a-input v-model="searchParams.teamName" placeholder="请输入团队名称" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="doSubmit">搜索</a-button>
          <a-button @click="doClear">清空</a-button>
          <a-button type="primary" v-if="userRole === 'admin'" @click="toCreateTeam">
            创建团队
          </a-button>
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
      <template #teamName="{ record }">
        <a-link @click="toTeamDetail(record)">{{ record.teamName }}</a-link>
      </template>
      <template #memberCount="{ record }">
        <a-tag color="arcoblue">{{ record.memberCount }} / {{ record.maxMemberCount }}</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status === 0" color="green">正常</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </template>
      <template #hasJoin="{ record }">
        <a-tag v-if="record.hasJoin" color="green">已加入</a-tag>
        <a-tag v-else color="gray">未加入</a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" size="small" @click="toTeamDetail(record)">
            查看
          </a-button>
          <a-button
            v-if="record.hasJoin && record.userRole !== 2"
            type="outline"
            size="small"
            status="danger"
            @click="handleQuit(record)"
          >
            退出
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { listTeamByPageUsingPost, quitTeamUsingPost } from "@/api/teamController";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import ACCESS_ENUM from "@/access/accessEnum";

const tableRef = ref();
const router = useRouter();
const store = useStore();

const dataList = ref([]);
const total = ref(0);

// 获取当前用户角色
const userRole = computed(() => {
  return store.state.user.loginUser?.userRole || ACCESS_ENUM.NOT_LOGIN;
});

// 搜索参数
const searchParams = ref<any>({
  teamName: "",
  pageSize: 10,
  current: 1,
});

// 表格列配置
const columns = [
  {
    title: "团队名称",
    slotName: "teamName",
  },
  {
    title: "团队描述",
    dataIndex: "teamDesc",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "成员数",
    slotName: "memberCount",
  },
  {
    title: "状态",
    slotName: "status",
  },
  {
    title: "加入状态",
    slotName: "hasJoin",
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

// 加载数据
const loadData = async () => {
  const params = {
    ...searchParams.value,
  };
  const res = await listTeamByPageUsingPost(params);
  if (res.data?.code === 0 || res.code === 0) {
    const resData = res.data?.data || res.data;
    dataList.value = resData?.records || [];
    total.value = resData?.total || 0;
  } else {
    message.error("加载失败，" + (res.data?.message || res.message || ""));
  }
};

// 页面加载
onMounted(() => {
  loadData();
});

// 分页变化
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

// 搜索
const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
  loadData();
};

// 清空
const doClear = () => {
  searchParams.value = {
    teamName: "",
    pageSize: 10,
    current: 1,
  };
  loadData();
};

// 跳转到团队详情
const toTeamDetail = (team: any) => {
  router.push(`/team/${team.id}`);
};

// 跳转到创建团队页面
const toCreateTeam = () => {
  router.push("/team/create");
};

// 退出团队
const handleQuit = async (team: any) => {
  try {
    const res = await quitTeamUsingPost({ teamId: team.id });
    if (res.data?.code === 0 || res.code === 0) {
      message.success("退出成功");
      loadData();
    } else {
      message.error("退出失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("退出失败");
  }
};
</script>

<style scoped>
#teamsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>