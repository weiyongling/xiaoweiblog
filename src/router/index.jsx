import React, { Fragment, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Spin } from "antd";
const Home = lazy(() => import("../view/Web/Home"));
const Category = lazy(() => import("../view/Web/Category"));
const ArticleDetail = lazy(() => import("../view/Web/ArtcileDetail"));
const User = lazy(() => import("../view/Web/User"));
const Blogrolls = lazy(() => import("../view/Web/Blogrolls"));
const Search = lazy(() => import("../view/Web/Search"));
const Login = lazy(() => import("../view/Admin/Login"));
const Layout = lazy(() => import("../view/Admin/Home"));
const router = () => {
  return (
    <Fragment>
      <Suspense fallback={<Spin />}>
        <Switch>
          <Route path="/home" component={Home} exact />
          <Route path="/category" component={Category} exact />
          <Route path="/articledetail" component={ArticleDetail} exact />
          <Route path="/user" component={User} />
          <Route path="/blogrolls" component={Blogrolls} />
          <Route path="/search/:keyword" component={Search} />
          <Route path="/admin/login" component={Login}></Route>
          <Route path="/admin" component={Layout}></Route>
          <Redirect to="/home" />
        </Switch>
      </Suspense>
    </Fragment>
  );
};

export default router;
