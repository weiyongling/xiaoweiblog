import { UPDATE_SEARCHTYPE } from "./constants";
// 初始化状态
const initialSearch = {
  searchType: 0, //0代表隐藏，1代表显示
};

const searchReducer = (state = initialSearch, action) => {
  switch (action.type) {
    case UPDATE_SEARCHTYPE:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
export default searchReducer;
