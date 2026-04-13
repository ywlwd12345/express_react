export interface Permission {
  id?: number;
  name: string;
  description?: string;
}

export interface LevelPermission {
  level: number;
  permission_id: number;
}