import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, Form, Input, message, Modal, Select, Tag } from "antd";
import Tables from "../../../../component/Table";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import {
  getBlogrollCategory,
  addUrlCategory,
  deleteUrlCategory,
  updateUrlCategory,
} from "../../../../api";

const UrlCategory = () => {
  /**
   * 变量区
   */
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [currrent, setCurrent] = useState(1);
  const [limit, setLimit] = useState(5);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
    },
    {
      title: "分类名称",
      dataIndex: "category_name",
      key: "category_name",
      align: "center",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
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
            onClick={() => showModal(1, obj)}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            style={{ marginLeft: "1rem" }}
            onClick={() => isRemove(obj.id)}
          />
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { confirm } = Modal;
  const [type, setType] = useState(0); //0代表添加，1代表修改
  const [categoryId, setCategoryId] = useState("");
  /**
   * ref区
   */
  const formRef = useRef();

  /**
   * useEffect区
   */
  useEffect(() => {
    getCategories();
  }, []);

  /**
   * 函数区
   */
  //提交函数
  const onFinish = async (values) => {
    if (type) {
      let result = await updateUrlCategory(categoryId, values);
      if (result.status_code === 200) {
        message.success("修改成功");
        formRef.current.resetFields();
        setIsModalVisible(false);
        getCategories();
      } else {
        message.error(result.message);
      }
    } else {
      let result = await addUrlCategory(values);
      if (result.status_code === 200) {
        message.success("添加成功");
        formRef.current.resetFields();
        setIsModalVisible(false);
        getCategories();
      } else {
        message.error(result.message);
      }
    }
  };
  //打开模态框
  const showModal = (type, value) => {
    setIsModalVisible(true);
    setType(type);
    if (value) {
      setTimeout(() => {
        setCategoryId(value.id);
        formRef.current.setFieldsValue({
          category_name: value.category_name,
          status: value.status,
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
    formRef.current.resetFields();
    setIsModalVisible(false);
  };

  //获取分类列表
  const getCategories = async (page) => {
    setIsLoading(true);
    setCurrent(page);
    let result = await getBlogrollCategory({ page });
    if (result.status_code === 200) {
      setData(result.data.data);
      setTotal(result.data.total);
    } else {
      message.error("请求分类列表失败");
    }
    setIsLoading(false);
  };
  const changePage = (page) => {
    setCurrent(page);
    getCategories(page);
  };
  //删除分类
  const removeCategory = async (id) => {
    let result = await deleteUrlCategory(id);
    if (result.status_code === 200) {
      message.success("删除成功");
      getCategories();
    } else {
      message.error("删除失败!");
    }
  };
  //判断是否删除分类
  const isRemove = (id) => {
    confirm({
      title: "此操作将删除分类，是否继续?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        removeCategory(id);
      },
      onCancel() {
        message.info("已取消");
      },
    });
  };
  return (
    <div id="urlCategory">
      <Button
        type="primary"
        style={{ marginBottom: "15px" }}
        onClick={() => showModal(0)}
      >
        添加分类
      </Button>
      <Tables
        columns={columns}
        data={data}
        isLoading={isLoading}
        total={total}
        limit={limit}
        current={currrent}
        changePage={changePage}
      />
      <Modal
        title={type ? "修改分类" : "添加分类"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={type ? "修改" : "添加"}
        centered
      >
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          scrollToFirstError={true}
          labelCol={{ span: 4, offset: 3 }}
          ref={formRef}
        >
          <Form.Item
            label="分类名称"
            name="category_name"
            rules={[{ required: true, message: "请填写分类!" }]}
          >
            <Input placeholder="请填写分类名称" />
          </Form.Item>
          <Form.Item
            label="状态:"
            name="status"
            rules={[{ required: true, message: "请选择状态!" }]}
          >
            <Select placeholder="请选择状态" allowClear>
              <Option value={0}>禁用</Option>
              <Option value={1}>正常</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UrlCategory;
