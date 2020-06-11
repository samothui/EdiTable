export type SortDirection = 'asc' | 'desc' | '';
export const rotate: {[key: string]: SortDirection} = {'asc': 'desc', 'desc': '', '': 'asc' };
// export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

export interface PutDTO {
  id: number
  company: string,
  contact: string,
  country: string
}

export interface PostDTO {
  company: string,
  contact: string,
  country: string
}

export interface QueryParameters{
  filter: string,
  filterColumn: string,
  sortingDirection: string,
  sortingHeader: string,
  currentPage: number,
  selectedItemsPerPage: number
}
