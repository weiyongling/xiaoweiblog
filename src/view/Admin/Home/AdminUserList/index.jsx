import React, { useEffect, useState } from "react";
import { UserList, delUser } from "../../../../api";
import "./index.scss";
import { Avatar, Button, Image, Input, message, Tag, Tooltip } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import Tables from "../../../../component/Table";
const AdminUserList = (props) => {
  /**
   * 变量区
   */
  const [currrent, setCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "1",
      align: "center",
      width: 80,
    },
    {
      title: "昵称",
      dataIndex: "name",
      key: "1",
      align: "center",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => {
        if (name.length > 10) {
          return (
            <>
              <Tooltip placement="top" title={name}>
                {name}
              </Tooltip>
            </>
          );
        } else {
          return <span>{name}</span>;
        }
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "1",
      align: "center",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => {
        if (email.length > 10) {
          return (
            <>
              <Tooltip placement="top" title={email}>
                {email}
              </Tooltip>
            </>
          );
        } else {
          return <span>{email}</span>;
        }
      },
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "1",
      align: "center",
      width: 100,
      render: (avatar) => (
        <>
          <Image width={50} src={avatar} />
        </>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "1",
      align: "center",
      width: 100,
      render: (status) => (
        <>
          {status === 1 ? (
            <Tag color="green">正常</Tag>
          ) : (
            <Tag color="red">已禁用</Tag>
          )}
        </>
      ),
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      key: "1",
      align: "center",
      width: 100,
      render: (created_at) => {
        return created_at.substring(0, 10);
      },
    },
    {
      title: "操作",
      align: "center",
      width: 150,
      fixed: "right",
      render: (obj) => (
        <div>
          <Button
            type="primary"
            shape="circle"
            icon={<FormOutlined />}
            onClick={() => update(obj.id)}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ marginLeft: "1rem" }}
            onClick={() => remove(obj.id)}
          />
        </div>
      ),
    },
  ];
  const [keyword, setKeyword] = useState("");

  /**
   * useEffect区
   */
  useEffect(() => {
    getList(1);
  }, []);

  /**
   * 函数区
   */
  const remove = async (id) => {
    let result = await delUser(id);
    if (result.status_code === 200) {
      message.success("删除成功！");
      getList(1);
    } else {
      message.error("删除失败！");
    }
  };
  const update = (id) => {
    props.history.push(`/admin/adduser?id=${id}`);
  };
  const getList = async (page) => {
    setIsLoading(true);
    setCurrent(page);
    let result = await UserList({ page, keyword });
    console.log(result);
    if (result.status_code === 200) {
      setData(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("获取列表失败!");
    }
    setIsLoading(false);
  };
  const changePage = (page) => {
    getList(page);
  };
  const handleGetKeywrod = (e) => {
    setKeyword(e.target.value);
  };
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      getList();
    }
  };
  const handleSearch = () => {
    getList();
  };
  return (
    <div>
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
        total={total}
        limit={limit}
        current={currrent}
        changePage={changePage}
      />
    </div>
  );
};

export default AdminUserList;
