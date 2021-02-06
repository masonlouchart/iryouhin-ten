import { Spin } from "antd";
import React, { ReactElement } from "react";

const Loading = (): ReactElement => {
  return (
    <div className="spinner">
      <style jsx>{`
        margin: 20px 0;
        margin-bottom: 20px;
        padding: 30px 50px;
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      `}</style>
      <Spin tip="Loading..." />
    </div>
  );
};

export default Loading;
