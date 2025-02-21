import Nav from '@components/Nav';
import '../styles/globals.css';

export const metadata = {
  title: "BlogSpot",
  description: "Blogs Around the world",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className="w-full max-w-full">
      <div className="main w-full max-w-full">
        <div className="gradient w-full max-w-full" />
      </div>
      <main className="app w-full max-w-full">
        <Nav />
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;
