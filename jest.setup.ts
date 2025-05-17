import "@testing-library/jest-dom";

// Mock për një funksion të jashtëm
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Këtu mund të importohen biblioteka si jest-dom ose mocks në të ardhmen.
export {};
