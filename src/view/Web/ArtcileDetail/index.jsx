import React, { Fragment, useEffect, useRef, useState } from "react";
import { Input, message, Avatar, Spin } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import MarkNav from "markdown-navbar";
import copy from "copy-to-clipboard";
import qs from "query-string";
import "./index.scss";
import CommentItem from "../../../component/ArtcileDetail/CommentItem";
import "github-markdown-css";
import { getArticleDetail, addComment, getCommentList } from "../../../api";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const { TextArea } = Input;
const Code = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={darcula}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        {...props}
        showLineNumbers
      />
    ) : (
      <code className={className} {...props} />
    );
  },
};
function ArticleDetail(props) {
  /**
   * 变量区
   */
  const [text, setText] = useState("");
  const [info, setInfo] = useState({});
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [next, setNext] = useState(null);
  const [pre, setPre] = useState(null);
  const [replayUser, setReplayUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const id = qs.parse(props.location.search).id;
  const [btnLoading, setBtnLoading] = useState(false);
  const bgGround = {
    backgroundImage: `url(${info.thumbnail})`,
  };

  /**
   * ref区
   */
  const textRef = useRef();

  /**
   * useEffect区
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    getDetail();
    getCommentsList(5);
  }, [id]);
  useEffect(() => {
    let copys = document.querySelectorAll(".copy");
    copys.forEach((item) => {
      item.addEventListener("click", function (event) {
        copy(event.target.nextSibling?.innerHTML, {
          debug: true,
          message: "Press #{key}to copy",
        });
      });
    });
  }, [text]);

  /**
   * 函数区
   */
  //获取文章详情函数
  const getDetail = async () => {
    let result = await getArticleDetail({ id });
    if (result.status_code === 200) {
      setInfo(result.data);
      setText(result.data.content);
      setPre(result.pre);
      setNext(result.next);
    } else {
      message.error(result.msg);
      props.history.push("/home");
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
    const content = comment.replace(/\n/g, "<br/>");
    if (!content.trim()) {
      return message.error("评论不能为空");
    }
    const obj = getsystem();
    const user_id = props.user.userInfo.id;
    const browser = obj.browserName;
    const system = obj.osName;
    const a_id = info.id;
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
  const getCommentsList = async (limits) => {
    setLimit(limits);
    const id = qs.parse(props.location.search).id;
    const result = await getCommentList({ a_id: id, limit: limits });
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
  //切换文章
  const handleToDetail = (id) => props.history.push(`/articledetail?id=${id}`);
  //接收要回复的人的信息
  const getReplayInfo = (value) => {
    setReplayUser(value);
    setTimeout(() => {
      textRef.current.focus();
    }, 10);
  };
  const handelMore = () => {
    setBtnLoading(true);
    getCommentsList(limit + 5);
  };
  //取消回复
  const cancelReplay = () => setReplayUser(null);
  return (
    <div id="ArticleDetail">
      <div className="userInfo ">
        <div
          className="thumbnail animate__animated animate__slideInDown "
          style={bgGround}
        ></div>
        <div className="userInfo-region">
          <div className="title animate__animated animate__fadeInUp animate__delay-1s">
            {info.title}
          </div>
          <span className="wire animate__animated animate__fadeInUp animate__delay-1s"></span>
          <div className="date animate__animated animate__fadeInUp animate__delay-1s">
            <Avatar
              src="https://joeschmoe.io/api/v1/random"
              size={35}
              maxStyle={{ background: "#fff" }}
            />
            <div className="date-info">
              <div className="name">{info.author} ·</div>
              <span>发布于 {info?.pushTime?.substring(0, 11)} ·</span>
              <span>{info.pageview} 阅读</span>
            </div>
          </div>
        </div>
      </div>
      <div className="region">
        {/*        <Anchor>
          <div className="markNav-title">文章目录</div>
          <MarkNav
            className="article-menu"
            source={text}
            headingTopOffset={80}
          />
        </Anchor>*/}

        <div className="text">
          <article className="markdown-body">
            <ReactMarkdown
              children={text}
              remarkPlugins={[remarkGfm]}
              components={Code}
            />
          </article>
        </div>
        <div className="reward">
          <span>赏</span>
        </div>
        <div className="commentList">
          <div className="commentList_title">Comment List</div>
          <div className="commentList_content">
            {commentList.map((item) => {
              return (
                <Fragment key={item.id}>
                  <CommentItem
                    {...item}
                    // key={item.id}
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
            {limit < total ? (
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
        <div className="page">
          {next && pre && (
            <>
              <div className="pages" onClick={() => handleToDetail(pre.id)}>
                <span>上一篇文章</span>
                <div className="zzc"></div>
                <div className="page_title">{pre.title}</div>
                <img src={pre.thumbnail} alt={pre.title} />
              </div>
              <div className="pages" onClick={() => handleToDetail(next.id)}>
                <span>下一篇文章</span>
                <div className="zzc"></div>
                <div className="page_title">{next.title}</div>
                <img src={next.thumbnail} alt={next.title} />
              </div>
            </>
          )}
          {pre != null && next === null ? (
            <div className="pages" onClick={() => handleToDetail(pre.id)}>
              <span>上一篇文章</span>
              <div className="zzc"></div>
              <div className="page_title">{pre.title}</div>
              <img src={pre.thumbnail} alt={pre.title} />
            </div>
          ) : next != null && pre === null ? (
            <div className="pages" onClick={() => handleToDetail(next.id)}>
              <span>下一篇文章</span>
              <div className="zzc"></div>
              <div className="page_title">{next.title}</div>
              <img src={next.thumbnail} alt={next.title} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default connect((state) => ({
  user: state.user,
}))(withRouter(ArticleDetail));
