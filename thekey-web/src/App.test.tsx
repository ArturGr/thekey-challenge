import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import { render } from "./enzyme";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useLayoutEffect: jest.requireActual("react").useEffect,
}));

describe("should render main components", () => {
  const wrapper = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  it("should render PostsStatistic", () => {
    expect(wrapper.find(".postsContainer").length).toBe(1);
  });

  it("should render PostWordsCounter", () => {
    expect(wrapper.find(".wordsListContainer").length).toBe(1);
  });
});

/*
configure({ adapter: new Adapter() });
describe("WeatherWidget", () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  const store = mockStore({});

  it("should render without problems", () => {
    const wrapper = shallow(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>
    );

    expect(wrapper.find(WeatherWidget).length).toBe(1);
  });
});
*/
