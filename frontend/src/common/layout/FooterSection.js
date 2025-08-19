export default function FooterSection({
  title,
  children,
  className = "",
  items,
  itemRender,
}) {
  return (
    <div className={className}>
      {title && <h4 className="font-semibold mb-2 text-blue-800">{title}</h4>}
      {items && Array.isArray(items) ? (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              {itemRender ? (
                itemRender(item)
              ) : typeof item === "string" ? (
                <span>{item}</span>
              ) : (
                <a href={item.href || "#"} className="hover:underline">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
