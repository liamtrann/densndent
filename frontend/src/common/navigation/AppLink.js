import classNames from "classnames";

export default function AppLink({ href, children, className = "", ...props }) {
  const isExternal =
    href && (href.startsWith("http://") || href.startsWith("https://"));
  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames("hover:underline", className)}
      {...props}
    >
      {children}
    </a>
  ) : (
    <a
      href={href}
      className={classNames("hover:underline", className)}
      {...props}
    >
      {children}
    </a>
  );
}
