export interface UpdateProfileDTO {
  name?: string;
  avatar?: string;
}

export interface UpdateSettingsDTO {
  theme?: 'light' | 'dark' | 'system' | 'amoled';
  units?: 'metric' | 'imperial';
  notifications?: Record<string, boolean>;
}
