import TopNavBar from './TopNavBar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <TopNavBar />
      <main className="flex-1 max-w-container-max w-full mx-auto px-gutter py-md">
        {children}
      </main>
      <Footer />
    </div>
  );
}
