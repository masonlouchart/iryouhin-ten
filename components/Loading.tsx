import { Spin } from "antd";
import React, { ReactElement } from "react";

const Loading = (): ReactElement => {
  return (
    <div className="spinner">
      <style jsx>{`
        padding: 30px 50px;
        text-align: center;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        display: flex;
        align-items: center;
        width: 100vw;
      `}</style>
      <Spin style={{ margin: "auto" }} tip="Loading..." />
    </div>
  );
};

export default Loading;
