export interface RouteEntry {
  index: number;
  title: string;
  path: string;
  exact?: boolean;
  hidden?: boolean;
  routes?: RouteEntry[];
  component?: React.ComponentClass;
}
