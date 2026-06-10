<template>
  <div id="addQuestionView">
    <h2>{{ updatePage ? '更新题目' : '创建题目' }}</h2>
    <a-form :model="form" layout="horizontal" @submit-success="doSubmit">
      <a-form-item field="title" label="标题" required>
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容" required>
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item field="sourceCode" label="初始代码">
        <MdEditor :value="form.sourceCode" :handle-change="onSourceCodeChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制" required>
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制(ms)"
              mode="button"
              :min="100"
              :max="60000"
              size="large"
            />
            <template #extra>
              <span style="color: #666;">范围: 100ms - 60000ms</span>
            </template>
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制" required>
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制(KB)"
              mode="button"
              :min="256"
              :max="262144"
              size="large"
            />
            <template #extra>
              <span style="color: #666;">范围: 256KB - 256MB</span>
            </template>
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制(KB)"
              mode="button"
              :min="0"
              :max="65536"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.inputMode" label="输入模式">
            <a-radio-group v-model="form.judgeConfig.inputMode">
              <a-radio value="single">单次输入</a-radio>
              <a-radio value="loop">循环输入</a-radio>
            </a-radio-group>
            <div style="margin-top: 8px; color: #666; font-size: 12px;">
              <div><strong>单次输入：</strong>每个测试用例独立执行，适用于单组输入的题目</div>
              <div><strong>循环输入：</strong>合并所有输入一次性执行，适用于 while 循环读取的题目</div>
            </div>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
        required
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 640px">
            <a-form-item
              :field="`judgeCase[${index}].input`"
              :label="`输入用例-${index + 1}`"
              :key="index"
              :required="true"
              :rules="[{ required: true, message: '测试输入不能为空' }]"
            >
              <a-textarea
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
                :auto-size="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-item>
            <a-form-item
              :field="`judgeCase[${index}].output`"
              :label="`输出用例-${index + 1}`"
             :key="index"
              :required="true"
              :rules="[{ required: true, message: '测试输出不能为空' }]"
            >
              <a-textarea
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
                :auto-size="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-item>
            <a-button
              status="danger"
              @click="handleDelete(index)"
              :disabled="form.judgeCase.length <= 1"
            >
              删除
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-space>
          <a-button
            type="primary"
            style="min-width: 200px"
            html-type="submit"
            :loading="submitting"
          >
            {{ submitting ? '提交中...' : '提交' }}
          </a-button>
          <a-button
            v-if="!updatePage"
            style="min-width: 200px"
            @click="resetForm"
          >
            重置
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");
// 提交状态
const submitting = ref(false);

// 默认表单值
const defaultForm = {
  title: "",
  tags: [] as string[],
  answer: "",
  content: "",
  sourceCode: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
    inputMode: "single",
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
};

let form = ref({ ...defaultForm });

/**
 * 重置表单
 */
const resetForm = () => {
  form.value = { ...defaultForm, tags: [], judgeCase: [{ input: "", output: "" }] };
};

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
        inputMode: "single",
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
      // 兼容旧数据，没有 inputMode 的默认为 single
      if (!form.value.judgeConfig.inputMode) {
        form.value.judgeConfig.inputMode = "single";
      }
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

/**
 * 表单验证
 */
const validateForm = (): string | null => {
  if (!form.value.title || form.value.title.trim() === "") {
    return "标题不能为空";
  }
  if (form.value.title.length > 100) {
    return "标题长度不能超过100个字符";
  }
  if (!form.value.content || form.value.content.trim() === "") {
    return "题目内容不能为空";
  }
  if (!form.value.judgeConfig.timeLimit || form.value.judgeConfig.timeLimit < 100) {
    return "时间限制不能小于100ms";
  }
  if (!form.value.judgeConfig.memoryLimit || form.value.judgeConfig.memoryLimit < 256) {
    return "内存限制不能小于256KB";
  }
  if (!form.value.judgeCase || form.value.judgeCase.length === 0) {
    return "至少需要一个测试用例";
  }
  for (let i = 0; i < form.value.judgeCase.length; i++) {
    const testCase = form.value.judgeCase[i];
    if (!testCase.input || testCase.input.trim() === "") {
      return `测试用例 ${i + 1} 的输入不能为空`;
    }
    if (!testCase.output || testCase.output.trim() === "") {
      return `测试用例 ${i + 1} 的输出不能为空`;
    }
  }
  return null;
};

const doSubmit = async () => {
  // 表单验证
  const validateError = validateForm();
  if (validateError) {
    message.error(validateError);
    return;
  }

  // 防止重复提交
  if (submitting.value) {
    return;
  }
  submitting.value = true;

  try {
    // 区分更新还是创建
    if (updatePage) {
      const res = await QuestionControllerService.updateQuestionUsingPost(
        form.value
      );
      if (res.code === 0) {
        message.success("更新成功");
        router.push("/manage/question");
      } else {
        message.error("更新失败，" + res.message);
      }
    } else {
      const res = await QuestionControllerService.addQuestionUsingPost(
        form.value
      );
      if (res.code === 0) {
        message.success("创建成功");
        resetForm();
        router.push("/manage/question");
      } else {
        message.error("创建失败，" + res.message);
      }
    }
  } catch (e: any) {
    message.error("操作失败：" + e.message);
  } finally {
    submitting.value = false;
  }
};

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const onSourceCodeChange = (value: string) => {
  form.value.sourceCode = value;
};
</script>

<style scoped>
#addQuestionView {
}
</style>
