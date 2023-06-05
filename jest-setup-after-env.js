import '@testing-library/jest-native/extend-expect';

// From https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/#with-jest-setup-file
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// From https://reactnavigation.org/docs/testing/#mocking-native-modules
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
