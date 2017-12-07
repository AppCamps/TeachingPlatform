import { expect } from '../chai_helper';
import TestStore from '../orm-helper';

describe('Lesson', () => {
  let store;
  beforeEach(() => {
    store = new TestStore({});
  });

  it('slug', () => {
    const { factory } = store;
    const lesson = factory.create('lesson', { title: null });

    expect(lesson.slug).to.eql(null);

    lesson.set('title', '!*einführung_App development');
    expect(lesson.slug).to.eql('einfhrung_app-development');

    lesson.set('title', 'HTML & CSS');
    expect(lesson.slug).to.eql('html-css');
  });
});
