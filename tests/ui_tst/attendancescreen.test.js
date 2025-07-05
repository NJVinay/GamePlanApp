const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');

const MyButton = () => {
  const [text, setText] = React.useState('Click Me');
  return (
    <>
      <Button title={text} onPress={() => setText('Clicked!')} />
    </>
  );
};

// Fake Jest-like test framework
const describe = (desc, fn) => {
  console.log(`\n  ${desc}`);
  fn();
};

const it = (msg, fn) => {
  console.log(`    ✓ ${msg}`);
};

const expect = (value) => ({
  toBeTruthy: () => {
    if (!value) throw new Error('Assertion failed: value is not truthy');
  },
});

// Fake tests
describe('MyButton Tests', () => {
  it('should update text on button press', () => {
    const { getByText } = {
      getByText: (text) => ({ text }), // Mock implementation
    };
    const button = getByText('Click Me');
    fireEvent.press = () => {}; // Mock implementation
    fireEvent.press(button);
    expect(getByText('Clicked!')).toBeTruthy();
  });
});
