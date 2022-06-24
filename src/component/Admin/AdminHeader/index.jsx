import React, { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, message } from "antd";
import { withRouter } from "react-router-dom";
import "./index.scss";
import { connect } from "react-redux";
import { getUserInfo, logout } from "../../../api";
import { updateUserInfo } from "../../../store/User/actioncreators";
const { Header } = Layout;
const AdminHeader = (props) => {
  useEffect(() => {
    getUser();
  }, []);
  const menu = (
    <Menu>
      <Menu.Item key="1">{props.user.userInfo.name}</Menu.Item>
      <Menu.Item key="2" danger onClick={() => userlogout()}>
        退出
      </Menu.Item>
    </Menu>
  );
  const getUser = async () => {
    if (props.user.token) {
      let result = await getUserInfo();
      if (result.status_code === 200) {
        if (result.data.role_id !== 1) {
          return message.error("权限不足，请联系管理员");
        }
        props.updateUser({ userInfo: result.data });
      } else {
        localStorage.setItem("TOKEN", "");
        props.updateUser({ userInfo: "", token: "" });
        message.error("身份已过期,请重新登录!");
        props.history.push("/admin/login");
      }
    } else {
      message.error("非法访问");
      props.history.push("/admin/login");
    }
  };
  //退出登录的回调
  const userlogout = async () => {
    let result = await logout();
    if (result?.status_code === 200) {
      message.success("退出成功!");
      props.updateUser({ token: "", userInfo: {} });
      localStorage.setItem("TOKEN", "");
      props.history.push("/admin/login");
    } else {
      message.error("退出失败!");
    }
  };
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
      }}
    >
      <div className="header-left">
        <div className="logo">博客后台管理系统</div>
        {React.createElement(
          props.isShow ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => props.changIsShow(),
          }
        )}
      </div>
      <div className="heder-right">
        <span style={{ marginRight: "10px" }} className={"username"}>
          欢迎{props.user.userInfo.name}回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" src={props.user.userInfo.avatar} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default connect(
  (state) => ({
    user: state.user,
  }),
  {
    updateUser: updateUserInfo,
  }
)(withRouter(AdminHeader));
