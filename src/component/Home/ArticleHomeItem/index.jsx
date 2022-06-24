import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import "./index.scss";
import LazyLoad from "react-lazyload";
const ArticleHomeItem = (props) => {
  /**
   * 变量区
   */

  /**
   * useEffect区
   */
  useEffect(() => {}, []);

  /**
   * 函数区
   */
  const toDetail = () => {
    props.history.push(`/articledetail?id=${props.id}`);
  };
  return (
    <div className={"ArticleHomeItem"} onClick={toDetail}>
      <div className="left">
        <LazyLoad offset={100}>
          <img src={props.thumbnail} alt="thumbnail" />
        </LazyLoad>
      </div>
      <div className="right">
        <div className="item-title">{props.title}</div>
        <div className="item-content">{props.content}</div>
        <div className="operation-sign">
          <div className="sign-item">
            <span
              className="iconfont icon-redu"
              style={{
                color: "deepskyblue",
                marginRight: "5px",
                fontSize: "18px",
              }}
            ></span>
            {props.pageview}热度
          </div>
          <div className="sign-item">
            <span
              className="iconfont icon-xiaoxizhongxin"
              style={{
                color: "deepskyblue",
                marginRight: "5px",
                fontSize: "18px",
              }}
            ></span>
            4 条评论
          </div>
          <div className="sign-item">
            <span
              className="iconfont icon-wenjianjia"
              style={{
                color: "deepskyblue",
                marginRight: "5px",
                fontSize: "18px",
              }}
            ></span>
            {props.category.name}
          </div>
        </div>
        <div className="date">
          <span>
            <span className="iconfont icon-timer"></span>发布于{" "}
            {props.pushTime?.substring(0, 11)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ArticleHomeItem);
