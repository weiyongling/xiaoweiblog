import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { withRouter } from "react-router-dom";
import "./index.scss";
import MyNavlink from "../../../component/MyNavlink";
import UserRouter from "../../../router/UserRouter";

const User = (props) => {
  return (
    <div id="user">
      <div className="user-region">
        <UserRouter></UserRouter>
      </div>
    </div>
  );
};

export default withRouter(User);
