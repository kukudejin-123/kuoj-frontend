<template>
  <div id="contestsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="contestName" label="比赛名称" style="min-width: 240px">
        <a-input v-model="searchParams.contestName" placeholder="请输入比赛名称" allow-clear />
      </a-form-item>
      <a-form-item field="status" label="状态">
        <a-select v-model="searchParams.status" placeholder="请选择状态" allow-clear style="width: 120px">
          <a-option :value="0">未开始</a-option>
          <a-option :value="1">进行中</a-option>
          <a-option :value="2">已结束</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="doSubmit">搜索</a-button>
          <a-button @click="doClear">清空</a-button>
          <a-button type="primary" v-if="userRole === 'admin'" @click="toCreateContest">
            创建比赛
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
      <template #contestName="{ record }">
        <a-link @click="toContestDetail(record)">{{ record.contestName }}</a-link>
      </template>
      <template #contestType="{ record }">
        <a-tag v-if="record.contestType === 0" color="arcoblue">ACM</a-tag>
        <a-tag v-else color="green">IOI</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status === 0" color="gray">未开始</a-tag>
        <a-tag v-else-if="record.status === 1" color="green">进行中</a-tag>
        <a-tag v-else color="red">已结束</a-tag>
      </template>
      <template #time="{ record }">
        <div>
          {{ moment(record.startTime).format("YYYY-MM-DD HH:mm") }}
          <br />
          至
          <br />
          {{ moment(record.endTime).format("YYYY-MM-DD HH:mm") }}
        </div>
      </template>
      <template #hasJoin="{ record }">
        <a-tag v-if="record.hasJoin" color="green">已报名</a-tag>
        <a-tag v-else color="gray">未报名</a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" size="small" @click="toContestDetail(record)">
            查看
          </a-button>
          <a-button v-if="userRole === 'admin'" status="danger" size="small" @click="deleteContest(record)">
            删除
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
import { listContestByPageUsingPost, deleteContestUsingPost } from "@/api/contestController";
import message from "@arco-design/web-vue/es/message";
import Modal from "@arco-design/web-vue/es/modal";
import moment from "moment";
import ACCESS_ENUM from "@/access/accessEnum";

const tableRef = ref();
const router = useRouter();
const store = useStore();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  contestName: "",
  status: undefined as number | undefined,
  pageSize: 10,
  current: 1,
});

const columns = [
  {
    title: "比赛名称",
    slotName: "contestName",
  },
  {
    title: "类型",
    slotName: "contestType",
  },
  {
    title: "状态",
    slotName: "status",
  },
  {
    title: "时间",
    slotName: "time",
  },
  {
    title: "参赛人数",
    dataIndex: "participantCount",
  },
  {
    title: "报名状态",
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

// 获取当前用户角色
const userRole = computed(() => {
  return store.state.user.loginUser?.userRole || ACCESS_ENUM.NOT_LOGIN;
});

// 加载数据
const loadData = async () => {
  const res = await listContestByPageUsingPost({
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data?.code === 0 || res.code === 0) {
    const resData = res.data?.data || res.data;
    dataList.value = resData?.records || [];
    total.value = resData?.total || 0;
  } else {
    message.error("获取比赛列表失败：" + (res.data?.message || res.message));
  }
};

// 页面变化
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

// 搜索
const doSubmit = () => {
  searchParams.value.current = 1;
  loadData();
};

// 清空
const doClear = () => {
  searchParams.value = {
    contestName: "",
    status: undefined,
    pageSize: 10,
    current: 1,
  };
  loadData();
};

// 跳转到比赛详情
const toContestDetail = (record: any) => {
  router.push(`/contest/${record.id}`);
};

// 跳转到创建比赛
const toCreateContest = () => {
  router.push("/contest/create");
};

// 删除比赛
const deleteContest = async (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除比赛「${record.contestName}」吗？此操作不可恢复！`,
    okText: '确认删除',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteContestUsingPost({ id: record.id });
        if (res.data?.code === 0 || res.code === 0) {
          message.success("删除成功");
          loadData();
        } else {
          message.error("删除失败：" + (res.data?.message || res.message));
        }
      } catch (error: any) {
        message.error("删除失败：" + (error.message || "系统错误"));
      }
    },
  });
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#contestsView {
  padding: 20px;
}
</style>
