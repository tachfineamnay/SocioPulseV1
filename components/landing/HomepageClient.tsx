'use client';

import { useState } from 'react';
import {
    HomeHero,
    BrandSwitcher,
    PublicSmartFeed,
    RegistrationCTA,
    type ViewMode,
    type PublicOpportunityItem
} from '@/components/landing';

// ===========================================
// PUBLIC HOMEPAGE CLIENT WRAPPER
// Handles client-side state for Brand Switcher
// ===========================================

interface HomepageClientProps {
    initialItems: PublicOpportunityItem[];
    initialMeta: {
        page: number;
        hasNextPage: boolean;
        total?: number;
    };
}

export function HomepageClient({ initialItems, initialMeta }: HomepageClientProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('establishment');

    return (
        <>
            {/* Hero Section */}
            <HomeHero />

            {/* Brand Switcher */}
            <BrandSwitcher value={viewMode} onChange={setViewMode} />

            {/* Public Smart Feed */}
            <PublicSmartFeed
                initialItems={initialItems}
                initialMeta={initialMeta}
                viewMode={viewMode}
            />

            {/* Floating Registration CTA */}
            <RegistrationCTA viewMode={viewMode} />
        </>
    );
}
