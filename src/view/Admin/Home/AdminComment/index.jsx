import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Tag,
  message,
  Modal,
  Image,
  Table,
  Tooltip,
} from "antd";
import "./index.scss";
import Tables from "../../../../component/Table";
import { getCommentList, deleteArticle } from "../../../../api";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import MyNavlink from "../../../../component/MyNavlink";

const AdminComment = (props) => {
  /**
   *变量区
   */

  const columns = [
    {
      title: "id",
      width: 80,
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "评论人",
      align: "center",
      width: 100,
      render: (obj) => {
        if (obj.users.name.length > 10) {
          return (
            <Tooltip placement="top" title={obj.users.name}>
              {obj.users.name}
            </Tooltip>
          );
        } else {
          return <>{obj.users.name}</>;
        }
      },
    },
    {
      title: "文章标题",
      align: "center",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (obj) => {
        const title = obj.article?.id ? obj.article.title : "友情链接";
        if (title.length > 10) {
          return (
            <Tooltip placement="top" title={title}>
              {title}
            </Tooltip>
          );
        } else {
          return <>{title}</>;
        }
      },
    },
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
      align: "center",
      width: 150,
      render: (content) => {
        if (content.length > 13) {
          return (
            <Tooltip placement="topLeft" title={content}>
              {content}
            </Tooltip>
          );
        } else {
          return content;
        }
      },
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "评论时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
      key: "like_count",
      width: 100,
      align: "center",
    },
    {
      title: "操作",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      fixed: "right",
      render: (obj) => (
        <>
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ marginLeft: "1rem" }}
            onClick={() => handleDelete(obj.id)}
          />
        </>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currrent, setCurrent] = useState(1);
  const [limit, setLimit] = useState(4);
  const [keyword, setKeyword] = useState("");

  const { confirm } = Modal;
  /**
   * useEffect区
   */
  useEffect(() => {
    CommentList(1);
  }, []);

  /**
   * ref区
   */

  /**
   * 函数区
   */

  //获取评论列表
  const CommentList = async (page) => {
    setIsLoading(true);
    let result = await getCommentList({ limit, page, keyword });
    if (result.status_code === 200) {
      result.data.data.forEach((item) => {
        item.content = window.repalceHtmlToText(item.content);
        if (JSON.stringify(item.children) === "[]") {
          delete item.children;
        } else {
          item.children.forEach((value) => {
            value.content = window.repalceHtmlToText(value.content);
          });
        }
      });
      setData(result.data.data);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  };
  const changePage = (page) => {
    setCurrent(page);
    CommentList(page);
  };
  //删除文章
  const handleDelete = async (id) => {
    confirm({
      title: "此操作将删除评论,删除将不可恢复,是否继续?",
      icon: <ExclamationCircleOutlined />,

      onOk() {
        deleteRequest(id);
      },
      onCancel() {
        message.info("已取消");
      },
    });
  };
  //删除的请求
  const deleteRequest = async (id) => {
    let result = await deleteArticle(id);
    if (result.status_code === 200) {
      message.success("删除成功");
      CommentList();
    } else {
      message.error("删除失败");
    }
  };
  //搜索
  const handleSearch = () => {
    CommentList(1);
  };
  //获取关键词
  const handleGetKeywrod = (e) => {
    setKeyword(e.target.value);
  };
  //键盘事件
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      CommentList(0);
    }
  };
  return (
    <>
      <div className="table">
        <div className="search">
          <Input
            placeholder="请输入关键词"
            className="searchInput"
            onChange={handleGetKeywrod}
            onKeyUp={handleKeyUp}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
        </div>
        <Tables
          columns={columns}
          data={data}
          isLoading={isLoading}
          limit={limit}
          current={currrent}
          total={total}
          changePage={changePage}
        />
      </div>
    </>
  );
};

export default withRouter(AdminComment);
