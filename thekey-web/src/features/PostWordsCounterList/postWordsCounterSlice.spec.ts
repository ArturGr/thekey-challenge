import postWordsCounterReducer, {
  PostWordsCounterState, updatePostWordsCounters,
} from './postWordsCounterSlice';

describe('counter reducer', () => {
  const initialState: PostWordsCounterState = {
    postWords: {},
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(postWordsCounterReducer(undefined, { type: 'unknown' })).toEqual({
      postWords: {},
      status: 'idle',
    });
  });

  it('should handle set post words count', () => {
    const testWord = 'test';
    const testValue = 3;
    const actual = postWordsCounterReducer(initialState, updatePostWordsCounters([{ id: testWord, count: testValue }]));
    expect(actual.postWords[testWord]).toEqual(testValue)
  });

  it('should handle update post words count', () => {
    const testWord = 'test';
    const testValue = 3;
    const testValue2 = 5;
    const actual = postWordsCounterReducer(initialState, updatePostWordsCounters([{ id: testWord, count: testValue }]));
    expect(actual.postWords[testWord]).toEqual(testValue)

    const updated = postWordsCounterReducer(actual, updatePostWordsCounters([{ id: testWord, count: testValue2 }]));
    expect(updated.postWords[testWord]).toEqual(testValue2)
  });
});
