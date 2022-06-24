import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import "./index.scss";
import { withRouter } from "react-router-dom";
import MyNavlink from "../../MyNavlink";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const AdminSide = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const rootSubmenuKeys = ["article", "User", "blogroll"];
  const items = [
    getItem(
      <MyNavlink to="/admin/userinfo" children="我的信息" />,
      "/admin/userinfo",
      <span
        className="iconfont icon-gerenzhongxinyewodexinxi"
        style={{ color: "#1890ff" }}
      ></span>
    ),
    getItem(
      "文章管理",
      "article",
      <span
        className="iconfont icon-wenzhang"
        style={{ color: "#1890ff" }}
      ></span>,
      [
        getItem(
          <MyNavlink to="/admin/writing" children="发布文章" />,
          "/user/writing"
        ),
        getItem(
          <MyNavlink to="/admin/drafts" children="草稿箱" />,
          "/user/drafts"
        ),
        getItem(
          <MyNavlink to="/admin/articlemange" children="管理文章" />,
          "/admin/articlemange"
        ),
        getItem(
          <MyNavlink to="/admin/categorymange" children="分类管理" />,
          "/user/categorymange"
        ),
      ]
    ),
    getItem(
      <MyNavlink to="/admin/comment" children="评论列表" />,
      "/admin/comment",
      <span
        className="iconfont icon-31pinglun"
        style={{ color: "#1890ff" }}
      ></span>
    ),
    getItem(
      "用户管理",
      "User",
      <span
        className="iconfont icon-yonghuguanli"
        style={{ color: "#1890ff" }}
      ></span>,
      [
        getItem(
          <MyNavlink to="/admin/userlist" children="用户列表" />,
          "/admin/userlist"
        ),
        getItem(
          <MyNavlink to="/admin/adduser" children="用户添加" />,
          "/admin/adduser"
        ),
      ]
    ),
    getItem(
      "友情链接",
      "blogroll",
      <span
        className="iconfont icon-icon_xinyong_xianxing_jijin-"
        style={{ color: "#1890ff" }}
      ></span>,
      [
        getItem(
          <MyNavlink to="/admin/blogroll" children="链接管理" />,
          "/user/blogroll"
        ),
        getItem(
          <MyNavlink to="/admin/urlcategory" children="分类管理" />,
          "/user/urlcategory"
        ),
      ]
    ),
    getItem(
      <MyNavlink to="/admin/analyze" children="年度分析" />,
      "/admin/analyze",
      <span className="iconfont icon-fenxi" style={{ color: "#1890ff" }}></span>
    ),
  ];
  const [openKeys, setOpenKeys] = useState([]);
  const handleSetCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`${
        props.isShow ? "adminSlide adminSlide_active" : "adminSlide"
      }`}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={[props.location.pathname]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
      />
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => handleSetCollapsed(),
      })}
    </Sider>
  );
};

export default withRouter(AdminSide);
