'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Link2, Check } from 'lucide-react';

interface ShareProfileProps {
    profileUrl: string;
}

export default function ShareProfile({ profileUrl }: ShareProfileProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My MulaBoard Profile',
                    text: 'Check out my MulaBoard profile and give me some feedback!',
                    url: profileUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copy clipboard
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="primary"
            className="shadow-lg shadow-primary/20 flex items-center gap-2"
            onClick={handleShare}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Link Copied!
                </>
            ) : (
                <>
                    <Link2 className="w-4 h-4" />
                    Share Profile
                </>
            )}
        </Button>
    );
}
