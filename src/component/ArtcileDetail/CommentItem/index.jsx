import React, { useEffect } from "react";
import "./index.scss";
import { withRouter } from "react-router-dom";
import { commentLike } from "../../../api";
import { message } from "antd";

const CommentItem = (props) => {
  /**
   * 函数区
   */
  //回复
  const replay = (name) => {
    props.getReplayInfo({ name, id: props.id });
  };
  //点赞
  const commentLikes = async (id, type) => {
    if (!localStorage.getItem("TOKEN")) {
      return message.warning("请先登录!");
    }
    const like = !type;
    let result = await commentLike({ id, like });
    if (result.status_code === 200) {
      props.getCommentsList();
    } else {
      message.error("点赞失败");
    }
  };
  return (
    <>
      <div id="CommentItem">
        <div className="left">
          <img src={props.users.avatar} alt="" />
        </div>
        <div className="right">
          <div className="hd">
            <div className="hd_left">
              <div className="name">{props.users.name}</div>
              <div className="dates">
                <span>发布于 {props.created_at.substring(0, 10)}</span>
                <span className={"system"}>
                  (
                  <img
                    src={require(`../../../assets/images/${props.browser}.png`)}
                    alt=""
                  />
                  <span className="sysinfo">{props.browser}</span>
                  <img
                    src={require(`../../../assets/images/${props.system}.png`)}
                    alt=""
                  />
                  <span className="sysinfo">{props.system}</span>)
                </span>
              </div>
            </div>
            <div className="hd_right">
              <div
                className="like"
                onClick={() => commentLikes(props.id, props.isLike)}
              >
                <span
                  className={
                    props.isLike
                      ? "iconfont icon-dianzan_kuai"
                      : "iconfont icon-dianzan"
                  }
                  style={{ marginRight: "5px" }}
                ></span>{" "}
                {props.like_count}
              </div>
              <div className="reply" onClick={() => replay(props.users.name)}>
                回复
              </div>
            </div>
          </div>
          <div className="bd">
            <p dangerouslySetInnerHTML={{ __html: props.content }}></p>
          </div>
        </div>
      </div>
      {props.children.map((item) => {
        return (
          <div id="CommentItem2" key={item.id}>
            <div className="left">
              <img src={item.users.avatar} alt="" />
            </div>
            <div className="right">
              <div className="hd">
                <div className="hd_left">
                  <div className="name">{item.users.name}</div>
                  <div className="dates">
                    <span>发布于 {item.created_at}</span>
                    <span className={"system"}>
                      (
                      <img
                        src={require(`../../../assets/images/${item.browser}.png`)}
                        alt={item.browser}
                      />
                      <span className="sysinfo">{props.browser}</span>
                      <img
                        src={require(`../../../assets/images/${item.system}.png`)}
                        alt={item.system}
                      />
                      <span className="sysinfo">{props.system}</span>)
                    </span>
                  </div>
                </div>
                <div className="hd_right">
                  <div
                    className="like"
                    onClick={() => commentLikes(item.id, item.isLike)}
                  >
                    <span
                      className={
                        item.isLike
                          ? "iconfont icon-dianzan_kuai"
                          : "iconfont icon-dianzan"
                      }
                      style={{ marginRight: "5px" }}
                    ></span>{" "}
                    {item.like_count}
                  </div>
                  <div
                    className="reply"
                    onClick={() => replay(item.users.name)}
                  >
                    回复
                  </div>
                </div>
              </div>
              <div className="bd">
                回复{" "}
                <span style={{ color: "#008fca" }}>@{item.replay_name}</span>:{" "}
                <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default withRouter(CommentItem);
