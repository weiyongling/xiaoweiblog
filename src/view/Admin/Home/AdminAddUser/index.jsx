import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message, Upload, PageHeader } from "antd";
import "./index.scss";
import { Option } from "antd/es/mentions";
import { addUsers, UserInfo, editUserInfo } from "../../../../api";
import qs from "query-string";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

const AdminAddUser = (props) => {
  /**
   * 变量区
   */
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const [imageUrl, setImageUrl] = useState();
  const id = qs.parse(props.location.search).id;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      ></div>
    </div>
  );

  /**
   * useEffect区
   */
  useEffect(() => {
    if (id) {
      getUserInfo(id);
    }
  }, []);

  /**
   * ref区
   */
  const formRef = useRef();

  /**
   * 函数区
   */
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(info.file.response.data.src);
      });
    }
  };

  const getUserInfo = async (id) => {
    let result = await UserInfo(id);
    if (result.status_code === 200) {
      formRef.current.setFieldsValue({
        email: result.data.email,
        status: result.data.status,
        role_id: result.data.role_id,
        name: result.data.name,
      });
      setImageUrl(result.data.avatar);
    } else {
      message.error("获取信息失败");
    }
  };

  const onFinish = async (values) => {
    if (!imageUrl) {
      return message.error("请上传头像!");
    }
    const data = { ...values, avatar: imageUrl, id };
    if (id) {
      let result = await editUserInfo(data);
      if (result.status_code === 200) {
        message.success("修改成功");
        props.history.push("/admin/userlist");
      } else {
        message.error(result.msg ? result.msg : "修改失败!");
      }
    } else {
      let result = await addUsers(data);
      if (result.status_code === 200) {
        message.success("添加成功");
        props.history.push("/admin/userlist");
      } else {
        message.error(result.msg ? result.msg : "添加失败!");
      }
    }
  };
  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };
  return (
    <div className={"addUser"}>
      <PageHeader
        className="site-page-header"
        title="添加用户"
        subTitle="add users"
      />
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          requiredMarkValue: requiredMark,
        }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={onFinish}
        ref={formRef}
      >
        <Form.Item
          label="用户名:"
          rules={[{ required: true, message: "请输入用户名!" }]}
          name="name"
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="邮箱:"
          name="email"
          rules={[
            {
              required: true,
              message: "请输入邮箱",
            },
            {
              pattern:
                /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,

              message: "邮箱格式不正确",
            },

            {
              max: 50,

              message: "邮箱不得超过50字符",
            },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="密码:"
          rules={[{ required: true, message: "请输入密码!" }]}
          name="password"
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="确认密码:"
          rules={[
            {
              required: true,
              message: "请输入确认密码!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不正确!"));
              },
            }),
          ]}
          name="password_confirmation"
        >
          <Input.Password placeholder="请输入确认密码" />
        </Form.Item>
        <Form.Item
          label="用户身份:"
          name="role_id"
          rules={[{ required: true, message: "请选择用户身份!" }]}
        >
          <Select placeholder="请选择用户身份" allowClear>
            <Option value={1}>超级管理员</Option>
            <Option value={2}>普通用户</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="状态:"
          name="status"
          rules={[{ required: true, message: "请选择状态!" }]}
        >
          <Select placeholder="请选择状态" allowClear>
            <Option value={0}>拉黑</Option>
            <Option value={1}>正常</Option>
          </Select>
        </Form.Item>
        <Form.Item label="头像:">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://localhost:8001/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            headers={{
              Authorization: `Bearer ${props.token}`,
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "修改" : "添加"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect((state) => ({
  token: state.user.token,
}))(withRouter(AdminAddUser));
