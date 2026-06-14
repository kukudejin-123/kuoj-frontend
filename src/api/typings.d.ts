declare namespace API {
  type AiGenerateQuestionRequest = {
    appId?: number;
    optionNumber?: number;
    questionNumber?: number;
  };

  type App = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
    updateTime?: string;
    userId?: number;
  };

  type AppAddRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    scoringStrategy?: number;
  };

  type AppEditRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    id?: number;
    scoringStrategy?: number;
  };

  type AppQueryRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewerId?: number;
    scoringStrategy?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type AppUpdateRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
  };

  type AppVO = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    createTime?: string;
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type BaseResponseAppVO_ = {
    code?: number;
    data?: AppVO;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListQuestionContentDTO_ = {
    code?: number;
    data?: QuestionContentDTO[];
    message?: string;
  };

  type BaseResponseListString_ = {
    code?: number;
    data?: string[];
    message?: string;
  };

  type BaseResponseMapStringLong_ = {
    code?: number;
    data?: { [key: string]: number };
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageApp_ = {
    code?: number;
    data?: PageApp_;
    message?: string;
  };

  type BaseResponsePageAppVO_ = {
    code?: number;
    data?: PageAppVO_;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
    message?: string;
  };

  type BaseResponsePageQuestion_ = {
    code?: number;
    data?: PageQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionVO_ = {
    code?: number;
    data?: PageQuestionVO_;
    message?: string;
  };

  type BaseResponsePageScoringResult_ = {
    code?: number;
    data?: PageScoringResult_;
    message?: string;
  };

  type BaseResponsePageScoringResultVO_ = {
    code?: number;
    data?: PageScoringResultVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserAnswer_ = {
    code?: number;
    data?: PageUserAnswer_;
    message?: string;
  };

  type BaseResponsePageUserAnswerVO_ = {
    code?: number;
    data?: PageUserAnswerVO_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponsePostVO_ = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
    message?: string;
  };

  type BaseResponseScoringResultVO_ = {
    code?: number;
    data?: ScoringResultVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserAnswerVO_ = {
    code?: number;
    data?: UserAnswerVO;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getAppVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getScoringResultVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserAnswerVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Option = {
    key?: string;
    result?: string;
    score?: number;
    value?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageApp_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: App[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageAppVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: AppVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Question[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageScoringResult_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ScoringResult[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageScoringResultVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ScoringResultVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserAnswer_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserAnswer[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserAnswerVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserAnswerVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type PostAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type PostEditRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostFavourQueryRequest = {
    current?: number;
    pageSize?: number;
    postQueryRequest?: PostQueryRequest;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    favourUserId?: number;
    id?: number;
    notId?: number;
    orTags?: string[];
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type Question = {
    appId?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    questionContent?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionAddRequest = {
    appId?: number;
    questionContent?: QuestionContentDTO[];
  };

  type QuestionContentDTO = {
    options?: Option[];
    title?: string;
  };

  type QuestionEditRequest = {
    id?: number;
    questionContent?: QuestionContentDTO[];
  };

  type QuestionQueryRequest = {
    appId?: number;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionContent?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionUpdateRequest = {
    id?: number;
    questionContent?: QuestionContentDTO[];
  };

  type QuestionVO = {
    appId?: number;
    createTime?: string;
    id?: number;
    questionContent?: QuestionContentDTO[];
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type ReviewRequest = {
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
  };

  type ScoringResult = {
    appId?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string;
    resultScoreRange?: number;
    updateTime?: string;
    userId?: number;
  };

  type ScoringResultAddRequest = {
    appId?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
  };

  type ScoringResultEditRequest = {
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
  };

  type ScoringResultQueryRequest = {
    appId?: number;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string;
    resultScoreRange?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type ScoringResultUpdateRequest = {
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
  };

  type ScoringResultVO = {
    appId?: number;
    createTime?: string;
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserAnswer = {
    appId?: number;
    appType?: number;
    choices?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    updateTime?: string;
    userId?: number;
  };

  type UserAnswerAddRequest = {
    appId?: number;
    choices?: string[];
  };

  type UserAnswerEditRequest = {
    appId?: number;
    choices?: string[];
    id?: number;
  };

  type UserAnswerQueryRequest = {
    appId?: number;
    appType?: number;
    choices?: string;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type UserAnswerUpdateRequest = {
    appId?: number;
    choices?: string[];
    id?: number;
  };

  type UserAnswerVO = {
    appId?: number;
    appType?: number;
    choices?: string[];
    createTime?: string;
    id?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  // ==================== 团队相关类型 ====================

  type Team = {
    id?: number;
    teamName?: string;
    teamDesc?: string;
    teamAvatar?: string;
    userId?: number;
    memberCount?: number;
    maxMemberCount?: number;
    status?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type TeamAddRequest = {
    teamName?: string;
    teamDesc?: string;
    teamAvatar?: string;
    maxMemberCount?: number;
    captainUserId?: number;
  };

  type TeamUpdateRequest = {
    id?: number;
    teamName?: string;
    teamDesc?: string;
    teamAvatar?: string;
    maxMemberCount?: number;
    status?: number;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type TeamQueryRequest = {
    id?: number;
    teamName?: string;
    teamDesc?: string;
    userId?: number;
    status?: number;
    memberId?: number;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type TeamJoinRequest = {
    teamId?: number;
  };

  type TeamQuitRequest = {
    teamId?: number;
  };

  type TeamInviteRequest = {
    teamId?: number;
    userId?: string;  // 改为 string 类型，避免大数精度丢失
  };

  type TeamKickRequest = {
    teamId?: number;
    userId?: number;
  };

  type TeamUserQueryRequest = {
    teamId?: number;
    userId?: number;
    userRole?: number;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type TeamVO = {
    id?: number;
    teamName?: string;
    teamDesc?: string;
    teamAvatar?: string;
    userId?: number;
    memberCount?: number;
    maxMemberCount?: number;
    status?: number;
    createTime?: string;
    createUser?: UserVO;
    hasJoin?: boolean;
    userRole?: number;
  };

  type TeamUserVO = {
    id?: number;
    teamId?: number;
    userId?: number;
    userRole?: number;
    userRoleName?: string;
    joinTime?: string;
    user?: UserVO;
  };

  type PageTeamVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: TeamVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageTeamUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: TeamUserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type BaseResponsePageTeamVO_ = {
    code?: number;
    data?: PageTeamVO_;
    message?: string;
  };

  type BaseResponsePageTeamUserVO_ = {
    code?: number;
    data?: PageTeamUserVO_;
    message?: string;
  };

  type BaseResponseTeamVO_ = {
    code?: number;
    data?: TeamVO;
    message?: string;
  };

  // ==================== 比赛相关类型 ====================

  type Contest = {
    id?: number;
    contestName?: string;
    contestDesc?: string;
    userId?: number;
    startTime?: string;
    endTime?: string;
    contestType?: number;
    status?: number;
    participantCount?: number;
    questionCount?: number;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
  };

  type ContestAddRequest = {
    contestName?: string;
    contestDesc?: string;
    startTime?: string;
    endTime?: string;
    contestType?: number;
    questionIds?: number[];
  };

  type ContestUpdateRequest = {
    id?: number;
    contestName?: string;
    contestDesc?: string;
    startTime?: string;
    endTime?: string;
    contestType?: number;
    questionIds?: number[];
  };

  type ContestQueryRequest = {
    id?: number;
    contestName?: string;
    userId?: number;
    contestType?: number;
    status?: number;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type ContestQuestionVO = {
    questionId?: number;
    questionOrder?: number;
    questionLabel?: string;
    score?: number;
    title?: string;
    difficulty?: number;
    acceptedNum?: number;
    submitNum?: number;
  };

  type ContestVO = {
    id?: number;
    contestName?: string;
    contestDesc?: string;
    userId?: number;
    startTime?: string;
    endTime?: string;
    contestType?: number;
    status?: number;
    participantCount?: number;
    questionCount?: number;
    createTime?: string;
    createUser?: UserVO;
    hasJoin?: boolean;
    questionList?: ContestQuestionVO[];
  };

  type ContestSubmitAddRequest = {
    contestId?: number;
    questionId?: number;
    language?: string;
    code?: string;
  };

  type ContestSubmitQueryRequest = {
    contestId?: number;
    questionId?: number;
    userId?: number;
    status?: string;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type ContestSubmitVO = {
    id?: number;
    contestId?: number;
    questionId?: number;
    userId?: number;
    language?: string;
    code?: string;
    judgeInfo?: string;
    status?: string;
    submitTime?: string;
    isFirstAccept?: number;
    createTime?: string;
    user?: UserVO;
    questionLabel?: string;
  };

  type PageContestVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ContestVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageContestSubmitVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ContestSubmitVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type BaseResponsePageContestVO_ = {
    code?: number;
    data?: PageContestVO_;
    message?: string;
  };

  type BaseResponseContestVO_ = {
    code?: number;
    data?: ContestVO;
    message?: string;
  };

  type BaseResponsePageContestSubmitVO_ = {
    code?: number;
    data?: PageContestSubmitVO_;
    message?: string;
  };

  type BaseResponseContestSubmitVO_ = {
    code?: number;
    data?: ContestSubmitVO;
    message?: string;
  };

  type BaseResponseListContestVO_ = {
    code?: number;
    data?: ContestVO[];
    message?: string;
  };

  // ==================== 排行榜相关类型 ====================

  type UserRankingQueryRequest = {
    userId?: number;
    userName?: string;
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type UserRankingVO = {
    id?: number;
    userId?: number;
    user?: UserVO;
    totalContests?: number;
    totalAccepted?: number;
    totalSubmissions?: number;
    rating?: number;
    rank?: number;
    createTime?: string;
  };

  type ContestRankingVO = {
    rank?: number;
    userId?: number;
    user?: UserVO;
    acceptedCount?: number;
    totalTime?: number;
    problemStats?: { [key: string]: number[] };
    lastSubmitTime?: string;
  };

  type PageUserRankingVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserRankingVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type BaseResponsePageUserRankingVO_ = {
    code?: number;
    data?: PageUserRankingVO_;
    message?: string;
  };

  type BaseResponseUserRankingVO_ = {
    code?: number;
    data?: UserRankingVO;
    message?: string;
  };

  type BaseResponseListContestRankingVO_ = {
    code?: number;
    data?: ContestRankingVO[];
    message?: string;
  };
}
