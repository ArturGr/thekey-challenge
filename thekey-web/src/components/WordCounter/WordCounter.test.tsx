import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "../../app/store";
import { WordCounter } from "./WordCounter";
import {
  updatePostWordsCounters,
} from "../../features/PostWordsCounterList/postWordsCounterSlice";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useLayoutEffect: jest.requireActual("react").useEffect,
}));

describe("should render word counter", () => {
  store.dispatch(updatePostWordsCounters([{id: 'testword', count: 9583848}]))

  render(
    <Provider store={store}>
      <WordCounter word="testword" />
    </Provider>
  );

  it("should render word ad count from store", () => {
    expect(screen.getByText("testword:")).toBeInTheDocument();
    expect(screen.getByText("9583848")).toBeInTheDocument();
  });
});
