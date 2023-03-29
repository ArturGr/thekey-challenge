import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { PostWordsCounterList } from "./features/PostWordsCounterList/PostWordsCounterList";
import { useAppDispatch } from "./app/hooks";
import { updatePostWordsCounters } from "./features/PostWordsCounterList/postWordsCounterSlice";
import { WordCount } from "./features/PostWordsCounterList/postWordsCounterAPI";
import { PostsStatistic } from "./features/PostsStatistic/PostsStatistic";
import { Post } from "./features/PostsStatistic/postsAPI";
import { insertPost } from "./features/PostsStatistic/postsSlice";

function App() {
  const [_, setIsConnected] = useState(socket.connected);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPostWordsUpdatedEvent(value: { postWords: WordCount[] }) {
      value && dispatch(updatePostWordsCounters(value.postWords));
    }

    function onPostCreatedEvent(value: { post: Post }) {
      value && dispatch(insertPost(value.post));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("post_words_updated", onPostWordsUpdatedEvent);
    socket.on("post_created", onPostCreatedEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("post_words_updated", onPostWordsUpdatedEvent);
      socket.off("post_created", onPostCreatedEvent);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://www.thekey.technology/wp-content/uploads/key-logo@2x-1.png"
          className="App-logo"
        />
        <PostsStatistic />
        <PostWordsCounterList />
      </header>
    </div>
  );
}

export default App;
