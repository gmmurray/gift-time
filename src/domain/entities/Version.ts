export interface Version {
    version_id: number;
    name: string;
    description: string;
    is_active: boolean;
}

export const VersionsTable = 'versions';
