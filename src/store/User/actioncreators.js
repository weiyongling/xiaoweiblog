//导变量
import { UPDATE_USERINFO } from "./constants";
//定义函数
//更新用户的信息
const updateUserInfo = (data) => ({ type: UPDATE_USERINFO, data });

//暴露出去
export { updateUserInfo };
