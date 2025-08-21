import { useNavigate } from "react-router-dom";

export default function Breadcrumb({ path }) {
  const navigate = useNavigate();

  return (
    <div className="text-sm text-gray-600 mb-4">
      {path.map((segment, idx) => {
        const getUrl = (segment) => {
          if (segment.toLowerCase() === "home") {
            return "/";
          }
          return "/" + segment.toLowerCase().replace(/\s+/g, "-");
        };

        return (
          <span key={idx}>
            {idx > 0 && " - "}
            {idx === path.length - 1 ? (
              <span className="font-semibold">{segment}</span>
            ) : (
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(getUrl(segment))}
              >
                {segment}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
