import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchPostWordsCount, WordCount } from './postWordsCounterAPI';

export interface PostWordsCounterState {
  postWords: Record<string, number>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PostWordsCounterState = {
  postWords: {},
  status: 'idle',
};

export const fetchPostWords = createAsyncThunk(
  'postWordsCounter/fetchPostWords',
  async () => {
    const response = await fetchPostWordsCount();
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

const handleUpdatePostWordsCounters = (state: PostWordsCounterState, action: PayloadAction<WordCount[] | undefined>) => {
  (action.payload ?? []).forEach(wordCount => {
    if (!state.postWords[wordCount.id]) {
      state.postWords[wordCount.id] = 0;
    }
    if (state.postWords[wordCount.id] !== wordCount.count) {
      state.postWords[wordCount.id] = wordCount.count;
    }
  })
}

export const postWordsCunterSlice = createSlice({
  name: 'postWordsCounter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updatePostWordsCounters: handleUpdatePostWordsCounters,
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostWords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostWords.fulfilled, handleUpdatePostWordsCounters)
      .addCase(fetchPostWords.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { updatePostWordsCounters } = postWordsCunterSlice.actions;

export const selectAllPostWords = (state: RootState) => state.postWordsCounter.postWords;
export const selectPostWordCount = (state: RootState, word: string) =>
  state.postWordsCounter.postWords[word]


export default postWordsCunterSlice.reducer;
