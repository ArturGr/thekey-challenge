import React from "react";
import styles from "./StatisticItem.module.css";

type Props = {
  title: string;
  subTitle?: string;
  statisticValue: string;
};

export const StatisticItem: React.FC<Props> = ({ title,subTitle, statisticValue }) => {
  return (
    <div className={styles.row}>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subTitle}</span>
      <span className={styles.text}>{statisticValue}</span>
    </div>
  );
};
