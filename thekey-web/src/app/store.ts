import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import postWordsCounterReducer from '../features/PostWordsCounterList/postWordsCounterSlice';
import postsReducer from '../features/PostsStatistic/postsSlice';

export const store = configureStore({
  reducer: {
    postWordsCounter: postWordsCounterReducer,
    posts: postsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
