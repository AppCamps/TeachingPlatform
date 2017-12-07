import { SHOW_ALL, SHOW_TOP, TOGGLE_CLASS } from '../../constants/classes';

import classReducer, { initialState } from '../../reducers/classes';

describe('classReducer', () => {
  it('should return the initial state', () => {
    expect(classReducer(undefined, { type: 'none' })).toEqual(initialState);
  });

  it('should return the state for unmatched action', () => {
    const testState = { state: 'test' };
    expect(classReducer(testState, { type: 'something' })).toEqual(testState);
  });

  describe(SHOW_ALL, () => {
    it('should set showAll to true', () => {
      expect(
        classReducer(
          { ...initialState, showAll: false },
          {
            type: SHOW_ALL,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAll: true,
        }),
      );
    });
  });

  describe(SHOW_TOP, () => {
    it('should set set SHOW_ALL to false', () => {
      expect(
        classReducer(
          { ...initialState, showAll: false },
          {
            type: SHOW_TOP,
          },
        ),
      ).toEqual(
        expect.objectContaining({
          showAll: false,
        }),
      );
    });
  });

  describe(TOGGLE_CLASS, () => {
    it('should should concat given id if not yet in array', () => {
      expect(
        classReducer(
          { ...initialState, openedClassIds: ['mathe'] },
          {
            type: TOGGLE_CLASS,
            id: 'test',
          },
        ),
      ).toHaveProperty('openedClassIds', ['mathe', 'test']);
    });
  });

  describe(TOGGLE_CLASS, () => {
    it('should should filter given id if not yet in array', () => {
      expect(
        classReducer(
          { ...initialState, openedClassIds: ['mathe', 'test'] },
          {
            type: TOGGLE_CLASS,
            id: 'mathe',
          },
        ),
      ).toHaveProperty('openedClassIds', ['test']);
    });
  });
});
