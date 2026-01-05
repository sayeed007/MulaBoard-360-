import { InputHTMLAttributes, forwardRef } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ className = '', label, ...props }, ref) => {
        return (
            <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
                <div className="relative inline-flex items-center">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        ref={ref}
                        {...props}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                </div>
                {label && <span className="text-sm font-medium text-foreground select-none">{label}</span>}
            </label>
        );
    }
);

Switch.displayName = 'Switch';

export default Switch;
