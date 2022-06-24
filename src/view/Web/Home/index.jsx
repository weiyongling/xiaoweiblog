import React, { useEffect, useRef, useState } from "react";
import useTypewriter from "react-typewriter-hook";
import { getArticleList, hotArticle } from "../../../api";
import qqurl from "../../../assets/images/qq.png";
import wecheat from "../../../assets/images/wechart.jpg";
import { marked } from "marked";
import "./index.scss";
import { message, Spin } from "antd";
import ArticleHomeItem from "../../../component/Home/ArticleHomeItem";
import { withRouter } from "react-router-dom";
import { NoticeBar } from "antd-mobile";

const Home = (props) => {
  /**
   * 变量区
   */
  const typing = useTypewriter("没有完美的程序,只有修改不完的BUG");
  const [articleList, setArticleList] = useState([]);
  const [hotArticleList, setHotArticleList] = useState([]);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const demoLongText =
    "愿疫情早点结束，愿这盛世都如你所愿.愿疫情早点结束，愿这盛世都如你所愿.愿疫情早点结束，愿这盛世都如你所愿.愿疫情早点结束，愿这盛世都如你所愿";
  /**
   * ref区
   */
  const nextRef = useRef();

  /**
   * useEffect区
   */
  useEffect(() => {
    getArticl(limit);
    getHotArticle();
    return componentWillUnmount;
  }, []);

  /**
   * 函数区
   */

  //组件销毁要做的事情
  const componentWillUnmount = () => {};
  //点击滑动到文章列表
  const next = () => {
    let height = document.body.clientHeight;
    let i = 0;
    let timer = setInterval(() => {
      i += 20;
      document.querySelector("html").scrollTop = i;
      if (i >= height) {
        clearInterval(timer);
      }
    }, 10);
  };

  //获取文章列表
  const getArticl = async (limits) => {
    setLimit(limits);
    let result = await getArticleList({ limit: limits, status: 1 });
    if (result.status_code === 200) {
      result.data.data.forEach((item) => {
        item.content = window
          .repalceHtmlToText(marked.parse(item.content))
          .replace("/\n*/g", "");
      });
      setArticleList(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("获取分类列表失败");
    }
    setBtnLoading(false);
  };
  //获取热门文章
  const getHotArticle = async () => {
    let result = await hotArticle();
    console.log(result);
    if (result.status_code === 200) {
      setHotArticleList(result.data);
    } else {
      message.error("热门文章请求失败!");
    }
  };
  const toDetail = (id) => {
    props.history.push(`/articledetail?id=${id}`);
  };
  const handelMore = () => {
    setBtnLoading(true);
    getArticl(limit + 5);
  };

  return (
    <>
      <div id="home">
        <img
          src={
            "https://c.wallhere.com/images/28/c6/ef27f2cc88f1547e76713b511769-1582587.jpg!d"
          }
          alt=""
          className="bg animate__animated animate__fadeIn"
        />
        <div className="title animate__animated animate__slideInDown">
          <div className="typer">“ {typing} ”</div>
          <div className="sign">
            <div className="li">
              <span>
                <a href="https://github.com/weiyongling">
                  <span
                    className="iconfont icon-github"
                    style={{ color: "#000" }}
                  ></span>
                </a>
              </span>
            </div>
            <div className="li">
              <span className="iconfont icon-QQ"></span>
              <div className="triangle"></div>
              <div className="img">
                <img src={qqurl} alt="qq" />
              </div>
            </div>
            <div className="li">
              <span
                className="iconfont icon-weixin"
                style={{ color: "#28c445" }}
              ></span>
              <div className="triangle"></div>
              <div className="img">
                <img src={wecheat} alt="qq" />
              </div>
            </div>
            <div className="li">
              <span>
                <a href="https://space.bilibili.com/1167317248?spm_id_from=333.1007.0.0">
                  <span
                    className="iconfont icon-bilibili-line"
                    style={{ color: "#e76a8d" }}
                  ></span>
                </a>
              </span>
            </div>
          </div>
          <div className="next" ref={nextRef} onClick={next}>
            <span className="iconfont icon-angle-down"></span>
          </div>
        </div>
        <div className="vessel">
          <div className="content">
            <div className="notice">
              <NoticeBar content={demoLongText} color="alert" />
            </div>
            <div className="topArticle">
              <div className="top_title animate__animated animate__slideInDown">
                <span className="iconfont icon-paihangbang"></span>热门文章
              </div>
              <div className="body animate__animated animate__fadeInUp">
                {hotArticleList.map((item) => {
                  return (
                    <div
                      className="item"
                      key={item.id}
                      onClick={() => toDetail(item.id)}
                    >
                      <img src={item.thumbnail} alt="" />
                      <div className="zzc"></div>
                      <div className="item-title">{item.title}</div>
                      <div className="item-body">{item.category.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="article">
              <div className="article-title animate__animated animate__slideInDown">
                <span className="iconfont icon-wodewenzhang"></span>最新文章
              </div>
              <div className="article-body animate__animated animate__fadeInUp">
                {articleList.map((item) => {
                  return <ArticleHomeItem {...item} key={item.id} />;
                })}
                {limit < total ? (
                  <div className="more-btn" onClick={handelMore}>
                    <button>{btnLoading ? <Spin /> : "加载更多评论"} </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Home);
