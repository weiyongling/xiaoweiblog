import React, { useEffect, useRef, useState } from "react";
import Editor from "md-editor-rt";
import qs from "query-string";
import axios from "axios";
import {
  Input,
  Select,
  Button,
  Form,
  Upload,
  message,
  PageHeader,
  Steps,
} from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  pushArticle,
  getCategoryList,
  getArticleDetail,
  updateArticle,
} from "../../../../api";
import "md-editor-rt/lib/style.css";
import "./index.scss";
import { PlusOutlined } from "@ant-design/icons";
const { Step } = Steps;

const { Option } = Select;
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
const Writing = (props) => {
  /**
   * 变量区
   */
  const [content, setContent] = useState("");
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [imageUrl, setImageUrl] = useState();
  const [current, setCurrent] = useState(0);
  const [dataFrom, setDataFrom] = useState({});
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
   * ref区
   */
  const formRef = useRef();

  /**
   * useEffet区
   */
  //当组件挂载时
  useEffect(() => {
    getCategory();
    let params = qs.parse(props.location.search);
    if (JSON.stringify(params) !== "{}") {
      getDetail(params.id);
    }
  }, []);

  /**
   * 函数区
   */
  //获取分类
  const getCategory = async () => {
    let result = await getCategoryList();
    if ((result.status_code = 200)) {
      setCategoryList(result.data.data.filter((item) => item.status));
    } else {
      message.error("获取分类失败!");
    }
  };
  const handleChange2 = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(info.file.response.data.src);
      });
    }
  };
  //发布
  const push = async (status) => {
    if (status === 2) {
      let obj = {
        ...dataFrom,
        content,
        thumbnail: imageUrl,
        status: info.status,
      };
      let result = await updateArticle(info.id, obj);
      if (result.status_code === 200) {
        message.success("修改成功!");
        props.history.push("/admin/articlemange");
      } else {
        message.error("修改失败!");
      }
    } else {
      let obj = { ...dataFrom, content, thumbnail: imageUrl, status };
      let result = await pushArticle(obj);
      if (result.status_code === 200) {
        status === 0
          ? message.success("保存成功!")
          : message.success("发布成功!");
        props.history.push("/admin/articlemange");
      } else {
        status === 0
          ? message.success("保存失败!")
          : message.success("发布失败!");
      }
    }
  };
  //上传图片
  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append("file", file);
          axios
            .post("/api/upload", form, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${props.token}`,
              },
            })
            .then((res) => {
              console.log(res.data.data.src);
              rev(res.data);
            })
            .catch((error) => rej(error));
        });
      })
    );

    callback(res.map((item) => item.data.src));
  };
  //当修改时调取文章的详情
  const getDetail = async (id) => {
    let result = await getArticleDetail({ id });
    if (result.status_code === 200) {
      setInfo(result.data);
      setContent(result.data.content);
      formRef.current.setFieldsValue({
        title: result.data.title,
        c_id: result.data.c_id,
      });
      setImageUrl(result.data.thumbnail);
    } else {
      message.error("请求文章详情失败");
    }
  };
  // 下一步
  const handleNext = () => {
    if (current === 0) {
      formRef.current
        .validateFields()
        .then((res) => {
          setDataFrom(res);
          if (!res.title?.trim()) return message.error("标题不能为空");
          if (!res.c_id) return message.error("分类不能为空");
          if (!imageUrl) {
            return message.error("请设置缩略图!");
          }
          setCurrent(current + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (content.trim()) {
        setCurrent(current + 1);
      } else {
        return message.error("文章内容不能为空!");
      }
    }
  };
  // 上一步
  const handleLastStep = () => {
    setCurrent(current - 1);
  };

  return (
    <div id="Writing">
      <PageHeader
        className="site-page-header"
        title="撰写文章"
        subTitle="write an article"
      />
      <Steps current={current}>
        <Step title="基本信息" description="标题,分类,特色图片" />
        <Step title="文章内容" description="文章的主体内容" />
        <Step title="文章的提交" description="保存草稿或发布文章" />
      </Steps>
      <div
        className={current === 0 ? "" : "hidden"}
        style={{ marginTop: "10px" }}
      >
        <Form layout={"horizontal"} form={form} ref={formRef}>
          <Form.Item label="标题:" name="title">
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="分类:" name="c_id">
            <Select placeholder="请选择分类" allowClear>
              {categoryList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="缩略图:">
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="http://localhost:8001/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange2}
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
        </Form>
      </div>
      <div className={current === 1 ? "" : "hidden"}>
        <Editor
          modelValue={content}
          onChange={(modelValue) => {
            setContent(modelValue);
          }}
          onUploadImg={onUploadImg}
        />
      </div>
      <div className={current === 2 ? "" : "hidden"}></div>
      <div className="arrow-region" style={{ marginTop: "30px" }}>
        {current > 0 ? <Button onClick={handleLastStep}>上一步</Button> : ""}
        {current > 1 &&
          (JSON.stringify(info) !== "{}" ? (
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => push(2)}
              style={{ marginLeft: "10px" }}
            >
              修改
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => push(0)}
                style={{ marginLeft: "10px" }}
              >
                保存草稿箱
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                danger
                onClick={() => push(1)}
              >
                发布
              </Button>
            </>
          ))}
        {current < 2 ? (
          <Button
            type="primary"
            onClick={handleNext}
            style={{ marginLeft: "10px" }}
          >
            下一步
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default connect((state) => ({
  token: state.user.token,
}))(withRouter(Writing));
