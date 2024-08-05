import { Types } from "mongoose";

type FilterValue = string | string[] | Record<string, any> | FilterValue[];

export function buildFilter(
  filters: Record<string, FilterValue>,
  match: string = "all"
) {
  const filter: Record<string, any> = {};
  const conditions: Record<string, any>[] = [];

  // Helper function to recursively convert BSON ObjectId strings to ObjectId objects
  const convertToObjectId = (val: any): any => {
    if (typeof val === "string" && /^[a-fA-F0-9]{24}$/.test(val)) {
      return new Types.ObjectId(val);
    } else if (Array.isArray(val)) {
      return val.map(convertToObjectId);
    } else if (typeof val === "object") {
      const newObj: Record<string, any> = {};
      for (const prop in val) {
        newObj[prop] = convertToObjectId(val[prop]);
      }
      return newObj;
    }
    return val;
  };

  // Helper function to flatten object with dot notation
  const flattenObject = (
    obj: Record<string, any>,
    parentKey = ""
  ): Record<string, any> => {
    const flatObject: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        flatObject[newKey] = obj[key];
      }
    }
    return flatObject;
  };

  const isNestedObject = (obj: any): boolean => {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }

    // Iterate through the object properties.
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the property value is an object and not null.
        if (typeof obj[key] === "object" && obj[key] !== null) {
          return true; // A nested object is found.
        }
      }
    }
    return false;
  };

  // Iterate over each filter key-value pair
  for (const key in filters) {
    const value = filters[key];
    // Skip 'match' key
    if (key === "match") {
      match = value.toString();
      continue;
    }

    let condition: Record<string, any>;

    // Convert values to ObjectId if they match the BSON ObjectId pattern
    const convertedValue = convertToObjectId(value);
    if (isNestedObject(convertedValue) && !Array.isArray(convertedValue)) {
      const flattenedValue = flattenObject(convertedValue, key);
      for (const flatKey in flattenedValue) {
        if (Array.isArray(flattenedValue[flatKey])) {
          // If the value is an array, use $in operator
          condition = { [flatKey]: { $in: flattenedValue[flatKey] } };
        } else if (
          typeof flattenedValue[flatKey] === "string" &&
          flattenedValue[flatKey].startsWith("!")
        ) {
          // If the value starts with '!', use $ne operator
          condition = {
            [flatKey]: { $ne: flattenedValue[flatKey].substring(1) },
          };
        } else {
          // Otherwise, use equality check
          condition = { [flatKey]: flattenedValue[flatKey] };
        }
        conditions.push(condition);
      }
    } else {
      const flattenedValue = convertedValue;
      if (Array.isArray(flattenedValue)) {
        // If the value is an array, use $in operator
        condition = { [key]: { $in: flattenedValue } };
      } else if (
        typeof flattenedValue === "string" &&
        flattenedValue.startsWith("!")
      ) {
        // If the value starts with '!', use $ne operator
        condition = { [key]: { $ne: flattenedValue.substring(1) } };
      } else {
        // Otherwise, use equality check
        condition = { [key]: flattenedValue };
      }
      conditions.push(condition);
    }
  }

  if (conditions.length > 0) {
    // Set up $and or $or depending on the 'match' parameter
    if (match === "all") {
      filter.$and = conditions;
    } else {
      filter.$or = conditions;
    }
  }
  return filter;
}

export function buildSortCriteria(sort: { field?: string; order?: string }) {
  if (!sort || !sort.field || !sort.order) {
    return [{}];
  }

  const order = sort.order === "desc" ? "-1" : "1";
  const key = sort.field as string;
  return { key: order };
}

export function buildSearchQuery(
  search: string,
  filters: Record<string, any>,
  searchField: string[]
) {
  if (!search) {
    return filters;
  }
  const conditions = [];
  for (const key of searchField) {
    const condition = { [key]: { $regex: new RegExp(search, "i") } };
    conditions.push(condition);
  }
  const orCondition = { $or: conditions };
  if (filters.$and) {
    filters.$and.push(orCondition);
  } else {
    filters.$and = [orCondition];
  }

  return filters;
}
