import React from "react";

/**
 * Reusable form wrapper that handles submit and disables children while submitting.
 * @param {Object} props
 * @param {function} props.onSubmit - Form submit handler
 * @param {boolean} [props.isSubmitting] - If true, disables all form controls
 * @param {React.ReactNode} props.children - Form content
 * @param {string} [props.className] - Additional class names
 * @param {object} [props.rest] - Other props
 */
export default function FormSubmit({
    onSubmit,
    isSubmitting = false,
    children,
    className = "",
    ...rest
}) {
    return (
        <form
            onSubmit={onSubmit}
            className={className}
            {...rest}
        >
            {/* Optionally, you can wrap children in a <fieldset> to disable all at once */}
            <fieldset disabled={isSubmitting} style={{ border: 0, padding: 0, margin: 0 }}>
                {children}
            </fieldset>
        </form>
    );
}
