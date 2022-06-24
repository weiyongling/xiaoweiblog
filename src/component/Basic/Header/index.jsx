import React, { Fragment, useEffect, useRef, useState } from "react";
import { Avatar, Menu, Dropdown, message } from "antd";
import { connect } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import "./index.scss";
import MyNavlink from "../../MyNavlink";
import Login from "../../Login";
import { updateModel, updateMenu } from "../../../store/login/actioncreators";
import { updateUserInfo } from "../../../store/User/actioncreators";
import { logout, getUserInfo, getCategoryList } from "../../../api";
import SearchForm from "../../SearchForm";
import { updateSearch } from "../../../store/Search/actioncreators";

const Header = (props) => {
  /**
   * 变量区
   */
  const items1 = [
    {
      label: (
        <div className="item" onClick={() => changeType(0)}>
          <span className="iconfont icon-denglu"></span>
          登录
        </div>
      ),
    },
    {
      label: (
        <div className="item" onClick={() => changeType(1)}>
          <span className="iconfont icon-zhucezhanghu"></span>
          注册
        </div>
      ),
    },
  ];
  const items2 = [
    {
      label: (
        <div className="item" onClick={() => toUrl("/user/userinfo")}>
          <span className="iconfont icon-wodegerenxinxi"></span>
          个人中心
        </div>
      ),
    },
    {
      label: (
        <div className="item" onClick={() => userlogout()}>
          <span className="iconfont icon-tuichudenglu"></span>
          退出
        </div>
      ),
    },
  ];
  const menu = <Menu items={props.user.token ? items2 : items1} />;
  const [category, setCategory] = useState([]);
  /**
   * ref区
   */
  const headerRef = useRef();
  const formRef = useRef();
  /**
   * useEffect区
   */
  useEffect(() => {
    //监听滚动条，如果超过了就给头部添加背景色
    window.onscroll = function (e) {
      if (document.querySelector("html").scrollTop > 50) {
        headerRef.current.style.background = "rgba(255, 255, 255, 1)";
        headerRef.current.style.boxShadow =
          "0 1px 40px -8px rgb(255 255 255 / 40%)";
      } else {
        headerRef.current.style.background = "none";
        headerRef.current.style.boxShadow = "none";
      }
    };
    getUser();
    getCategories();
  }, []);
  useEffect(() => {
    if (props.search.type) {
      document.querySelector("html").style.overflow = "hidden";
    } else {
      document.querySelector("html").style.overflow = "auto";
    }
  }, [props.search.type]);
  /**
   * 方法区
   */
  //获取用户信息
  const getUser = async () => {
    if (props.user.token) {
      let result = await getUserInfo();
      if (result.status_code === 200) {
        props.updateUser({ userInfo: result.data });
      } else {
        localStorage.setItem("TOKEN", "");
        props.updateUser({ userInfo: "", token: "" });
      }
    }
  };
  //跳转分类
  const toCategory = (item) => {
    props.updateMenu({ isMenu: false });
    props.history.push({
      pathname: "/category",
      state: {
        id: item.id,
        name: item.name,
      },
    });
  };
  //跳转路由
  const toUrl = (url) => {
    props.updateMenu({ isMenu: false });
    props.history.push(url);
  };
  //修改类型
  const changeType = (type) => {
    props.updateModel({ isShow: true });
    setTimeout(() => {
      props.updateModel({ type, actionFlag: true });
    }, 10);
  };
  //退出登录的回调
  const userlogout = async () => {
    let result = await logout();
    if (result?.status_code === 200) {
      message.success("退出成功!");
      props.updateUser({ token: "", userInfo: {} });
      localStorage.setItem("TOKEN", "");
    } else {
      message.error("退出失败!");
    }
  };
  //获取分类列表
  const getCategories = async () => {
    let result = await getCategoryList();
    if (result.status_code === 200) {
      console.log(result);
      setCategory(result.data.data);
    } else {
      message.error("获取分类失败");
    }
  };
  //返回首页
  const handletoHome = () => {
    props.history.push("/");
  };
  //打开搜索
  const handleToSearch = () => {
    props.updateSearch({ type: 1 });
  };
  //打开菜单
  const handlePayMenu = () => {
    props.updateMenu({ isMenu: !props.store.isMenu });
  };
  //跳转到搜索
  const toSearch = () => {
    const value = formRef.current.value;
    props.history.push(`/search/${value}`);
    props.updateMenu({ isMenu: false });
    formRef.current.value = "";
  };
  return (
    <Fragment>
      <div id="header" className={props.store.isMenu ? "head" : ""}>
        <div className="header-region" ref={headerRef}>
          <div className="menu" onClick={handlePayMenu}>
            <div
              className={props.store.isMenu ? "icon menuicon-active" : "icon"}
            ></div>
          </div>
          <div className="logo" onClick={handletoHome}>
            xiaowei & blog
          </div>

          <div className="nav animate__animated animate__slideInRight">
            <div className="li">
              <span
                className="iconfont icon-shouyefill"
                style={{ marginRight: "5px" }}
              ></span>
              <MyNavlink to="/home" children="首页" />
            </div>
            <div className="li">
              <a herf="javascript:;">
                <span
                  className="iconfont icon-fenlei"
                  style={{ marginRight: "5px" }}
                ></span>
                分类
              </a>
              <div className="ul">
                {category.map((item, index) => {
                  if (index < 2) {
                    return (
                      <span
                        onClick={() => {
                          toCategory(item);
                        }}
                        key={item.id}
                      >
                        {item.name}
                      </span>
                    );
                  }
                })}
                {category.length >= 3 && <span>更多</span>}
              </div>
            </div>
            <div className="li">
              <span
                className="iconfont icon-icon_xinyong_xianxing_jijin-"
                style={{ marginRight: "5px" }}
              ></span>
              <MyNavlink to="/blogrolls" children="友情链接" />
            </div>
          </div>
          <div className="search" onClick={handleToSearch}>
            <span className="iconfont icon-sousuo1"></span>
          </div>
          <div className="login-sign">
            {props.user.userInfo.role_id === 1 && (
              <span className="iconfont icon-VIP vip"></span>
            )}
            <Dropdown
              overlay={menu}
              placement="bottom"
              arrow
              overlayClassName="login-drow"
            >
              {props.user.token ? (
                <Avatar
                  src={props.user.userInfo.avatar}
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <Avatar size={40} icon={<UserOutlined />} />
              )}
            </Dropdown>
          </div>
        </div>
      </div>
      <div
        className={
          props.store.isMenu ? "menu-region menu-region_active" : "menu-region"
        }
      >
        <div className="avatar">
          {props.user.token ? (
            <Avatar
              src={props.user.userInfo.avatar}
              style={{ width: 90, height: 90 }}
            />
          ) : (
            <Avatar size={90} icon={<UserOutlined />} />
          )}
        </div>
        <div className="menu_search">
          <div className="menu_search_region">
            <input type="text" placeholder={"搜索..."} ref={formRef} />
            <span className="iconfont icon-sousuo1" onClick={toSearch}></span>
          </div>
        </div>
        <div className="menu_nav">
          <div className="item1" onClick={() => toUrl("/")}>
            首页
          </div>
          <div className="item1">分类</div>
          {category.map((item, index) => {
            return (
              <div
                className="item2"
                onClick={() => {
                  toCategory(item);
                }}
                key={item.id}
              >
                {item.name}
              </div>
            );
          })}
          <div className="item1" onClick={() => toUrl("/blogrolls")}>
            友情链接
          </div>
        </div>
      </div>
      {props.store.isShow && <Login />}
      {props.search.type ? <SearchForm /> : ""}
    </Fragment>
  );
};
export default connect(
  //映射仓库的数据
  (state) => ({
    store: state.loginInfo,
    user: state.user,
    search: state.search,
  }),
  //映射actions的方法
  {
    updateModel: updateModel,
    updateUser: updateUserInfo,
    updateSearch: updateSearch,
    updateMenu: updateMenu,
  }
)(withRouter(Header));
