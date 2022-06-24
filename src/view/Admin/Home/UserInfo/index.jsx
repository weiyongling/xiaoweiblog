import React, { Fragment, useEffect, useState } from "react";
import { Upload, message, Avatar, Tag, Input, Modal, Button } from "antd";
import "./index.scss";
import { connect } from "react-redux";
import { updateUser, getUserInfo, updatePassowrd } from "../../../../api";
import { updateUserInfo } from "../../../../store/User/actioncreators";
import { updateModel } from "../../../../store/login/actioncreators";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const { confirm } = Modal;

const UserInfo = (props) => {
  /**
   * 变量区
   */
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(props.userInfo.name);
  const [status, setStatus] = useState(["success", "success", "success"]);
  const [passwordData, setPasswordData] = useState({
    new_password_confirmation: "",
    password: "",
    new_password: "",
  });

  /**
   * useEffect区
   */
  useEffect(() => {
    //判断是否有token，如果没有token就回到首页
    if (!props.token) {
      message.warning("请先登录!");
      props.history.push("/admin/login");
    }
  }, [props.token]);

  /**
   * 函数区
   */
  //上传文件成功时的回调
  const handleChange = (info) => {
    if (info.file.status === "done") {
      if (info.file.response.status_code === 200) {
        updateusers({
          avatar: info.file.response.data.src,
        });
      } else {
        message.error("上传失败!");
      }
    }
  };
  //修改用户信息
  const updateusers = async (data) => {
    let result = await updateUser(data);
    if (result.status_code === 200) {
      message.success("修改成功!");
      getusers();
    } else {
      message.error("修改失败!");
    }
  };
  //获取用户信息
  const getusers = async () => {
    let result = await getUserInfo();
    if (result?.status_code === 200) {
      props.updateUser({
        userInfo: result.data,
      });
    } else {
      message.warning("请先登录!");
    }
  };
  //上传的按钮
  const uploadButton = (
    <Fragment>
      <Avatar src={props.userInfo.avatar} />
    </Fragment>
  );
  //修改用户名的切换
  const handleChangeEdit = (e) => {
    e.preventDefault();
    if (isEdit) {
      confirm({
        title: "此操作将修改昵称,是否要继续?",
        icon: <ExclamationCircleOutlined />,
        content: "",
        onOk() {
          updateusers({
            name,
          });
          setIsEdit(!isEdit);
        },
        onCancel() {
          message.info("已取消");
        },
      });
    } else {
      setIsEdit(!isEdit);
    }
  };
  //动态获取用户输入的用户名
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  //动态获取修改密码的数据
  const handleChangePassword = (e) => {
    let id = e.target.id;
    let value = e.target.value;
    setPasswordData((state) => ({ ...state, [id]: value }));
  };
  //修改状态的函数
  const handleUpdateStatus = (index, msg, type = "error") => {
    msg && message.error(msg);
    setStatus((state) => {
      state[index] = type;
      return [...state];
    });
  };
  //失去焦点时更新状态
  const handleBlueStatus = (e) => {
    let id = e.target.id;
    let value = e.target.value;
    let status = "success";
    if (!value.trim()) {
      status = "error";
    }
    switch (id) {
      case "password":
        handleUpdateStatus(0, null, status);
        break;
      case "new_password":
        handleUpdateStatus(1, null, status);
        break;
      case "new_password_confirmation":
        handleUpdateStatus(2, null, status);
        break;
      default:
        break;
    }
  };
  //修改密码
  const handleUpdatePassword = async () => {
    console.log(passwordData);
    if (!passwordData.password.trim()) {
      handleUpdateStatus(0, "原密码不能为空");
      return;
    }
    if (!passwordData.new_password.trim()) {
      handleUpdateStatus(1, "新密码不能为空");
      return;
    }
    if (!passwordData.new_password_confirmation.trim()) {
      handleUpdateStatus(2, "确认密码不能为空");
      return;
    }
    if (passwordData.new_password_confirmation !== passwordData.new_password) {
      handleUpdateStatus(2, "两次输入的密码不一致!");
      return;
    }
    let result = await updatePassowrd(passwordData);
    if (result.status_code === 200) {
      message.warning("请重新登录!");
      props.history.push("/home");
      props.updateUser({ userInfo: {}, token: "" });
      localStorage.setItem("TOKEN", "");
      props.updateModel({ isShow: true });
      setTimeout(() => {
        props.updateModel({ type: 0, actionFlag: true });
      }, 10);
    } else {
      message.error("修改失败!");
    }
  };
  return (
    <div id="UserInfo">
      <div className="item">
        <Upload
          name="file"
          showUploadList={false}
          action="http://localhost:8001/api/upload"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          headers={{
            Authorization: `Bearer ${props.token}`,
          }}
        >
          {props.userInfo.avatar ? (
            <Avatar src={props.userInfo.avatar} />
          ) : (
            uploadButton
          )}
        </Upload>
        <span className="desc">点击头像即可修改</span>
      </div>
      <div className="item">
        <div className="label">昵称：</div>
        {isEdit ? (
          <Input value={name} onChange={handleChangeName} />
        ) : (
          <span>{props.userInfo.name}</span>
        )}

        <a
          href="src/view/Admin/Home/UserInfo/index#!"
          className="edit"
          onClick={handleChangeEdit}
        >
          {isEdit ? "保存" : "修改"}
        </a>
      </div>
      <div className="item">
        <div className="label">邮箱：</div>
        <span>{props.userInfo.email}</span>
      </div>
      <div className="item">
        <div className="label">用户身份：</div>
        <span>
          <Tag color={"yellow"}>{props.userInfo?.role?.name}</Tag>
        </span>
      </div>
      <div className="item">
        <div className="label">诞生日期：</div>
        <span>{props.userInfo.created_at?.substring(0, 10)}</span>
      </div>
      <div className="item">
        <div className="label">原密码：</div>
        <span>
          <Input.Password
            onChange={handleChangePassword}
            placeholder="请输入原密码"
            status={status[0]}
            id="password"
            onBlur={handleBlueStatus}
          />
        </span>
      </div>
      <div className="item">
        <div className="label">新密码：</div>
        <span>
          <Input.Password
            onChange={handleChangePassword}
            placeholder="请输入新密码"
            status={status[1]}
            id="new_password"
            onBlur={handleBlueStatus}
          />
        </span>
      </div>
      <div className="item">
        <div className="label">确认密码：</div>
        <span>
          <Input.Password
            onChange={handleChangePassword}
            placeholder="请输入确认密码"
            status={status[2]}
            id="new_password_confirmation"
            onBlur={handleBlueStatus}
          />
        </span>
      </div>
      <div className="item">
        <div className="label"></div>
        <span>
          <Button type="primary" onClick={handleUpdatePassword}>
            修改密码
          </Button>
        </span>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    userInfo: state.user.userInfo,
    token: state.user.token,
  }),
  {
    updateUser: updateUserInfo,
    updateModel: updateModel,
  }
)(UserInfo);
