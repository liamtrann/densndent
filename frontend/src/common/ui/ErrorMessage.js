import React from 'react';

export default function ErrorMessage({
    message = "An error occurred.",
    type = "error", // error, warning, info
    dismissible = false,
    onDismiss = null,
    icon = true
}) {
    const getStyles = () => {
        switch (type) {
            case "warning":
                return {
                    container: "bg-amber-50 border-amber-200 text-amber-800",
                    icon: "text-amber-500",
                    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                };
            case "info":
                return {
                    container: "bg-blue-50 border-blue-200 text-blue-800",
                    icon: "text-blue-500",
                    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                };
            default: // error
                return {
                    container: "bg-red-50 border-red-200 text-red-800",
                    icon: "text-red-500",
                    iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="w-full flex items-center justify-center py-6 px-4">
            <div className={`
        relative w-full max-w-md p-4 rounded-xl border-2 shadow-lg
        ${styles.container}
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl hover:-translate-y-1
      `}>
                <div className="flex items-start space-x-3">
                    {icon && (
                        <div className="flex-shrink-0">
                            <svg
                                className={`w-6 h-6 ${styles.icon}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={styles.iconPath}
                                />
                            </svg>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {dismissible && onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="flex-shrink-0 ml-auto pl-3"
                        >
                            <svg
                                className={`w-5 h-5 ${styles.icon} hover:opacity-70 transition-opacity`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Decorative accent */}
                <div className={`absolute top-0 left-4 w-8 h-1 rounded-b-full ${type === 'warning' ? 'bg-amber-400' :
                        type === 'info' ? 'bg-blue-400' : 'bg-red-400'
                    }`}></div>
            </div>
        </div>
    );
}
