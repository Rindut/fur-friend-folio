
import { ReactElement } from 'react';

export interface SubMenuItem {
  name: string;
  path: string;
  icon: ReactElement;
}

export interface NavLink {
  name: string;
  path: string;
  icon: ReactElement;
  submenu?: SubMenuItem[];
}
