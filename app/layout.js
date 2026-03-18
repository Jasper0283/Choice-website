// app/layout.js
import './globals.css';

export const metadata = {
  title: 'LEGO Keuzehulp',
  description: 'Beslisboom: welke LEGO-set past het best bij jou?',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}