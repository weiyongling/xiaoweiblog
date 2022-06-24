import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import Tables from "../../../../component/Table";
import {
  getBlogrollList,
  getBlogrollCategory,
  addBlogroll,
  deleteBlogroll,
  updateBlogroll,
} from "../../../../api";
import { Option } from "antd/es/mentions";
const Blogroll = () => {
  /**
   * 变量区
   */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const { confirm } = Modal;
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 150,
      render: (name) => {
        if (name.length > 13) {
          return (
            <Tooltip placement="top" title={name}>
              {name}
            </Tooltip>
          );
        } else {
          return name;
        }
      },
    },
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      width: 150,
      render: (avatar) => (
        <>
          <Avatar src={avatar} />
        </>
      ),
    },
    {
      title: "描述",
      dataIndex: "site_description",
      key: "site_description",
      align: "center",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (site_description) => {
        if (site_description.length > 16) {
          return (
            <Tooltip placement="topLeft" title={site_description}>
              {site_description}
            </Tooltip>
          );
        } else {
          return site_description;
        }
      },
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      align: "center",
      width: 150,
      render: (category) => (
        <>
          <Tag color={"blue"}>{category.category_name}</Tag>
        </>
      ),
    },
    {
      title: "链接",
      dataIndex: "url",
      key: "1",
      align: "center",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (url) => {
        if (url.length > 16) {
          return (
            <Tooltip placement="topLeft" title={url}>
              <a href={url}>{url}</a>
            </Tooltip>
          );
        } else {
          return (
            <>
              <a href={url}>{url}</a>
            </>
          );
        }
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "1",
      align: "center",
      width: 150,
      render: (status) => (
        <>
          {status === 1 ? (
            <Tag color="green">展示中</Tag>
          ) : (
            <Tag color="red">已禁用</Tag>
          )}
        </>
      ),
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
            onClick={() => showModal(2, obj)}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ marginLeft: "1rem" }}
            onClick={() => handleDelete(obj.id)}
          />
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [type, setType] = useState(1);
  const [blogId, setBlogId] = useState("");
  const [total, setTotal] = useState(0);
  const [currrent, setCurrent] = useState(1);
  const [limit, setLimit] = useState(5);

  /**
   * ref区
   */
  const formRef = useRef();

  /**
   * useEffect区
   */
  useEffect(() => {
    getList(1);
    getCategoryList();
  }, []);

  /**
   * 函数区
   */
  //显示模态框
  const showModal = (type, value) => {
    setIsModalVisible(true);
    setType(type);
    if (value) {
      setTimeout(() => {
        setBlogId(value.id);
        formRef.current.setFieldsValue({
          name: value.name,
          status: value.status,
          avatar: value.avatar,
          site_description: value.site_description,
          url: value.url,
          c_id: value.category.id,
        });
      }, 10);
    }
  };
  //确定的回调
  const handleOk = () => {
    formRef.current.submit();
  };
  //取消的回调
  const handleCancel = () => {
    setIsModalVisible(false);
    formRef.current.resetFields();
  };
  //提交的回调
  const onFinish = (values) => {
    if (type === 1) {
      addBlog(values);
    } else {
      updateBlog(values);
    }
  };
  //更新链接
  const updateBlog = async (values) => {
    let result = await updateBlogroll(blogId, values);
    if (result.status_code === 200) {
      message.success("修改成功");
      handleCancel();
      getList();
    } else {
      message.error(result.msg);
    }
  };
  //删除分类
  const handleDelete = (id) => {
    confirm({
      title: "此操作将删除友情链接，是否继续?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeBlogRoll(id);
      },
      onCancel() {
        message.info("已取消");
      },
    });
  };
  //删除
  const removeBlogRoll = async (id) => {
    let result = await deleteBlogroll(id);
    if (result.status_code === 200) {
      message.success("删除成功!");
      getList();
    } else {
      message.error("删除失败!");
    }
  };
  //添加分类
  const addBlog = async (data) => {
    let result = await addBlogroll(data);
    if (result.status_code === 200) {
      handleCancel();
      message.success("添加成功!");
      getList();
    } else {
      message.error(result.msg);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  //获取友情链接列表
  const getList = async (page) => {
    setCurrent(page);
    setLoading(true);
    let result = await getBlogrollList({ page });
    if (result.status_code === 200) {
      setData(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("请求链接列表失败!");
    }
    setLoading(false);
  };
  const changePage = (page) => {
    setCurrent(page);
    getList(page);
  };
  //获取友情链接的分类
  const getCategoryList = async () => {
    let result = await getBlogrollCategory({ status: 1 });
    if (result.status_code === 200) {
      setCategoryList(result.data.data);
    } else {
      message.error("获取分类失败");
    }
  };
  return (
    <div id="Blogroll">
      <Button
        type="primary"
        style={{ marginBottom: "15px" }}
        onClick={() => showModal(1)}
      >
        添加友情链接
      </Button>
      <Tables
        columns={columns}
        data={data}
        isLoading={loading}
        limit={limit}
        current={currrent}
        total={total}
        changePage={changePage}
      />
      <Modal
        title={type === 1 ? "添加友情链接" : "修改友情链接"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={type === 1 ? "添加" : "修改"}
        centered
      >
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          scrollToFirstError={true}
          labelCol={{ span: 3, offset: 3 }}
          ref={formRef}
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请填写用户名" />
          </Form.Item>
          <Form.Item
            label="url"
            name="url"
            rules={[{ required: true, message: "请输入链接" }]}
          >
            <Input placeholder="请输入url" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="site_description"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            label="分类:"
            name="c_id"
            rules={[{ required: true, message: "请选择分类" }]}
          >
            <Select placeholder="请选择分类" allowClear>
              {categoryList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.category_name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="头像"
            name="avatar"
            rules={[{ required: true, message: "请输入头像地址" }]}
          >
            <Input placeholder="请输入头像地址" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select placeholder="请选择状态" allowClear>
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={1}>展示</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Blogroll;
