import Breadcrumb from "@/common/navigation/Breadcrumb";

export default function LegalLayout({ title, updated, children }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Breadcrumb path={["Home", title]} />

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
        )}
        <div className="mt-4 h-[2px] bg-gradient-to-r from-blue-600/70 to-transparent rounded" />
      </header>

      {/* Content */}
      <article className="text-gray-800 leading-relaxed">
        {children}
      </article>
    </div>
  );
}
