import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.setImmediate = global.setTimeout as any;

export { shallow, mount, render };
export default Enzyme;