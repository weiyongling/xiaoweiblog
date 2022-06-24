import React, { useEffect, useState } from "react";
import Tables from "../../../../component/Table";
import { Input, Button, Tag, message, Modal, Tooltip } from "antd";
import { withRouter } from "react-router-dom";
import {
  ToTopOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getArticleList, updateStatus } from "../../../../api";
import MyNavlink from "../../../../component/MyNavlink";
import "./index.scss";

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
            icon={<ToTopOutlined />}
            style={{ marginLeft: "1rem" }}
            onClick={() => handleChangeStatus(obj.id)}
          />
        </>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = Modal;
  const [total, setTotal] = useState(0);
  const [currrent, setCurrent] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
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
    setCurrent(page);
    let result = await getArticleList({
      status: 0,
      page,
      keyword,
    });
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
  //修改文章的状态
  const handleChangeStatus = (id) => {
    confirm({
      title: "此操作将发布文章，是否继续?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        updateRequest({ id, status: 1 });
      },
      onCancel() {
        message.info("已取消");
      },
    });
  };
  //执行修改的请求
  const updateRequest = async (data) => {
    let result = await updateStatus(data);
    if (result.status_code === 200) {
      message.success("发布成功");
      articleList();
    } else {
      message.error("发布失败");
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
          limit={limit}
          current={currrent}
          total={total}
          changePage={changePage}
        />
      </div>
    </>
  );
};

export default withRouter(ArticleMange);
