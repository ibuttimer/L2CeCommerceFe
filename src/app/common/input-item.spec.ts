import { InputItem } from './input-item';

describe('InputItem', () => {
  it('should create an instance', () => {
    expect(new InputItem('', '', '', '', 0, 0, false)).toBeTruthy();
  });
});
