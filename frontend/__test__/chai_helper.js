import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";

chai.use(chaiEnzyme());
chai.config.truncateThreshold = 0;
chai.config.showDiff = true;

export default chai;

export { expect };
