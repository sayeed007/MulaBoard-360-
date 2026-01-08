import Image from 'next/image';
import { cn } from '@/lib/utils/helpers'; // Assuming cn helper is here or clsx/tailwind-merge

interface LogoProps {
    className?: string;
    size?: number;
    priority?: boolean;
}

export function Logo({ className, size = 40, priority = false }: LogoProps) {
    return (
        <div className={cn("relative", className)} style={{ width: size, height: size }}>
            {/* Light Mode Logo */}
            <Image
                src="/logo_transparent.png"
                alt="MulaBoard Logo"
                fill
                className="object-contain drop-shadow-sm"
                priority={priority}
            />
            {/* Dark Mode Logo */}
            {/* <Image
                src="/logo.png"
                alt="MulaBoard Logo"
                fill
                className="object-contain drop-shadow-2xl hidden dark:block"
                priority={priority}
            /> */}
        </div>
    );
}
