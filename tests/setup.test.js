describe('Project Setup', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true);
  });

  it('should support ES6+ features', () => {
    const test = () => {
      const x = 1;
      const y = 2;
      return { x, y };
    };
    expect(test()).toEqual({ x: 1, y: 2 });
  });
}); 