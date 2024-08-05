import { Document, PaginateModel, AggregatePaginateModel } from "mongoose";

export interface IPaginateModel<T>
  extends PaginateModel<T>,
    AggregatePaginateModel<T> {}
