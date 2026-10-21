<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh; display: flex; flex-direction: column;">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a target="_blank" rel="noopener noreferrer"> 作者：酷酷的金 </a>
        <span class="divider">|</span>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          浙ICP备2026046474号-1
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
  position: relative;
  z-index: 1000;
  background: #fff;
  flex-shrink: 0;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 16px;
  padding: 20px;
  flex: 1;
  min-height: 0;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  text-align: center;
  flex-shrink: 0;
}

#basicLayout .divider {
  margin: 0 8px;
  color: #999;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
