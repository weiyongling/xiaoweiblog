import React, { useEffect, useRef, useState } from "react";
import { Input, Button, Tag, message, Modal, Image, Tooltip } from "antd";
import "./index.scss";
import Tables from "../../../../component/Table";
import { searchArticle } from "../../../../api";
import { getArticleList, deleteArticle } from "../../../../api";
import {
  DeleteOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MyNavlink from "../../../../component/MyNavlink";
import { withRouter } from "react-router-dom";

const ArticleMange = (props) => {
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
      title: "标题",
      width: 150,
      dataIndex: "title",
      align: "center",
      key: "title",
      ellipsis: {
        showTitle: false,
      },
      render: (title, obj) => {
        if (title.length > 13) {
          return (
            <>
              <Tooltip placement="topLeft" title={title}>
                <MyNavlink
                  children={title}
                  to={`/articledetail?id=${obj.id}`}
                />
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              <MyNavlink children={title} to={`/articledetail?id=${obj.id}`} />
            </>
          );
        }
      },
    },
    {
      title: "所属分类",
      dataIndex: "category",
      key: "category",
      align: "center",
      width: 150,
      render: (category) => (
        <>
          <Tag color={"blue"}>{category.name}</Tag>
        </>
      ),
    },
    {
      title: "缩略图",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      width: 150,
      render: (thumbnail) => (
        <>
          <Image width={80} src={thumbnail} />
        </>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status) => (
        <>
          {status ? (
            <Tag color={"green"}>已发布</Tag>
          ) : (
            <Tag color={"red"}>待审核</Tag>
          )}
        </>
      ),
    },
    {
      title: "发布时间",
      dataIndex: "pushTime",
      key: "pushTime",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
      render: (pushTime) => <>{pushTime ? pushTime.substring(0, 11) : "无"}</>,
    },
    {
      title: "评论数",
      dataIndex: "like",
      key: "like",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "点赞数",
      dataIndex: "like",
      key: "like",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "阅读数",
      dataIndex: "pageview",
      key: "pageview",
      width: 150,
      align: "center",
      ellipsis: {
        showTitle: false,
      },
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
            type="primary"
            shape="circle"
            icon={<FormOutlined />}
            onClick={() => toEdit(obj.id)}
          />
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
    articleList(1);
  }, []);

  /**
   * 函数区
   */
  //获取文章列表
  const articleList = async (page) => {
    setIsLoading(true);
    let result = await getArticleList({ limit, page, keyword });
    if (result.status_code === 200) {
      setData(result.data.data);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  };
  const changePage = (page) => {
    setCurrent(page);
    articleList(page);
  };
  //删除文章
  const handleDelete = async (id) => {
    confirm({
      title: "此操作将删除文章,删除将不可恢复,是否继续?",
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
      articleList();
    } else {
      message.error("删除失败");
    }
  };
  //跳转到编辑
  const toEdit = (id) => {
    props.history.push(`/admin/writing?id=${id}`);
  };
  //搜索
  const handleSearch = () => {
    articleList(1);
  };
  //获取关键词
  const handleGetKeywrod = (e) => {
    setKeyword(e.target.value);
  };
  //键盘事件
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      articleList(0);
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
          data={data}
          columns={columns}
          isLoading={isLoading}
          total={total}
          limit={limit}
          current={currrent}
          changePage={changePage}
        />
      </div>
    </>
  );
};

export default withRouter(ArticleMange);
