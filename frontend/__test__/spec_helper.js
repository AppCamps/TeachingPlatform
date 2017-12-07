import Faker from 'faker';
import uuid from 'uuid/v4';
import MockLocalStorage from 'mock-localstorage';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.Faker = Faker;
global.uuid = uuid;

process.env.DEFAULT_LANGUAGE = 'en';
window.localStorage = new MockLocalStorage();

Enzyme.configure({ adapter: new Adapter() });
