import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the todo app heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /today/i })).toBeInTheDocument();
});

test('adds a todo from the form', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Buy milk');
  await user.click(screen.getByRole('button', { name: /^add$/i }));

  expect(screen.getByDisplayValue('Buy milk')).toBeInTheDocument();
  expect(screen.getByText(/1 remaining/i)).toBeInTheDocument();
});

test('does not add a blank todo', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), '   ');
  expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
});

test('asks for confirmation before deleting a todo', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Write tests');
  await user.click(screen.getByRole('button', { name: /^add$/i }));
  await user.click(screen.getByRole('checkbox', { name: /write tests/i }));

  expect(screen.getByRole('checkbox', { name: /write tests/i })).toBeChecked();
  expect(screen.getByText(/all done/i)).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /delete write tests/i }));
  expect(screen.getByRole('dialog', { name: /are you sure/i })).toBeInTheDocument();
  expect(screen.getByDisplayValue('Write tests')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /^delete$/i }));
  expect(screen.queryByDisplayValue('Write tests')).not.toBeInTheDocument();
});

test('keeps a todo when delete is cancelled', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Keep me');
  await user.click(screen.getByRole('button', { name: /^add$/i }));
  await user.click(screen.getByRole('button', { name: /delete keep me/i }));
  await user.click(screen.getByRole('button', { name: /cancel/i }));

  expect(screen.getByDisplayValue('Keep me')).toBeInTheDocument();
});

test('keeps todos after a remount', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Persist me');
  await user.click(screen.getByRole('button', { name: /^add$/i }));
  unmount();

  render(<App />);
  expect(screen.getByDisplayValue('Persist me')).toBeInTheDocument();
});

test('filters active and completed todos', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Open task');
  await user.click(screen.getByRole('button', { name: /^add$/i }));
  await user.type(screen.getByPlaceholderText(/what needs doing/i), 'Finished task');
  await user.click(screen.getByRole('button', { name: /^add$/i }));
  await user.click(screen.getByRole('checkbox', { name: /finished task/i }));

  await user.click(screen.getByRole('tab', { name: /active/i }));
  expect(screen.getByDisplayValue('Open task')).toBeInTheDocument();
  expect(screen.queryByDisplayValue('Finished task')).not.toBeInTheDocument();

  await user.click(screen.getByRole('tab', { name: /done/i }));
  expect(screen.getByDisplayValue('Finished task')).toBeInTheDocument();
  expect(screen.queryByDisplayValue('Open task')).not.toBeInTheDocument();
});
