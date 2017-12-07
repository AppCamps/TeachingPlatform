import { isGreaterThan, isLowerThan, isInRange } from '../../utils/form';

describe('Form utils', () => {
  describe('isGreaterThan', () => {
    it("should return '' for empty value", () => {
      expect(isGreaterThan(0)('', '123')).toEqual('');
      expect(isGreaterThan(0)(null, '123')).toEqual('');
    });

    it('should return previous value if value is lower than min', () => {
      expect(isGreaterThan(10)('6', '123')).toEqual('123');
    });

    it('should return previous value if value is NaN', () => {
      expect(isGreaterThan(10)('asd', '12')).toEqual('12');
    });

    it('should return parsed number for partly invalid inputs', () => {
      expect(isGreaterThan(10)('62-as12', '123')).toEqual('62');
      expect(isGreaterThan(10)('62.000', '123')).toEqual('62');
      expect(isGreaterThan(10)('62,000', '123')).toEqual('62');
    });
  });

  describe('isLowerThan', () => {
    it("should return '' for empty value", () => {
      expect(isLowerThan(123)('', '12')).toEqual('');
      expect(isLowerThan(123)(null, '12')).toEqual('');
    });

    it('should return previous value if value is greater than max', () => {
      expect(isLowerThan(10)('34', '2')).toEqual('2');
    });

    it('should return previous value if value is NaN', () => {
      expect(isLowerThan(20)('asd', '12')).toEqual('12');
    });

    it('should return parsed number for partly invalid inputs', () => {
      expect(isLowerThan(100)('62-as12', '23')).toEqual('62');
      expect(isLowerThan(100)('62.000', '23')).toEqual('62');
      expect(isLowerThan(100)('62,000', '23')).toEqual('62');
    });
  });

  describe('isInRange', () => {
    it("should return '' for empty value", () => {
      expect(isInRange(0, 999)('', '12')).toEqual('');
      expect(isInRange(0, 999)(null, '12')).toEqual('');
    });

    it('should return value if it is in range', () => {
      expect(isInRange(0, 10)('5', '2')).toEqual('5');
    });

    it('should include boundaries of range', () => {
      expect(isInRange(0, 10)('0', '2')).toEqual('0');
      expect(isInRange(0, 10)('10', '2')).toEqual('10');
    });

    it('should return previous value if value is greater than range', () => {
      expect(isInRange(0, 10)('34', '2')).toEqual('2');
    });

    it('should return previous value if value is lower than range', () => {
      expect(isInRange(1, 10)('0', '2')).toEqual('2');
    });

    it('should return previous value if value is NaN', () => {
      expect(isInRange(0, 20)('asd', '12')).toEqual('12');
    });

    it('should return parsed number for partly invalid inputs', () => {
      expect(isInRange(0, 100)('62-as12', '23')).toEqual('62');
      expect(isInRange(0, 100)('62.000', '23')).toEqual('62');
      expect(isInRange(0, 100)('62,000', '23')).toEqual('62');
    });
  });
});
