export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-100 py-6 mt-10 text-center text-sm text-gray-600">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">
          Jamia Project Magazine
        </span>{" "}
        · Built by Campus Creatives
      </p>
    </footer>
  );
}
