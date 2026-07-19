import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n, { changeLanguage } from '@/i18n';
import { DEFAULT_LANGUAGE, type AppLanguage } from '@/i18n/config';

interface ProvidersProps {
  children: ReactNode;
  route?: string;
}

function Providers({ children, route = '/' }: ProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </I18nextProvider>
  );
}

export async function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    language?: AppLanguage;
    route?: string;
  },
) {
  const { language = DEFAULT_LANGUAGE, route = '/', ...renderOptions } =
    options ?? {};

  await changeLanguage(language);

  return render(ui, {
    wrapper: ({ children }) => <Providers route={route}>{children}</Providers>,
    ...renderOptions,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
