export interface IPagination {
  count: number;
  next: number | null;
  previous: number | null;
  //   results: [];
}

export interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
