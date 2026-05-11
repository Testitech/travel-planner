export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} Smarrrt. Built for Nigerian travelers.
      </p>
    </footer>
  );
}