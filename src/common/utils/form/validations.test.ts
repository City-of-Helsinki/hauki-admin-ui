import { isValidDate } from './validations';

describe('validations', () => {
  describe('isValidDate', () => {
    it('should return undefined when valid date', () => {
      expect(isValidDate('22.3.2023')).toBe(undefined);
    });

    it('should return error text when invalid date', () => {
      expect(isValidDate('32.3.2023')).toBe('Tarkista päivämäärä');
    });

    it('should return error text when invalid date', () => {
      expect(isValidDate('.3.2023')).toBe('Tarkista päivämäärä');
    });
  });
});
