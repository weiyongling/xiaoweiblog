import "./App.css";
import Layout from "./component/Basic/Layout";
import "animate.css";
import { BackTop } from "antd";
import { UpOutlined } from "@ant-design/icons";
function App() {
  return (
    <div className="App">
      <BackTop>
        <div className={"top"}>
          <UpOutlined />
        </div>
      </BackTop>
      <Layout />
    </div>
  );
}

export default App;
