import React from "react";

import { useAppSelector } from "../../app/hooks";
import styles from "./WordCounter.module.css";
import { selectPostWordCount } from "../../features/PostWordsCounterList/postWordsCounterSlice";

type Props = {
  word: string;
};

export const WordCounter: React.FC<Props> = ({ word }) => {
  const count = useAppSelector((state) => selectPostWordCount(state, word));
  return (
    <div className={styles.row}>
      <span className={styles.word}>{word}:</span>
      <span>{count}</span>
    </div>
  );
};
