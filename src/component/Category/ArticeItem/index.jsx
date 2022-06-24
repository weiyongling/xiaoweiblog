import React from "react";
import "./index.scss";
import { withRouter } from "react-router-dom";
import LazyLoad from "react-lazyload";
function ArticlItem(props) {
  /**
   * 函数区
   */
  const toDetail = (id) => {
    props.history.push(`/articledetail?id=${id}`);
  };
  return (
    <div id="articleItem">
      <div className="article_left">
        <img src={props.thumbnail} alt="" onClick={() => toDetail(props.id)} />
        <div className="heat">
          <div className="li">
            <span className="iconfont icon-xiaoxizhongxin"></span>
            啥也没有呀
          </div>
          <div className="li">
            <span className="iconfont icon-redu"></span>
            {props.pageview}热度
          </div>
        </div>
        <div className="zzc" onClick={() => toDetail(props.id)}>
          <span className="iconfont icon-wenzhang-copy"></span>
        </div>
      </div>
      <div className="article_right">
        <div className="header">
          <div className="title" onClick={() => toDetail(props.id)}>
            {props.title}
          </div>
          <div className="date">
            <span
              className="iconfont icon-timer"
              style={{ marginRight: "5px" }}
              onClick={() => toDetail(props.id)}
            ></span>
            发布于{props.pushTime.substring(0, 11)}
          </div>
        </div>
        <div className="text">{props.content}</div>
        <div className="more">
          <span
            className="iconfont icon-24gf-ellipsis"
            style={{ marginRight: "5px" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ArticlItem);
