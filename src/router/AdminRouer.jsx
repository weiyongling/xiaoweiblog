import React, { useEffect } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import UserInfo from "../view/Admin/Home/UserInfo";
import ArticleMange from "../view/Admin/Home/ArticleManage";
import Blogroll from "../view/Admin/Home/Blogroll";
import CategoryMange from "../view/Admin/Home/CategoryMange";
import Analyze from "../view/Admin/Home/Analyze";
import Writing from "../view/Admin/Home/Writiing";
import Drafts from "../view/Admin/Home/Drafts";
import UrlCategory from "../view/Admin/Home/UrlCategory";
import AdminAddUser from "../view/Admin/Home/AdminAddUser";
import AdminUserList from "../view/Admin/Home/AdminUserList";
import AdminComment from "../view/Admin/Home/AdminComment";
import { connect } from "react-redux";
import { updateUserInfo } from "../store/User/actioncreators";
import { updateModel } from "../store/login/actioncreators";
import { message } from "antd";

const AdminRouter = (props) => {
  useEffect(() => {
    //判断是否有token，如果没有token就回到首页
    if (!props.token) {
      message.warning("请先登录!");
      props.history.push("/admin/login");
    }
  }, []);

  return (
    <Switch>
      {props.token && (
        <>
          <Route path="/admin/userinfo" component={UserInfo}></Route>
          <Route path="/admin/articlemange" component={ArticleMange}></Route>
          <Route path="/admin/blogroll" component={Blogroll}></Route>
          <Route path="/admin/urlcategory" component={UrlCategory}></Route>
          <Route path="/admin/categorymange" component={CategoryMange}></Route>
          <Route path="/admin/analyze" component={Analyze}></Route>
          <Route path="/admin/writing" component={Writing}></Route>
          <Route path="/admin/drafts" component={Drafts}></Route>
          <Route path="/admin/adduser" component={AdminAddUser}></Route>
          <Route path="/admin/userlist" component={AdminUserList}></Route>
          <Route path="/admin/comment" component={AdminComment}></Route>
          {/*<Redirect to="/admin/userinfo" />*/}
        </>
      )}
      {/*<Redirect to="/user/userinfo" />*/}
    </Switch>
  );
};

export default connect(
  (state) => ({
    userInfo: state.user.userInfo,
    token: state.user.token,
  }),
  {
    updateUser: updateUserInfo,
    updateModel: updateModel,
  }
)(withRouter(AdminRouter));
