import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/ExampleView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import UserProfileView from "@/views/user/UserProfileView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import SubmitCodeView from "@/views/question/SubmitCodeView.vue";
import TeamsView from "@/views/team/TeamsView.vue";
import TeamDetailView from "@/views/team/TeamDetailView.vue";
import CreateTeamView from "@/views/team/CreateTeamView.vue";
import ContestsView from "@/views/contest/ContestsView.vue";
import ContestDetailView from "@/views/contest/ContestDetailView.vue";
import ContestQuestionView from "@/views/contest/ContestQuestionView.vue";
import CreateContestView from "@/views/contest/CreateContestView.vue";
import RankingView from "@/views/ranking/RankingView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  {
    path: "/profile",
    name: "个人资料",
    component: UserProfileView,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/view/code/:id",
    name: "查看代码",
    component: SubmitCodeView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
    },
  },
  {
    path: "/manage/question/",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/teams",
    name: "团队列表",
    component: TeamsView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/team/:id",
    name: "团队详情",
    component: TeamDetailView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/team/create",
    name: "创建团队",
    component: CreateTeamView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
    },
  },
  {
    path: "/contests",
    name: "比赛列表",
    component: ContestsView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/contest/:id",
    name: "比赛详情",
    component: ContestDetailView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/contest/:id/question/:questionId",
    name: "比赛做题",
    component: ContestQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/contest/create",
    name: "创建比赛",
    component: CreateContestView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
    },
  },
  {
    path: "/ranking",
    name: "排行榜",
    component: RankingView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
];