import React, { useEffect, useState } from "react";
import "./index.scss";
import ArticlItem from "../../../component/Category/ArticeItem";
import { withRouter } from "react-router-dom";
import { marked } from "marked";
import { getArticleList } from "../../../api";
import { message } from "antd";
import { connect } from "react-redux";

const Category = (props) => {
  /**
   * 变量区
   */
  let limit = 5;
  const [totle, setTotal] = useState(0);
  const [articleList, setArticleList] = useState([]);
  /**
   * useEffect区
   */
  useEffect(() => {
    getCategory();
  }, [props]);
  /**
   * 函数区
   */
  //将html文本转换为纯文本
  const repalceHtmlToText = (str) => {
    str = str.replace(/<\/?.+?>/g, "");
    str = str.replace(/&nbsp;/g, "");
    return str;
  };
  //获取文章列表
  const getCategory = async () => {
    let data = {
      category_id: props.location.state.id,
      limit,
    };
    let result = await getArticleList(data);
    console.log(result);
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
      message.error("获取文章列表失败!");
    }
  };
  return (
    <div id="category">
      <div className="category_region">
        <div className="category_title">{props.location.state.name}</div>
        <div className="category_content">
          {articleList.map((item) => (
            <ArticlItem {...item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Category);
