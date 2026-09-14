import { type ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Разрабатываю программные решения и автоматизирую инженерные процессы',
      }),
    ).toBeTruthy();
    expect(document.getElementById('capabilities')).toBeTruthy();
    expect(document.getElementById('services')).toBeTruthy();
    expect(document.getElementById('production')).toBeTruthy();
    expect(document.getElementById('experience')).toBeTruthy();
    expect(screen.getByText('Экспресс Гарант – Авалон')).toBeTruthy();
    expect(screen.getByText('ООО ПК Меридиум')).toBeTruthy();
    expect(screen.getAllByText('SolidWorks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Solid Edge').length).toBeGreaterThan(0);
    expect(document.getElementById('certificates')).toBeTruthy();
    expect(document.getElementById('recommendations')).toBeTruthy();
    expect(document.getElementById('contact')).toBeTruthy();
    expect(document.getElementById('resume')).toBeTruthy();
    expect(screen.getByText('«Добрый Папа» — цифровая платформа мебельной студии')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Скачать CV' })).toHaveAttribute(
      'href',
      '/resume/Anton_Fedotov_Resume.pdf',
    );
    expect(
      screen
        .getAllByRole('link', { name: 'Открыть проект →' })
        .some((link) => link.getAttribute('href') === '/api/open-project?project=goodpapa'),
    ).toBe(true);
  });

  it('keeps the selling sections in the intended order', async () => {
    await renderApp(<App />);

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map(
      (section) => section.id,
    );

    expect(sectionIds).toEqual(
      expect.arrayContaining([
        'hero',
        'capabilities',
        'projects',
        'experience',
        'services',
        'skills',
        'production',
        'about',
        'contact',
      ]),
    );
    expect(sectionIds.indexOf('projects')).toBeLessThan(sectionIds.indexOf('about'));
    expect(sectionIds.indexOf('projects')).toBeLessThan(sectionIds.indexOf('experience'));
    expect(sectionIds.indexOf('experience')).toBeLessThan(sectionIds.indexOf('services'));
    expect(sectionIds.indexOf('production')).toBeLessThan(sectionIds.indexOf('about'));
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
    await waitFor(() => {
      expect(document.documentElement.lang).toBe('en');
      expect(window.location.pathname).toBe('/en/');
    });
  });
});
