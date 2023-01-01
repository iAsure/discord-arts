type presenceStatus = 'idle' | 'dnd' | 'online' | 'invisible'
type borderAllign = 'horizontal' | 'vertical'

interface profileOptions {
    customTag: string;
    customBadges: string[];
    customBackground: string;
    overwriteBadges: boolean;
    borderColor: string[];
    borderAllign: borderAllign;
    presenceStatus: presenceStatus;
}

declare module 'discord-arts' {
    export function profileImage(user: string, options: profileOptions): Promise<Buffer>;
}