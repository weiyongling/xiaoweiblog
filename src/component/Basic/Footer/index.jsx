import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./index.scss";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
const Footer = (props) => {
  const [speech, setSpeech] = useState({});
  let timer;
  useEffect(() => {
    axios({
      method: "get",
      url: "https://v1.hitokoto.cn/",
    }).then((res) => setSpeech(res.data));
    return componentWillUnmount;
  }, []);
  const componentWillUnmount = () => {
    clearInterval(timer);
  };
  return (
    <div
      className={
        props.store.isMenu
          ? "active_container active_container_actives"
          : "active_container"
      }
    >
      <div id="footer">
        <div className="footer-region">
          <div className="sign">
            <span className="iconfont icon-xuehuayuanjiao"></span>
          </div>
          <div className="copyright">
            Copyright © 2018-2022 xiaowei.All Rights Reserved
          </div>
          <div className="wisdom">{speech.hitokoto}</div>
          <div
            style={{
              width: "300px",
              margin: "0 auto",
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            <a
              target="_blank"
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010702001868"
              style={{
                display: "inline-block",
                textDecoration: "none",
                height: "20px",
                lineHeight: "20px",
              }}
            >
              <img
                src="http://127.0.0.1:8001/upload/628b2f602dab0.png"
                style={{ float: "left" }}
              />
              <p
                style={{
                  float: "left",
                  height: "20px",
                  lineHeight: "20px",
                  margin: "0px 0px 0px 5px",
                  color: "#939393",
                }}
              >
                桂公网安备 45010702001868号
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect((state) => ({
  store: state.loginInfo,
}))(withRouter(Footer));
