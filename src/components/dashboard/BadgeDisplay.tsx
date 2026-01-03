'use client';

import { BADGE_RARITY, type Badge } from '@/lib/constants/badges';

/**
 * Badge Display Component
 *
 * Shows earned and locked badges with tooltips
 */

interface BadgeDisplayProps {
  earnedBadges: Badge[];
  allBadges: Badge[];
  badgeProgress?: Map<string, number>;
}

export default function BadgeDisplay({
  earnedBadges,
  allBadges,
  badgeProgress,
}: BadgeDisplayProps) {
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border">
      <h2 className="text-2xl font-bold mb-6">Achievement Badges</h2>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>Earned ({earnedBadges.length})</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={true} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🔒</span>
          <span>Locked ({allBadges.length - earnedBadges.length})</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allBadges
            .filter((badge) => !earnedBadgeIds.has(badge.id))
            .map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={false}
                progress={badgeProgress?.get(badge.id)}
              />
            ))}
        </div>
      </div>

      {/* Empty State */}
      {earnedBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎖️</div>
          <p className="text-muted-foreground mb-2">
            No badges earned yet
          </p>
          <p className="text-sm text-muted-foreground">
            Keep collecting feedback to unlock achievement badges!
          </p>
        </div>
      )}
    </div>
  );
}

function BadgeCard({
  badge,
  earned,
  progress,
}: {
  badge: Badge;
  earned: boolean;
  progress?: number;
}) {
  const rarityDetails = BADGE_RARITY[badge.rarity];

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all hover:scale-105 cursor-help
        ${earned ? 'bg-card border-primary shadow-md' : 'bg-muted/30 border-muted grayscale opacity-60'}
      `}
      title={badge.description}
      style={
        earned
          ? {
              backgroundColor: rarityDetails.bgColor,
              borderColor: badge.color,
            }
          : undefined
      }
    >
      {/* Badge Icon */}
      <div className="text-4xl text-center mb-2">{badge.emoji}</div>

      {/* Badge Name */}
      <div className="text-center">
        <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
          {badge.name}
        </h4>

        {/* Rarity */}
        <div className="mt-2">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: earned ? rarityDetails.bgColor : undefined,
              color: earned ? rarityDetails.color : undefined,
            }}
          >
            {rarityDetails.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {badge.description}
        </p>

        {/* Progress (for locked badges) */}
        {!earned && progress !== undefined && progress > 0 && (
          <div className="mt-3">
            <div className="bg-muted/50 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Locked Icon */}
        {!earned && (
          <div className="absolute top-2 right-2 text-lg">🔒</div>
        )}

        {/* Earned Icon */}
        {earned && (
          <div className="absolute top-2 right-2 text-lg">✅</div>
        )}
      </div>
    </div>
  );
}
