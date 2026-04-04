import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders all users on initial load", () => {
  render(<App />);

  expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
  expect(screen.getByText("Diana Prince")).toBeInTheDocument();
});

test("filters users by name input", () => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter name");

  fireEvent.change(input, { target: { value: "alice" } });

  expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
});

test("filters users by role", () => {
  render(<App />);

  const select = screen.getByRole("combobox");

  fireEvent.change(select, { target: { value: "admin" } });

  expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
});

test("filters users by name and role together", () => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter name");
  const select = screen.getByRole("combobox");

  fireEvent.change(input, { target: { value: "a" } });
  fireEvent.change(select, { target: { value: "manager" } });

  expect(screen.getByText("Diana Prince")).toBeInTheDocument();
  expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
});
