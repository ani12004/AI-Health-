import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { DataProvider } from '../context/DataProvider';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
