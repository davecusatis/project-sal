import { RouteEntry } from '../core/models/routes';
import { DashboardPage } from '../pages/dashboard';
import { BroadcasterConfigPage } from '../pages/broadcaster';
import { SlotMachinePage } from '../pages/slot-machine';
import * as React from 'react';
import { Route } from 'react-router';

const routes: RouteEntry[] = [
  {
    index: 0,
    title: 'Playlist',
    path: '/',
    exact: true,
    component: SlotMachinePage,
  },
  {
    index: 1,
    title: 'Broadcaster Config',
    path: '/config',
    exact: true,
    component: BroadcasterConfigPage,
  },
  {
    index: 2,
    title: 'Live Config',
    path: '/dashboard',
    exact: true,
    component: DashboardPage,
  }
];

export function renderRoutes(): JSX.Element[] {
  return routes.map((route: RouteEntry): JSX.Element =>
    <Route key={route.index} exact={route.exact} path={route.path} component={route.component} />)
    ;
}
