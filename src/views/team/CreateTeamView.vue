<template>
  <div id="createTeamView">
    <a-card title="创建团队">
      <a-form :model="form" layout="vertical" @submit-success="handleSubmit">
        <a-form-item
          field="teamName"
          label="团队名称"
          :rules="[{ required: true, message: '请输入团队名称' }]"
        >
          <a-input
            v-model="form.teamName"
            placeholder="请输入团队名称"
            :max-length="256"
          />
        </a-form-item>
        <a-form-item field="teamDesc" label="团队描述">
          <a-textarea
            v-model="form.teamDesc"
            placeholder="请输入团队描述"
            :max-length="1024"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item field="captainUserId" label="队长用户ID">
          <a-input-number
            v-model="form.captainUserId"
            placeholder="可选，不填则默认当前用户为队长"
            :allow-clear="true"
          />
        </a-form-item>
        <a-form-item field="maxMemberCount" label="最大成员数量">
          <a-input-number
            v-model="form.maxMemberCount"
            placeholder="请输入最大成员数量"
            :min="1"
            :max="1000"
            :default-value="50"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              创建
            </a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { addTeamUsingPost } from "@/api/teamController";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const loading = ref(false);

const form = ref({
  teamName: "",
  teamDesc: "",
  maxMemberCount: 50,
  captainUserId: undefined as number | undefined,
});

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await addTeamUsingPost(form.value);
    if (res.data?.code === 0 || res.code === 0) {
      const teamId = res.data?.data || res.data;
      message.success("创建成功");
      router.push(`/team/${teamId}`);
    } else {
      message.error("创建失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("创建失败");
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
#createTeamView {
  max-width: 800px;
  margin: 0 auto;
}
</style>
