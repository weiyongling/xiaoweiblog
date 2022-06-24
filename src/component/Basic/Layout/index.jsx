import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import Header from "../Header";
import Router from "../../../router";
import Footer from "../Footer";
import { connect } from "react-redux";

const Layout = (props) => {
  return (
    <Fragment>
      {props.location.pathname.indexOf("/admin") === -1 && <Header />}
      <div
        className={
          props.store.isMenu
            ? "active_container active_container_actives"
            : "active_container"
        }
      >
        <Router />
      </div>
      {props.location.pathname.indexOf("/admin") === -1 && <Footer />}
    </Fragment>
  );
};

export default connect((state) => ({
  store: state.loginInfo,
}))(withRouter(Layout));
