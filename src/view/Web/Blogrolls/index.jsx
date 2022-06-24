import React, { useEffect, useState, useRef, Fragment } from "react";
import { addComment, getCommentList, getUrlList } from "../../../api";
import "./index.scss";
import { Avatar, message, Spin } from "antd";
import { withRouter } from "react-router-dom";
import CommentItem from "../../../component/ArtcileDetail/CommentItem";
import TextArea from "antd/es/input/TextArea";
import { connect } from "react-redux";
const Blogrolls = (props) => {
  /**
   * 变量区
   */
  const [list, setList] = useState([]);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [replayUser, setReplayUser] = useState(null);
  const [commentLimit, setCommentLimit] = useState(null);
  const [total, setTotal] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);

  /**
   * Ref区
   */
  const textRef = useRef();

  /**
   * useEffect区
   */
  useEffect(() => {
    getList();
    getCommentsList(5);
  }, []);

  /**
   * 函数区
   */
  const getList = async () => {
    let result = await getUrlList();
    console.log(result);
    if (result.status_code === 200) {
      result.data = result.data.filter((item) => item.children.length != 0);
      setList(result.data);
    } else {
      message.error("请求列表失败");
    }
  };
  //获取用户的系统和浏览器信息
  const getsystem = () => {
    const userAgentObj = {
      browserName: "", // 浏览器名称
      osName: "", // 操作系统名称
    };
    if (navigator.userAgent.indexOf("Win") !== -1)
      userAgentObj.osName = "Windows";
    if (navigator.userAgent.indexOf("Mac") !== -1) userAgentObj.osName = "Mac";
    if (navigator.userAgent.indexOf("Linux") !== -1)
      userAgentObj.osName = "Linux";
    if (navigator.userAgent.indexOf("Android") !== -1)
      userAgentObj.osName = "Android";
    if (navigator.userAgent.indexOf("like Mac") !== -1)
      userAgentObj.osName = "Ios";
    if (/chrome/i.test(navigator.userAgent))
      userAgentObj.browserName = "Chrome";
    if (/edg/i.test(navigator.userAgent)) userAgentObj.browserName = "Edge";
    if (/firefox/i.test(navigator.userAgent))
      userAgentObj.browserName = "Firefox";
    if (/opera/i.test(navigator.userAgent)) userAgentObj.browserName = "Opera";
    return userAgentObj;
  };
  //评论
  const handleComment = async () => {
    const token = localStorage.getItem("TOKEN");
    if (!token) {
      return message.warning("请先登录!");
    }
    const content = comment.replace(/\n/g, "<br />");
    if (!content.trim()) {
      return message.error("评论不能为空");
    }
    const obj = getsystem();
    const user_id = props.user.userInfo.id;
    const browser = obj.browserName;
    const system = obj.osName;
    const a_id = 111111111;
    const p_id = replayUser ? replayUser.id : 0;
    const replay_name = replayUser ? replayUser.name : null;
    const result = await addComment({
      user_id,
      content,
      browser,
      system,
      a_id,
      p_id,
      replay_name,
    });
    if (result.status_code === 200) {
      message.success("评论成功!");
      setReplayUser(null);
      setComment("");
      getCommentsList();
    } else {
      message.error("评论失败!");
    }
  };
  //获取评论列表
  const getCommentsList = async (limit) => {
    setCommentLimit(limit);
    const result = await getCommentList({
      a_id: 111111111,
      limit,
    });
    if (result.status_code === 200) {
      setCommentList(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("请求评论失败!");
    }
    setBtnLoading(false);
  };
  //获取评论的内容
  const handleChange = (e) => setComment(e.target.value);
  //接收要回复的人的信息
  const getReplayInfo = (value) => {
    setReplayUser(value);
    setTimeout(() => {
      textRef.current.focus();
    }, 10);
  };
  const handelMore = () => {
    setBtnLoading(true);
    getCommentsList(commentLimit + 5);
  };
  //取消回复
  const cancelReplay = () => setReplayUser(null);
  return (
    <div id={"blogrolls"}>
      <div className="title">
        <div className="title_background animate__animated animate__slideInDown"></div>
        <div className="title_text animate__animated animate__fadeInUp animate__delay-1s">
          欢迎各位大佬交换友情链接
        </div>
      </div>
      <div className="container">
        <div className="statement">
          <div className="remark">
            <p>互换友链请按照如下格式评论：</p>
            <p>站名：(最好不要太长，控制在八个中文字符宽度内)</p>
            <p>站点链接：(你的网站链接，请附带http / https)</p>
            <p>头像：(你的头像链接，请确保它为正方形或圆形)</p>
            <p>站点描述：(简单描述一下你的站点、或者你喜欢的句子)</p>
          </div>
          <div className="meInfo">
            <p>本站信息：</p>
            <p>站名：xiaoweiのblog</p>
            <p>站点链接：https://www.xiaowei.blog</p>
            <p>
              头像：https://www.jipa.work/wp-content/uploads/2021/09/1bbd2e38ea880f3.jpg
            </p>
            <p>站点描述：没有完美的程序，只有修不完的BUG。</p>
          </div>
          <div className="waring">
            如果你的站点文章数量较少（少于3篇）、内容质量过低、版权纠纷、存在广告、违反中国大陆地区相关法律的内容，将不会被收录。
          </div>
        </div>
        <div className="list">
          {list.map((item) => {
            return (
              <div className="item">
                <h3>{item.category_name}</h3>
                <div className="ul">
                  {item.children.map((value) => {
                    return (
                      <div className="li" key={value.id}>
                        <a href={value.url}>
                          <img src={value.avatar} alt={value.name} />
                          <span className={"blogname"}>{value.name}</span>
                          <span className="description">
                            {value.site_description}
                          </span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="commentList">
          <div className="commentList_title">Comment List</div>
          <div className="commentList_content">
            {commentList.map((item) => {
              return (
                <Fragment key={item.content + item.id}>
                  <CommentItem
                    {...item}
                    key={item.id}
                    getReplayInfo={getReplayInfo}
                    getCommentsList={getCommentsList}
                  />
                  {replayUser?.id === item.id && (
                    <>
                      <div className="replayInfo">
                        <span>回复给{replayUser.name}</span>
                        <button onClick={cancelReplay}>取消回复</button>
                      </div>
                      <div className="comment">
                        <TextArea
                          rows={4}
                          placeholder="文章如有错误，还望您在此评论"
                          onChange={handleChange}
                          value={comment}
                          ref={textRef}
                        />
                        <button onClick={handleComment}>BiuBiuBiu~</button>
                      </div>
                    </>
                  )}
                </Fragment>
              );
            })}
            {commentLimit < total ? (
              <div className="more-btn" onClick={handelMore}>
                <button>{btnLoading ? <Spin /> : "加载更多评论"} </button>
              </div>
            ) : (
              ""
            )}
            {commentList.length === 0 ? (
              <span className={"nothing"}>还没有评论哟~~</span>
            ) : (
              ""
            )}
          </div>
        </div>
        {!replayUser && (
          <div className="comment">
            <TextArea
              rows={4}
              placeholder="文章如有错误，还望您在此评论"
              onChange={handleChange}
              value={comment}
              ref={textRef}
            />
            <button onClick={handleComment}>BiuBiuBiu~</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect((state) => ({
  user: state.user,
}))(withRouter(Blogrolls));
