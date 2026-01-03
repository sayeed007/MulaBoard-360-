import { HTMLAttributes, forwardRef } from 'react';

/**
 * Alert Variants
 */
export type AlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Alert Props
 */
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Alert Component
 *
 * Display important messages or notifications
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!">
 *   Your feedback has been submitted.
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'default',
      title,
      dismissible = false,
      onDismiss,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg p-4 border';

    const variantStyles: Record<AlertVariant, string> = {
      default: 'bg-gray-50 border-gray-200 text-gray-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      danger: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconMap: Record<AlertVariant, string> = {
      default: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      danger: '❌',
      info: 'ℹ️',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

    return (
      <div ref={ref} className={combinedClassName} role="alert" {...props}>
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{iconMap[variant]}</span>
          <div className="flex-1">
            {title && <h4 className="font-semibold mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
