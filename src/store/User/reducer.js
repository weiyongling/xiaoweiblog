//导入变量
import { UPDATE_USERINFO } from "./constants";
//初始化状态
const initUser = {
  token: localStorage.getItem("TOKEN"),
  userInfo: {},
};
// 初始reducer
const userReducer = (state = initUser, action) => {
  switch (action.type) {
    case UPDATE_USERINFO:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
//暴露出去
export default userReducer;
