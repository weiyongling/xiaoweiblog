import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, message, Tabs } from "antd";
import Captcha from "react-captcha-code";
import "./index.scss";
import { connect } from "react-redux";
import { updateModel } from "../../store/login/actioncreators";
import { updateUserInfo } from "../../store/User/actioncreators";
import { login, register, toCaptcha } from "../../api/index";
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Login = (props) => {
  const [captcha, setcaptch] = useState("");
  const [sign, setSign] = useState("success");
  const [flag, setFlag] = useState(false);
  const [help, setHelp] = useState("");
  const [isClear, setIsclear] = useState(false);
  const zzcRef = useRef();
  const modelRef = useRef();
  const emailRef = useRef();
  //获取验证码的这个元素
  const captchaRef = useRef();
  //获取发送验证码按钮的元素
  const btnRef = useRef();
  useEffect(() => {
    let actionFlag = props.store.actionFlag;
    if (actionFlag) {
      zzcRef.current.style.opacity = 1;
      modelRef.current.style.height = "90%";
    } else {
      zzcRef.current.style.opacity = 0;
      modelRef.current.style.height = "0%";
    }
  }, [props.store.actionFlag]);
  const logins = async (values) => {
    if (values.captcha !== captcha) {
      setSign("error");
      setHelp("验证码错误");
      handleClick();
    } else {
      let result = await login(values);
      if (result.status_code === 200) {
        props.updateUserInfo({
          userInfo: result.userInfo,
          token: result.token,
        });
        localStorage.setItem("TOKEN", result.token);
        message.success("登录成功!");
        handleClose();
      } else {
        message.error("邮箱或密码错误");
        handleClick();
      }
      setSign("success");
      setHelp("");
    }
  };
  const registers = async (values) => {
    let result = await register(values);
    if (result?.status_code === 200) {
      message.success("注册成功!");
      props.updateModel({ type: 0 });
    } else {
      for (let i in result.errors) {
        message.error(result.errors[i][0]);
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [form] = Form.useForm();

  const handleChange = useCallback((captcha) => {
    setcaptch(captcha);
  }, []);

  //刷新验证码
  const handleClick = () => {
    // 刷新验证码
    captchaRef.current.refresh();
  };
  //关闭登录和注册的模态框
  const handleClose = () => {
    props.updateModel({ actionFlag: false });
    setTimeout(() => {
      props.updateModel({ isShow: false, type: 1 });
    }, 1010);
  };
  //发送验证码
  const handleGetCaptcha = async (evnet) => {
    let result = await toCaptcha({ email: emailRef.current.input.value });
    if (result?.status_code === 200) {
      message.success("发送验证码成功");
      setTimeout(() => {
        setFlag(true);
      }, 0);
      let time = 60;
      let timers = setInterval(() => {
        time--;
        if (btnRef.current) {
          btnRef.current.children[0].innerHTML = `${time}秒后，重新获取验证码`;
        } else {
          setFlag(false);
          clearInterval(timers);
        }

        if (time === 0) {
          btnRef.current.children[0].innerHTML = "获取验证码";
          setFlag(false);
          clearInterval(timers);
        }
        setIsclear(true);
      }, 1000);
    } else {
      message.error("发送验证码失败!");
    }
  };
  //tab选项卡的回调
  const callback = (key) => {
    props.updateModel({ type: key });
  };
  return (
    <div id="Login">
      <div className="zzc" onClick={handleClose} ref={zzcRef}></div>
      <div className="Login-region" ref={modelRef}>
        <div className="login">
          <div className="left">
            <div className="left_title">xiaowei & blog</div>
            <Tabs
              defaultActiveKey={props.store.type}
              onChange={callback}
              activeKey={`${props.store.type}`}
              centered
              destroyInactiveTabPane
            >
              <TabPane tab="登录" key="0">
                <div className="login_region">
                  <Form
                    name="basic"
                    className="login-form"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={logins}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="邮箱"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "请输入邮箱!",
                        },
                        {
                          type: "email",
                          message: "邮箱格式错误!",
                        },
                      ]}
                    >
                      <Input placeholder="email" />
                    </Form.Item>

                    <Form.Item
                      label="密码"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "请输入密码",
                        },
                      ]}
                    >
                      <Input.Password placeholder="password" />
                    </Form.Item>
                    <Form.Item label="验证码">
                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name="captcha"
                            validateStatus={sign}
                            help={help}
                            rules={[
                              {
                                required: true,
                                message: "请输入验证码",
                              },
                            ]}
                          >
                            <Input placeholder="captcha" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Captcha
                            ref={captchaRef}
                            charNum={6}
                            height={31}
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item
                      wrapperCol={{
                        offset: 8,
                        span: 16,
                      }}
                    >
                      <Button type="primary" htmlType="submit">
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </TabPane>
              <TabPane tab="注册" key="1">
                <div className="register_region">
                  <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={registers}
                    initialValues={{
                      residence: ["zhejiang", "hangzhou", "xihu"],
                      prefix: "86",
                    }}
                    className="register"
                    scrollToFirstError
                  >
                    <Form.Item
                      label="用户名"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "请输入用户名!",
                        },
                      ]}
                    >
                      <Input placeholder="username" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "请输入邮箱！",
                        },
                      ]}
                    >
                      <Input ref={emailRef} />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="密码"
                      rules={[
                        {
                          required: true,
                          message: "请输入密码",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      name="password_confirmation"
                      label="确认密码"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "请输入确认密码！",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              new Error("两次输入的密码不正确!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item label="邮箱验证码">
                      <Row gutter={12}>
                        <Col span={12}>
                          <Form.Item
                            name="captcha"
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: "请输入邮箱验证码",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Button
                            disabled={flag}
                            onClick={handleGetCaptcha}
                            ref={btnRef}
                          >
                            获取验证码
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(new Error("必须要同意协议")),
                        },
                      ]}
                      {...tailFormItemLayout}
                    >
                      <Checkbox>
                        我同意 <a href="">《协议》</a>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">
                        注册
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </TabPane>
            </Tabs>
            {/*{props.store.type === 0 ? (
              <div className="login_region">
                <div className="login_title">登录</div>
                <Form
                  name="basic"
                  className="login-form"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={logins}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "请输入邮箱!",
                      },
                      {
                        type: "email",
                        message: "邮箱格式错误!",
                      },
                    ]}
                  >
                    <Input placeholder="email" />
                  </Form.Item>

                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "请输入密码",
                      },
                    ]}
                  >
                    <Input.Password placeholder="password" />
                  </Form.Item>
                  <Form.Item label="验证码">
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item
                          name="captcha"
                          validateStatus={sign}
                          help={help}
                          rules={[
                            {
                              required: true,
                              message: "请输入验证码",
                            },
                          ]}
                        >
                          <Input placeholder="captcha" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Captcha
                          ref={captchaRef}
                          charNum={6}
                          height={31}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <div className="register_region">
                <div className="register_title">注册</div>
                <Form
                  {...formItemLayout}
                  form={form}
                  name="register"
                  onFinish={register}
                  initialValues={{
                    residence: ["zhejiang", "hangzhou", "xihu"],
                    prefix: "86",
                  }}
                  className="register"
                  scrollToFirstError
                >
                  <Form.Item
                    label="用户名"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "请输入用户名!",
                      },
                    ]}
                  >
                    <Input placeholder="username" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "请输入邮箱！",
                      },
                    ]}
                  >
                    <Input ref={emailRef} />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                      {
                        required: true,
                        message: "请输入密码",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="password_confirmation"
                    label="确认密码"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "请输入确认密码！",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("两次输入的密码不正确!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="邮箱验证码">
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item
                          name="captcha"
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "请输入邮箱验证码",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Button
                          disabled={flag}
                          onClick={handleGetCaptcha}
                          ref={btnRef}
                        >
                          获取验证码
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error("必须要同意协议")),
                      },
                    ]}
                    {...tailFormItemLayout}
                  >
                    <Checkbox>
                      我同意 <a href="">《协议》</a>
                    </Checkbox>
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}*/}
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(
  //映射仓库数据
  (state) => ({ store: state.loginInfo }),
  //映射方法
  {
    updateModel: updateModel,
    updateUserInfo: updateUserInfo,
  }
)(Login);
