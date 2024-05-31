type presenceStatus = 'online' | 'idle' | 'offline' | 'dnd' | 'invisible' | 'streaming' | 'phone'
type borderAllign = 'horizontal' | 'vertical'

interface rankOptions {
    currentXp: number;
    requiredXp: number;
    level: number;
    rank?: number;
    barColor?: string;
    levelColor?: string;
    autoColorRank?: boolean;
}

interface profileOptions {
    customTag?: string;
    customBadges?: string[];
    customBackground?: string;
    overwriteBadges?: boolean;
    usernameColor?: string;
    tagColor?: string;
    borderColor?: string | string[];
    borderAllign?: borderAllign;
    disableProfileTheme?: boolean;
    disableBackgroundBlur?: boolean;
    badgesFrame?: boolean;
    removeBadges?: boolean;
    removeBorder?: boolean;
    presenceStatus?: presenceStatus;
    squareAvatar?: boolean;
    moreBackgroundBlur?: boolean;
    backgroundBrightness?: number
    customDate?: Date | string;
    localDateType?: string;
    removeAvatarFrame?: boolean;
    rankData?: rankOptions;
}

declare module 'discord-arts' {
    export function profileImage(user: string, options?: profileOptions): Promise<Buffer>;
}
