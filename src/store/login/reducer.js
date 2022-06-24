import { UPDATE_MODEL, UPDATE_MENU } from "./constants";
//初始化状态
const initialLogin = {
  isShow: false, //判断是否要显示模态框
  type: 0, //0 代表要显示登录的表单，1代表要显示注册的表单
  actionFlag: true,
  isMenu: false,
};

//定义登录的reducer
const loginReducer = (state = initialLogin, action) => {
  switch (action.type) {
    //修改类型和状态
    case UPDATE_MODEL:
      return { ...state, ...action.data };
    case UPDATE_MENU:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
export default loginReducer;
