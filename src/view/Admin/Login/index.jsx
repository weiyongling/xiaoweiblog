import React from "react";
import Particles from "react-tsparticles";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { loadFull } from "tsparticles";
import "./index.scss";
import { login } from "../../../api";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserInfo } from "../../../store/User/actioncreators";
const Login = (props) => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };
  const onFinish = async (values) => {
    let result = await login(values);
    console.log(result);
    if (result.status_code === 200) {
      props.updateUser({
        userInfo: result.userInfo,
        token: result.token,
      });
      localStorage.setItem("TOKEN", result.token);
      if (result.userInfo.role_id === 1) {
        message.success("登录成功!");
        props.history.push("/admin");
      } else {
        message.error("权限不足,请联系管理员!");
        props.history.push("/");
      }
    } else {
      message.error("邮箱或密码错误");
    }
  };
  return (
    <div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0d47a1",
            },
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
          },
          fullScreen: {
            zIndex: 1,
          },
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
                parallax: {
                  enable: true,
                  force: 60,
                },
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
                divs: {
                  distance: 200,
                  duration: 0.4,
                  mix: false,
                  selectors: [],
                },
              },
              grab: {
                distance: 400,
              },
              repulse: {
                divs: {
                  distance: 200,
                  duration: 0.4,
                  factor: 100,
                  speed: 1,
                  maxSpeed: 50,
                  easing: "ease-out-quad",
                  selectors: [],
                },
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: {
                value: "#ffffff",
              },
              distance: 150,
              enable: true,
              opacity: 0.4,
            },
            move: {
              attract: {
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              enable: true,
              outModes: {
                bottom: "out",
                left: "out",
                right: "out",
                top: "out",
              },
            },
            number: {
              density: {
                enable: true,
              },
            },
            opacity: {
              random: {
                enable: true,
              },
              value: {
                min: 0.1,
                max: 0.5,
              },
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 0.1,
              },
            },
            size: {
              random: {
                enable: true,
              },
              value: {
                min: 0.1,
                max: 10,
              },
              animation: {
                enable: true,
                speed: 20,
                minimumValue: 0.1,
              },
            },
          },
        }}
      />
      <div className="admin_login">
        <div className="admin_login_region">
          <div className="title">小魏博客后台管理系统</div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default connect(
  () => ({}),
  //映射actions的方法
  {
    updateUser: updateUserInfo,
  }
)(withRouter(Login));
