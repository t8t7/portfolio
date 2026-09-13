import { type ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import App from '@/App';
import i18n, { changeLanguage } from '@/i18n';
import { DEFAULT_LANGUAGE, type AppLanguage } from '@/i18n/config';

async function renderApp(ui: ReactElement, language: AppLanguage = DEFAULT_LANGUAGE) {
  await changeLanguage(language);
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('Home page', () => {
  it('renders the main landing sections', async () => {
    await renderApp(<App />);

    expect(screen.getAllByText('Антон Федотов').length).toBeGreaterThan(0);
    expect(document.getElementById('certificates')).toBeTruthy();
    expect(document.getElementById('recommendations')).toBeTruthy();
    expect(document.getElementById('contact')).toBeTruthy();
    expect(document.getElementById('resume')).toBeTruthy();
    expect(screen.getByText('«Добрый Папа» — цифровая платформа мебельной студии')).toBeTruthy();
    expect(
      screen
        .getAllByRole('link', { name: 'Открыть проект →' })
        .some((link) => link.getAttribute('href') === '/api/open-project?project=goodpapa'),
    ).toBe(true);
  });

  it('switches language between RU and EN', async () => {
    const user = userEvent.setup();
    await renderApp(<App />, 'ru');

    const enButtons = screen.getAllByRole('button', { name: 'EN' });
    await user.click(enButtons[0]!);

    expect(
      (await screen.findAllByText(/discuss opportunities|Engineering experience/i))
        .length,
    ).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe('en');
  });
});
