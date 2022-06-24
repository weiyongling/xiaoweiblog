import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import "./index.scss";
import AdminHeader from "../../../component/Admin/AdminHeader";
import AdminSide from "../../../component/Admin/AdminSide";
import AdminRouter from "../../../router/AdminRouer";
const { Content } = Layout;
const Home = (props) => {
  const [isShow, setIshow] = useState(false);
  useEffect(() => {
    setIshow(false);
  }, [props]);
  const changIsShow = () => {
    setIshow(!isShow);
  };
  return (
    <>
      <AdminHeader isShow={isShow} changIsShow={changIsShow} />
      <Layout>
        <AdminSide isShow={isShow} />
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <AdminRouter />
          </Content>
        </Layout>
      </Layout>
      {isShow && <div className="admin_zzc" onClick={changIsShow}></div>}
    </>
  );
};

export default Home;
