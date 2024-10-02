export interface IMenuFormResolver {
  title: string;
  menuType: string;
  subMenus?: ISubMenuFormResolver[];
}

export interface ISubMenuFormResolver {
  title: string;
}

export interface IMenu {
  _id: string;
  title: string;
  menuType: number;
  subMenus: ISubMenu[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoupen {
  _id: string;
  coupenName: string;
  coupenType: string;
  discountAmount: number;
  minAmount: number;
  maxAmount: number;
  availability: boolean;
  startDateWithTime
  : string; endDateWithTime: string
}

export interface ISubMenu {
  title: string;
  _id?: string;
}

export interface IMenuFormResolver {
  title: string;
  menuType: string;
  subMenus?: ISubMenuFormResolver[];
}

export interface ISubMenuFormResolver {
  title: string;
}
