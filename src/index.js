import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import zhCN from "antd/lib/locale/zh_CN";
import "./index.css";
import App from "./App";
import store from "./store";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));
//用户过滤html标签
window.repalceHtmlToText = (str) => {
  str = str.replace(/<\/?.+?>/g, "");
  str = str.replace(/&nbsp;/g, "");
  return str;
};
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
);
