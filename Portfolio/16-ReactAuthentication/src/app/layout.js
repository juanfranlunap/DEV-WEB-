import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Providers from '../components/Providers';

export const metadata = {
  title: "StarWarsFanBlog",
  description: "Feel the Force",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
