import { StatisticItem } from "./StatisticItem";
import { shallow } from "../../enzyme";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useLayoutEffect: jest.requireActual("react").useEffect,
}));

describe("should statistics item", () => {
  const wrapper = shallow(
    <StatisticItem
      title="test title"
      subTitle="test subtitle"
      statisticValue="statistic value"
    />
  );

  it("should render title", () => {
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').getElement().props.children).toBe('test title');
  });

  it("should render subtitle", () => {
    expect(wrapper.find('.subtitle').length).toBe(1);
    expect(wrapper.find('.subtitle').getElement().props.children).toBe('test subtitle');
  });

  it("should render statistics value", () => {
    expect(wrapper.find('.text').length).toBe(1);
    expect(wrapper.find('.text').getElement().props.children).toBe('statistic value');
  });
});
