<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/xue-logo.svg" />
            <div class="title">酷OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <!-- 未登录状态 -->
      <a-link v-if="!store.state.user.loginUser.id" @click="gologin"
        >未登录</a-link
      >
      <!-- 已登录状态 -->
      <a-popover v-else trigger="click" position="bottom">
        <!-- 没名称用户 -->
        <a-link>{{ store.state.user.loginUser.userName ?? "无名" }}</a-link>
        <template #content>
          <div class="user-menu">
            <p @click="goProfile">个人资料</p>
            <p class="logout" @click="logout">退出登录</p>
          </div>
        </template>
      </a-popover>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  const loginUser = store.state.user.loginUser;
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    const needAccess = (item.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
    // 如果需要管理员权限，只有管理员才能看到
    if (needAccess === ACCESS_ENUM.ADMIN) {
      return loginUser?.userRole === ACCESS_ENUM.ADMIN;
    }
    // 其他菜单正常显示
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const logout = () => {
  store.dispatch("user/logout");
  router.push({
    path: "/questions",
  });
  window.location.reload();
};

const gologin = () => {
  router.push({
    path: "/user/login",
  });
};

const goProfile = () => {
  router.push({
    path: "/profile",
  });
};
</script>

<style scoped>
.user-menu p {
  cursor: pointer;
  padding: 8px 16px;
  margin: 0;
}

.user-menu p:hover {
  background-color: #f5f5f5;
}

.logout {
  border-top: 1px solid #eee;
}

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
