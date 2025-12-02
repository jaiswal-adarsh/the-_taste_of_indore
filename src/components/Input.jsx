import React from 'react';

const Input = ({
    label,
    error,
    id,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-[var(--color-secondary)]">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`
          px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
          ${error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs text-[var(--color-danger)]">{error}</span>
            )}
        </div>
    );
};

export default Input;
