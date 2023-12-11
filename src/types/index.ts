export interface ICharacter {
  name: string;
  status: IStatus;
  url: string;
  category: ICategory;
}

export interface IStatus {
  status: string;
  type: IType;
}
export interface IType {
  type: string;
}

export interface ICategory {
  category: 'SPECIES' | 'SEASONS';
  subcategories: ISubcategory;
}

export interface ISubcategory {
  subcategory: string;
}
