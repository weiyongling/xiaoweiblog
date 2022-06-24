import React from "react";
import { Route, Switch } from "react-router-dom";
import UserInfo from "../component/User/UserInfo";
import ArticleMange from "../view/Admin/Home/ArticleManage";
import Blogroll from "../view/Admin/Home/Blogroll";
import CategoryMange from "../view/Admin/Home/CategoryMange";
import Analyze from "../view/Admin/Home/Analyze";
import Writing from "../view/Admin/Home/Writiing";
import Drafts from "../view/Admin/Home/Drafts";
import UrlCategory from "../view/Admin/Home/UrlCategory";

const UserRouter = () => {
  return (
    <Switch>
      <Route path="/user/userinfo" component={UserInfo}></Route>
      <Route path="/user/articlemange" component={ArticleMange}></Route>
      <Route path="/user/blogroll" component={Blogroll}></Route>
      <Route path="/user/urlcategory" component={UrlCategory}></Route>
      <Route path="/user/categorymange" component={CategoryMange}></Route>
      <Route path="/user/analyze" component={Analyze}></Route>
      <Route path="/user/writing" component={Writing}></Route>
      <Route path="/user/drafts" component={Drafts}></Route>

      {/*<Redirect to="/user/userinfo" />*/}
    </Switch>
  );
};

export default UserRouter;
