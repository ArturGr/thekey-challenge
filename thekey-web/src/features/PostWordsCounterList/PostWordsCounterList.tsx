import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { WordCounter } from "../../components/WordCounter/WordCounter";
import styles from "./PostWordsCounter.module.css";
import { fetchPostWords, selectAllPostWords } from "./postWordsCounterSlice";
import { useEffect, useMemo } from "react";

export function PostWordsCounterList() {
  const dispatch = useAppDispatch();
  const allPostWords = useAppSelector(selectAllPostWords);

  useEffect(() => {
    dispatch(fetchPostWords());
  }, []);

  const sortedList = useMemo(() => {
    return Object.keys(allPostWords)
      .sort((a, b) => {
        if (allPostWords[b] !== allPostWords[a]) {
          return allPostWords[b] - allPostWords[a];
        }
        return a.localeCompare(b);
      })
      .map((key) => ({
        word: key,
        count: allPostWords[key],
      }));
  }, [allPostWords]);

  return (
    <div className={styles.wordsListContainer}>
      <span className={styles.title}>Verwendete Wörter und ihre Häufigkeit</span>
      <div className={styles.wordsList}>
        {sortedList.map((item) => (
          <WordCounter key={item.word} word={item.word} />
        ))}
      </div>
    </div>
  );
}
