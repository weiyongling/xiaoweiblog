import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { searchArticle } from "../../../api";
import "./index.scss";
import { message } from "antd";
import ArticleHomeItem from "../../../component/Home/ArticleHomeItem";
import { marked } from "marked";
const Search = (props) => {
  const [articleList, setArticleList] = useState([]);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!props.match.params.keyword) {
      props.history.push("/");
    }
    getSearchResult(5);
  }, [props.match.params.keyword]);
  //搜索
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const value = e.target.value;
      e.target.value = null;
      props.history.push(`/search/${value}`);
    }
  };
  //获取搜索结果
  const getSearchResult = async (number) => {
    setLimit(number);
    let result = await searchArticle({
      keyword: props.match.params.keyword,
      limit: number,
    });
    if (result.status_code === 200) {
      result.data.data.forEach((item) => {
        item.content = repalceHtmlToText(marked.parse(item.content)).replace(
          "/\n*/g",
          ""
        );
      });
      setArticleList(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("搜索失败");
    }
  };
  //将html文本转换为纯文本
  const repalceHtmlToText = (str) => {
    str = str.replace(/<\/?.+?>/g, "");
    str = str.replace(/&nbsp;/g, "");
    return str;
  };
  //获取更多的文章
  const handelMore = () => {
    const limits = limit + 5;
    getSearchResult(limits);
  };
  return (
    <div id={"Search"}>
      <div className="title">
        <div className="title_background animate__animated animate__slideInDown"></div>
        <div className="title_text animate__animated animate__fadeInUp animate__delay-1s">
          关于“{props.match.params.keyword}”搜索结果
        </div>
      </div>
      <div className="container">
        <div className="searchForm">
          <span className={"iconfont icon-sousuo1"}></span>
          <input type="text" placeholder="搜索" onKeyDown={handleSearch} />
        </div>
        <div className="article-body">
          {articleList.map((item) => {
            return <ArticleHomeItem {...item} key={item.id} />;
          })}
          {JSON.stringify(articleList) === "[]" && (
            <h2 className={"result"}>没有搜索结果，换个词试试~~</h2>
          )}
        </div>
        {limit < total ? (
          <div className="more-btn" onClick={handelMore}>
            <button>更多的文章</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default withRouter(Search);
