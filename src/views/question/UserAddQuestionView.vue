<template>
  <div id="userAddQuestionView">
    <h2>提交出题</h2>
    <a-alert type="info" style="margin-bottom: 16px;">
      您提交的题目需要管理员审核通过后才会公开显示。
    </a-alert>
    <a-form :model="form" layout="horizontal" @submit-success="doSubmit">
      <a-form-item field="title" label="标题" required>
        <a-input v-model="form.title" placeholder="请输入标题" :max-length="80" />
      </a-form-item>
      <a-form-item field="difficulty" label="难度" required>
        <a-radio-group v-model="form.difficulty">
          <a-radio :value="0">简单</a-radio>
          <a-radio :value="1">中等</a-radio>
          <a-radio :value="2">困难</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="输入标签后按回车" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目描述" required>
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="参考答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item field="sourceCode" label="初始代码">
        <MdEditor :value="form.sourceCode" :handle-change="onSourceCodeChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制(ms)" required>
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制(ms)"
              mode="button"
              :min="100"
              :max="60000"
              :default-value="1000"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制(KB)" required>
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制(KB)"
              mode="button"
              :min="256"
              :max="262144"
              :default-value="65536"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.inputMode" label="输入模式">
            <a-radio-group v-model="form.judgeConfig.inputMode">
              <a-radio value="single">单次输入</a-radio>
              <a-radio value="loop">循环输入</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="judgeConfig.judgeMode" label="判题模式">
            <a-select v-model="form.judgeConfig.judgeMode" placeholder="选择判题模式">
              <a-option value="DEFAULT">默认（精确匹配）</a-option>
              <a-option value="IGNORE_SPACE">忽略多余空格</a-option>
              <a-option value="IGNORE_CASE">忽略大小写</a-option>
              <a-option value="FLOAT">浮点数精度比较</a-option>
              <a-option value="MULTI_ANSWER">多解判断</a-option>
              <a-option value="TESTLIB">自定义SPJ判题</a-option>
            </a-select>
            <div style="margin-top: 8px; color: #666; font-size: 12px;">
              <div v-if="form.judgeConfig.judgeMode === 'DEFAULT'"><strong>默认：</strong>输出必须与期望完全一致（去除首尾空格后）</div>
              <div v-if="form.judgeConfig.judgeMode === 'IGNORE_SPACE'"><strong>忽略空格：</strong>多个空格合并为一个，适用于输出格式要求不严格的题目</div>
              <div v-if="form.judgeConfig.judgeMode === 'IGNORE_CASE'"><strong>忽略大小写：</strong>适用于判断题（YES/Yes/yes 都算正确）</div>
              <div v-if="form.judgeConfig.judgeMode === 'FLOAT'"><strong>浮点数：</strong>适用于计算结果为小数的题目，允许一定误差</div>
              <div v-if="form.judgeConfig.judgeMode === 'MULTI_ANSWER'"><strong>多解判断：</strong>答案有多种可能，在下方配置可接受答案列表</div>
              <div v-if="form.judgeConfig.judgeMode === 'TESTLIB'"><strong>自定义SPJ：</strong>使用自定义程序判题，适用于答案不唯一的题目</div>
            </div>
          </a-form-item>
          <a-form-item
            v-if="form.judgeConfig.judgeMode === 'FLOAT'"
            field="judgeConfig.floatPrecision"
            label="精度容忍度"
          >
            <a-input-number
              v-model="form.judgeConfig.floatPrecision"
              :precision="10"
              :min="1e-10"
              :max="1"
              :default-value="0.000001"
              size="large"
            />
          </a-form-item>
          <a-form-item
            v-if="form.judgeConfig.judgeMode === 'MULTI_ANSWER'"
            field="judgeConfig.acceptableOutputs"
            label="可接受答案"
          >
            <a-input-tag
              v-model="form.judgeConfig.acceptableOutputs"
              placeholder="输入答案后按回车添加"
              allow-clear
            />
          </a-form-item>
          <!-- SPJ 配置 -->
          <a-form-item
            v-if="form.judgeConfig.judgeMode === 'TESTLIB'"
            field="judgeConfig.spjCode"
            label="SPJ程序代码"
          >
            <a-space direction="vertical" style="width: 100%;">
              <a-select v-model="form.judgeConfig.spjLanguage" style="width: 120px;">
                <a-option value="java">Java</a-option>
              </a-select>
              <a-textarea
                v-model="form.judgeConfig.spjCode"
                placeholder="请输入 SPJ 程序代码（Java）"
                :auto-size="{ minRows: 10, maxRows: 30 }"
                style="font-family: monospace;"
              />
              <div style="color: #666; font-size: 12px;">
                SPJ 程序通过退出码返回判题结果：0=通过，1=答案错误，2=格式错误，3=判题程序错误
              </div>
            </a-space>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item label="判题用例" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="width: 100%;">
          <div v-for="(item, index) in form.judgeCase" :key="index" style="display: flex; gap: 8px; width: 100%;">
            <a-textarea v-model="item.input" placeholder="输入" :auto-size="{ minRows: 2, maxRows: 4 }" style="flex: 1;" />
            <a-textarea v-model="item.output" placeholder="期望输出" :auto-size="{ minRows: 2, maxRows: 4 }" style="flex: 1;" />
            <a-button type="text" status="danger" @click="removeCase(index)">删除</a-button>
          </div>
          <a-button type="outline" @click="addCase">添加测试用例</a-button>
        </a-space>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" :loading="loading">提交审核</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import MdEditor from "@/components/MdEditor.vue";
import { addUserQuestionUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const loading = ref(false);

const form = ref<any>({
  title: "",
  tags: [],
  content: "",
  answer: "",
  sourceCode: "",
  difficulty: 0,
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 65536,
    stackLimit: 8192,
    inputMode: "single",
    judgeMode: "DEFAULT",
    floatPrecision: 0.000001,
    acceptableOutputs: [],
    spjCode: "",
    spjLanguage: "java",
  },
  judgeCase: [{ input: "", output: "" }],
});

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const onSourceCodeChange = (value: string) => {
  form.value.sourceCode = value;
};

const addCase = () => {
  form.value.judgeCase.push({ input: "", output: "" });
};

const removeCase = (index: number) => {
  if (form.value.judgeCase.length > 1) {
    form.value.judgeCase.splice(index, 1);
  }
};

const doSubmit = async () => {
  if (!form.value.title) {
    message.error("请输入标题");
    return;
  }
  if (!form.value.content) {
    message.error("请输入题目描述");
    return;
  }
  // 过滤空的测试用例
  const validCases = form.value.judgeCase.filter((c: any) => c.input || c.output);
  if (validCases.length === 0) {
    message.error("请至少添加一个测试用例");
    return;
  }
  loading.value = true;
  try {
    const submitData = {
      ...form.value,
      judgeCase: validCases,
    };
    const res = await addUserQuestionUsingPost(submitData);
    if (res.data?.code === 0 || res.code === 0) {
      message.success("提交成功，等待管理员审核");
      router.push("/question/my");
    } else {
      message.error("提交失败，" + (res.data?.message || res.message || ""));
    }
  } catch (e) {
    message.error("提交失败");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
#userAddQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
