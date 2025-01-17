import React, { useState } from "react";
import { Title } from 'p5-react-component';

export default function BComponent() {
  const [count, setcount] = useState(0);
  console.log(count, "count");

  return (
    <div
      onClick={() => {
        setcount((pre) => pre + 1);
      }}
    >
        React Component: 
      {count}
      <Title content="我是react 组件"/>
    </div>
  );
}
