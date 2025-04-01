import React from "react";
import styles from "./index.module.css";

const Welcome: React.FC = () => {
  return (
    <>
      <h1>欢迎来到结构工具箱</h1>
      <div className={styles.text}>试试左边的小工具吧</div>
      <div className={styles.text}>
        如果你觉得这个网页有用，可以请我喝杯奶茶哦
      </div>
    </>
  );
};

export default Welcome;
