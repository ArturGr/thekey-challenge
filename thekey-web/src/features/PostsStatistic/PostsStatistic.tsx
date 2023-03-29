import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./PostsStatistic.module.css";
import { fetchAllPosts, selectAllPost } from "./postsSlice";
import { useEffect, useState } from "react";
import { selectAllPostWords } from "../PostWordsCounterList/postWordsCounterSlice";
import { StatisticItem } from "../../components/StatisticItem/StatisticItem";

export function PostsStatistic() {
  const dispatch = useAppDispatch();
  const allPosts = useAppSelector(selectAllPost);
  const allWords = useAppSelector(selectAllPostWords);

  const [lastPostTime, setLastPostTime] = useState<string | undefined>();
  const [YMDSinceLastPost, setYMDSinceLastPost] = useState<
    string | undefined
  >();
  const [HMSSinceLastPost, setHMSSinceLastPost] = useState<
    string | undefined
  >();

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, []);

  useEffect(() => {
    const sortedPosts = Object.values(allPosts).sort((a, b) => {
      return moment.utc(b.date_gmt).diff(moment.utc(a.date_gmt));
    });
    const lastTime = sortedPosts[0]?.date_gmt;
    if (lastTime && lastTime !== lastPostTime) {
      setLastPostTime(lastTime);
    }
  }, [allPosts]);

  useEffect(() => {
    const calculateTime = () => {
      if (!lastPostTime) return;
      var lastTime = moment.utc(lastPostTime);
      var diffSeconds = lastTime.diff(moment.now(), "seconds");
      const duration = moment.duration(diffSeconds, "seconds");

      const years = Math.abs(duration.years());
      const months = Math.abs(duration.months());
      const days = Math.abs(duration.days());
      const hours = Math.abs(duration.hours());
      const minutes = Math.abs(duration.minutes());
      const seconds = Math.abs(duration.seconds());

      let YMDLabel = "";
      if (years > 0) {
        YMDLabel += `${years} Jahr${years > 1 ? "en" : ""} `;
      }
      if (months > 0) {
        YMDLabel += `${months} Monat${months > 1 ? "en" : ""} `;
      }
      if (days > 0) {
        YMDLabel += `${days} Tag${days > 1 ? "en" : ""} `;
      }
      if (YMDSinceLastPost !== YMDLabel) {
        setYMDSinceLastPost(YMDLabel);
      }
      const HMSLabel = `${hours}:${minutes}:${seconds}`;
      if (HMSSinceLastPost !== HMSLabel) {
        setHMSSinceLastPost(HMSLabel);
      }
    };
    const interval = setInterval(calculateTime, 1000);
    calculateTime();
    return () => {
      clearInterval(interval);
    };
  }, [lastPostTime]);

  const blogsCount = Object.keys(allPosts).length;
  const vocabularyWordsCount = Object.keys(allWords).length;

  return (
    <div className={styles.postsContainer}>
      <StatisticItem
        title="Blogbeiträge"
        subTitle="Anzahl geschriebener Beiträge"
        statisticValue={String(blogsCount)}
      />
      <StatisticItem
        title="Wortschatz"
        subTitle="Anzahl verwendeter Wörter"
        statisticValue={String(vocabularyWordsCount)}
      />
      <StatisticItem
        title="Letzter Post vor"
        subTitle={YMDSinceLastPost}
        statisticValue={HMSSinceLastPost ?? "-"}
      />
    </div>
  );
}
