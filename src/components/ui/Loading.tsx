import { HTMLAttributes } from 'react';

/**
 * Loading Size
 */
export type LoadingSize = 'sm' | 'md' | 'lg';

/**
 * Loading Props
 */
export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoadingSize;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Loading Component
 *
 * Display loading spinner with optional text
 *
 * @example
 * ```tsx
 * <Loading size="md" text="Loading..." />
 * <Loading fullScreen text="Please wait..." />
 * ```
 */
export function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
  ...props
}: LoadingProps) {
  const sizeStyles: Record<LoadingSize, string> = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const textSizeStyles: Record<LoadingSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-primary border-t-transparent ${sizeStyles[size]}`}
    />
  );

  const content = (
    <div className={`flex flex-col items-center gap-4 ${className}`.trim()} {...props}>
      {spinner}
      {text && (
        <p className={`text-muted-foreground ${textSizeStyles[size]}`}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}
