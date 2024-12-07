export interface ErrorObject {
  code?: number;
  readonly message?: string | null;
}

export interface ApiResponse<T> {
  error?: ErrorObject | null;
  result?: T | null;
}

export interface ApiResponseExt<T> extends ApiResponse<T> {
  id?: number;
  headers?: Record<string, string> | null;
}

export type GetStatisticsParams = {
  /**
   * the number of last apps to list
   */
  lastAppsUsed?: number;
  /**
   * app ID, if present will return data for one app only
   */
  app?: number;
  /**
   * start of the period to include in the list, default — week ago
   */
  start?: string;
  /**
   * end of the period to include in the list, default — now
   */
  end?: string;
};

export interface AppUsage {
  app?: number;
  /** @nullable */
  date_use?: string | null;
  /** @nullable */
  game_link?: string | null;
  /** @nullable */
  large_img?: string | null;
  /** @nullable */
  medium_img?: string | null;
  /** @nullable */
  small_img?: string | null;
  teleuser?: number;
}
