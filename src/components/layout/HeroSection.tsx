import Image from 'next/image';

interface HeroSectionProps {
    children?: React.ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
    return (
        <div className="min-h-48 bg-gradient-to-r from-primary/20 via-primary/20 to-primary/20 relative overflow-hidden">
            {/* Decorative Mula Images */}
            <div className="absolute top-10 left-10 w-32 h-32 opacity-10 animate-pulse">
                <Image
                    src="/images/golden_mula_transparent.png"
                    alt="Golden Mula"
                    width={128}
                    height={128}
                    className="object-contain"
                />
            </div>
            <div className="absolute bottom-10 left-1/3 w-32 h-32 opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                <Image
                    src="/images/fresh_carrot_transparent.png"
                    alt="Fresh Carrot"
                    width={128}
                    height={128}
                    className="object-contain"
                />
            </div>
            <div className="absolute top-20 right-16 w-28 h-28 opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Image
                    src="/images/rotten_tomato_transparent.png"
                    alt="Rotten Tomato"
                    width={112}
                    height={112}
                    className="object-contain"
                />
            </div>

            {/* Content */}
            {children}
        </div>
    );
}
