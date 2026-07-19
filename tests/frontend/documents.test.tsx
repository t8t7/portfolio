import { describe, expect, it } from 'vitest';
import { Certificates } from '@/sections/Certificates';
import { Recommendations } from '@/sections/Recommendations';
import { Resume } from '@/sections/Resume';
import { profileMeta } from '@/data/portfolio';
import { renderWithProviders, screen, userEvent, within } from '../helpers/render';

describe('Certificates viewer', () => {
  it('opens the certificate image in the shared lightbox', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Certificates />);

    await user.click(
      screen.getByRole('button', { name: /Просмотреть сертификат|View certificate/i }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByRole('img')).toBeTruthy();
    expect(screen.getByText('1 / 1')).toBeTruthy();
  });
});

describe('Recommendations viewer', () => {
  it('opens Avalon recommendation as a multi-page gallery', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Recommendations />);

    const openButtons = screen.getAllByRole('button', {
      name: /Открыть рекомендательное письмо|Open recommendation/i,
    });

    await user.click(openButtons[0]!);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByRole('img')).toBeTruthy();
    expect(screen.getByText('1 / 2')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /Вперед|Next/i }));
    expect(await screen.findByText('2 / 2')).toBeTruthy();
  });

  it('opens Meridium recommendation letter', async () => {
    const user = userEvent.setup();
    await renderWithProviders(<Recommendations />);

    const openButtons = screen.getAllByRole('button', {
      name: /Открыть рекомендательное письмо|Open recommendation/i,
    });

    await user.click(openButtons[1]!);

    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('1 / 1')).toBeTruthy();
  });
});

describe('Resume PDF download', () => {
  it('exposes a download link to the resume PDF', async () => {
    await renderWithProviders(<Resume />);

    const link = screen.getByRole('link', {
      name: /Скачать|Download/i,
    });

    expect(link.getAttribute('href')).toBe(profileMeta.resumeUrl);
    expect(link.getAttribute('download')).toBe('Anton_Fedotov_Resume.pdf');
  });
});
