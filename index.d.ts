type presenceStatus = 'idle' | 'dnd' | 'online' | 'invisible'
type borderAllign = 'horizontal' | 'vertical'

interface rankOptions {
    currentXp: number;
    requiredXp: number;
    level: number;
    rank?: number;
    barColor?: string;
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
    badgesFrame?: boolean;
    presenceStatus?: presenceStatus;
    squareAvatar?: boolean;
    rankData?: rankOptions;
}

declare module 'discord-arts' {
    export function profileImage(user: string, options?: profileOptions): Promise<Buffer>;
}
