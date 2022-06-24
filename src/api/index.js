import request from "./ajax";

/**
 * 用户管理
 */

//登录
export const login = (data) =>
  request({
    url: "/auth/login",
    method: "post",
    data,
  });

//注册
export const register = (data) =>
  request({
    url: "/auth/register",
    method: "post",
    data,
  });

//退出
export const logout = () =>
  request({
    url: "/auth/logout",
    method: "post",
  });

//发给验证码
export const toCaptcha = (data) =>
  request({
    url: "/auth/captcha ",
    method: "post",
    data,
  });

//获取用户信息
export const getUserInfo = () =>
  request({
    url: "/users",
    method: "get",
  });

//修改用户信息
export const updateUser = (data) =>
  request({
    url: "/user/edit",
    method: "post",
    data,
  });

//修改密码
export const updatePassowrd = (data) =>
  request({
    url: "/user/password",
    method: "post",
    data,
  });
//获取用户列表
export const UserList = (data) =>
  request({
    url: "/user/list",
    method: "get",
    params: data,
  });

//添加用户
export const addUsers = (data) =>
  request({
    url: "/user/add",
    method: "post",
    data,
  });
//删除用户
export const delUser = (id) =>
  request({
    url: `/user/del/${id}`,
    method: "delete",
  });
//获取用户信息
export const UserInfo = (id) =>
  request({
    url: `/user/detail/${id}`,
    method: "get",
  });

//后台获取用户信息
export const editUserInfo = (data) =>
  request({
    url: "/user/update",
    method: "post",
    data,
  });

/**
 * 文章管理
 */

//发布文章
export const pushArticle = (data) =>
  request({
    url: "/article",
    method: "post",
    data,
  });

//获取文章列表
export const getArticleList = (data) =>
  request({
    url: "/articleList",
    method: "get",
    params: data,
  });

//获取文章详情
export const getArticleDetail = (data) =>
  request({
    url: "/articleDetail",
    method: "get",
    params: data,
  });

//删除文章
export const deleteArticle = (id) =>
  request({
    url: `/article/${id}`,
    method: "delete",
  });

//修改文章状态
export const updateStatus = (data) =>
  request({
    url: "article/status",
    method: "post",
    data,
  });

//更新文章
export const updateArticle = (id, data) =>
  request({
    url: `/article/${id}`,
    method: "patch",
    data,
  });

//获取热门文章
export const hotArticle = () =>
  request({
    url: "/hotarticle",
    method: "get",
  });
//搜索文章
export const searchArticle = (data) =>
  request({
    url: "/search",
    method: "post",
    params: data,
  });
/**
 * 分类管理
 */

//获取分类
export const getCategoryList = (data) =>
  request({
    url: "/category",
    method: "get",
    params: data,
  });

//添加分类
export const addCategory = (data) =>
  request({
    url: "/category",
    method: "post",
    data,
  });

//删除分类
export const deleteCategory = (id) =>
  request({
    url: `/category/${id}`,
    method: "delete",
  });

//修改分类
export const updateCategory = (id, data) =>
  request({
    url: `/category/${id}`,
    method: "patch",
    data,
  });

/**
 * 友情链接管理
 */
//获取友情链接列表
export const getBlogrollList = (data) =>
  request({
    url: "/blogroll",
    method: "get",
    params: data,
  });

//添加友情链接
export const addBlogroll = (data) =>
  request({
    url: "/blogroll",
    method: "post",
    data,
  });
//删除友情链接
export const deleteBlogroll = (id) =>
  request({
    url: `/blogroll/${id}`,
    method: "delete",
  });
//更新链接
export const updateBlogroll = (id, data) =>
  request({
    url: `/blogroll/${id}`,
    method: "patch",
    data,
  });

/**
 * 友情链接分类管理
 */
//获取友情链接的分类
export const getBlogrollCategory = (data) =>
  request({
    url: "/urlcategory",
    method: "get",
    params: data,
  });

//删除友情分类
export const deleteUrlCategory = (id) =>
  request({
    url: `urlcategory/${id}`,
    method: "delete",
  });

//更新友情链接分类
export const updateUrlCategory = (id, data) =>
  request({
    url: `urlcategory/${id}`,
    method: "patch",
    data,
  });

//添加友情链接的分类
export const addUrlCategory = (data) =>
  request({
    url: "/urlcategory",
    method: "post",
    data,
  });

//获取友情链接列表
export const getUrlList = () =>
  request({
    url: "/urlList",
    method: "get",
  });

/**
 * 评论管理
 */

//添加评论
export const addComment = (data) =>
  request({
    url: "/comments",
    method: "post",
    data,
  });

//获取评论列表
export const getCommentList = (data) =>
  request({
    url: "/commentList",
    method: "get",
    params: data,
  });

//评论点赞
export const commentLike = (data) =>
  request({
    url: "/comments/like",
    method: "post",
    data,
  });
