import Image from 'next/image';

interface MulaRatingIconProps {
    rating: 'golden_mula' | 'fresh_carrot' | 'rotten_tomato' | string;
    size?: number;
    className?: string;
}

export default function MulaRatingIcon({ rating, size = 64, className = '' }: MulaRatingIconProps) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            {rating === 'golden_mula' && (
                <Image
                    src="/images/golden_mula_transparent.png"
                    alt="Golden Mula"
                    fill
                    className="object-contain"
                />
            )}
            {rating === 'fresh_carrot' && (
                <Image
                    src="/images/fresh_carrot_transparent.png"
                    alt="Fresh Carrot"
                    fill
                    className="object-contain"
                    priority={false}
                />
            )}
            {rating === 'rotten_tomato' && (
                <Image
                    src="/images/rotten_tomato_transparent.png"
                    alt="Rotten Tomato"
                    fill
                    className="object-contain"
                    priority={false}
                />
            )}
        </div>
    );
}
