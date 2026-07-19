import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { Contact } from '@/sections/Contact';
import { renderWithProviders, screen, userEvent, waitFor } from '../helpers/render';

const { submitContactForm } = vi.hoisted(() => ({
  submitContactForm: vi.fn(),
}));

vi.mock('@/services/contact', () => ({
  submitContactForm,
}));

function setField(label: RegExp, value: string) {
  const field = screen.getByLabelText(label);
  fireEvent.change(field, { target: { value } });
}

describe('Contact form', () => {
  beforeEach(() => {
    submitContactForm.mockReset();
    submitContactForm.mockResolvedValue({
      ok: true,
      statusKey: 'success',
    });
  });

  it('renders contact form fields', async () => {
    await renderWithProviders(<Contact />);

    expect(screen.getByLabelText(/^Имя$|^Name$/i)).toBeTruthy();
    expect(screen.getByLabelText(/^Email$/i)).toBeTruthy();
    expect(screen.getByLabelText(/^Сообщение$|^Message$/i)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Отправить|Send message/i }),
    ).toBeTruthy();
  });

  it('shows email validation errors', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Contact />);

    setField(/^Имя$|^Name$/i, 'Anton');
    setField(/^Email$/i, 'bad-email');
    setField(/^Сообщение$|^Message$/i, 'Hello, I would like to discuss a backend role.');

    await user.click(screen.getByRole('button', { name: /Отправить|Send message/i }));

    expect(
      await screen.findByText(/Введите корректный email|Enter a valid email/i),
    ).toBeTruthy();
    expect(submitContactForm).not.toHaveBeenCalled();
  });

  it('shows required field errors on empty submit', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Contact />);

    await user.click(screen.getByRole('button', { name: /Отправить|Send message/i }));

    const requiredMessages = await screen.findAllByText(
      /Это поле обязательно|This field is required/i,
    );
    expect(requiredMessages.length).toBeGreaterThanOrEqual(2);
    expect(submitContactForm).not.toHaveBeenCalled();
  });

  it('submits successfully and shows success status', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Contact />);

    setField(/^Имя$|^Name$/i, 'Anton Fedotov');
    setField(/^Email$/i, 'anton@example.com');
    setField(/^Сообщение$|^Message$/i, 'Hello, I would like to discuss a backend role.');

    await user.click(screen.getByRole('button', { name: /Отправить|Send message/i }));

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledTimes(1);
    });

    expect(submitContactForm.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        name: 'Anton Fedotov',
        email: 'anton@example.com',
      }),
    );

    expect(await screen.findByRole('status')).toHaveTextContent(
      /Спасибо|Thank you|успешно|successfully/i,
    );

    expect((screen.getByLabelText(/^Имя$|^Name$/i) as HTMLInputElement).value).toBe(
      '',
    );
  });

  it('displays server error status when submission fails', async () => {
    submitContactForm.mockResolvedValue({
      ok: false,
      statusKey: 'error',
    });

    const user = userEvent.setup();
    await renderWithProviders(<Contact />);

    setField(/^Имя$|^Name$/i, 'Anton Fedotov');
    setField(/^Email$/i, 'anton@example.com');
    setField(/^Сообщение$|^Message$/i, 'Hello, I would like to discuss a backend role.');

    await user.click(screen.getByRole('button', { name: /Отправить|Send message/i }));

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalled();
    });

    expect(await screen.findByRole('status')).toHaveTextContent(
      /Что-то пошло не так|Something went wrong/i,
    );
  });

  it('displays field errors returned by the API', async () => {
    submitContactForm.mockResolvedValue({
      ok: false,
      statusKey: 'error',
      fieldErrors: { email: 'emailInvalid' },
    });

    const user = userEvent.setup();
    await renderWithProviders(<Contact />);

    setField(/^Имя$|^Name$/i, 'Anton Fedotov');
    setField(/^Email$/i, 'anton@example.com');
    setField(/^Сообщение$|^Message$/i, 'Hello, I would like to discuss a backend role.');

    await user.click(screen.getByRole('button', { name: /Отправить|Send message/i }));

    expect(
      await screen.findByText(/Введите корректный email|Enter a valid email/i),
    ).toBeTruthy();
  });
});
