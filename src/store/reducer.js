import { combineReducers } from "redux";
import loginReducer from "./login/reducer";
import userReducer from "./User/reducer";
import searchReducer from "./Search/reducer";
export default combineReducers({
  loginInfo: loginReducer,
  user: userReducer,
  search: searchReducer,
});
