import React from "react";
import { Table } from "antd";
import "./index.scss";
const Tables = (props) => {
  return (
    <Table
      columns={props.columns}
      dataSource={props.data}
      scroll={{ y: "250px", x: "100%" }}
      rowKey={(item) => item.id}
      loading={props.isLoading}
      pagination={{
        current: props.current,
        total: props.total,
        defaultPageSize: props.limit,
      }}
      onChange={(page, pagesize) => props.changePage(page.current)}
    />
  );
};

export default Tables;
