const data = require("./data.json");

// lambda-like handler function
module.exports.handler = async (event) => {
  // do stuff...
  return "success";
};

const validateEventObject = (event) => {
  const { httpMethod, path, queryStringParameters } = event;
  if (!httpMethod || typeof httpMethod !== "string" || httpMethod !== "GET")
    throw new Error("Invalid HTTP method");
  if (!path || typeof path !== "string" || path !== "/zip")
    throw new Error("Invalid API path");
  return queryStringParameters;
};

const validateString = (value) => {
  if (typeof value === "string" && value.length >= 3) return value;
  throw new Error("Invalid param value");
};

const validateNumber = (value) => {
  const parsedValue = parseFloat(value);
  if (!isNaN(value)) return parsedValue;
  throw new Error("Invalid param value");
};

const hasString = (value, match) => value.includes(match);

const isInFloatRange = (value, match) => {
  const floatValue = parseFloat(value);
  return floatValue - 0.1 <= match && floatValue + 0.1 >= match;
};

const isInIntegerRange = (value, match) => {
  const intValue = parseInt(value, 10) + 1;
  return intValue * 0.9 <= match + 1 && intValue * 1.1 >= match + 1;
};

const paramTypes = [
  {
    key: "zip",
    value: null,
    validate: validateString,
    query: hasString,
  },
  {
    key: "primary_city",
    value: null,
    validate: validateString,
    query: hasString,
  },
  {
    key: "county",
    value: null,
    validate: validateString,
    query: hasString,
  },
  {
    key: "latitude",
    value: null,
    validate: validateNumber,
    query: isInFloatRange,
  },
  {
    key: "logitude",
    value: null,
    validate: validateNumber,
    query: isInFloatRange,
  },
  {
    key: "estimated_population",
    value: null,
    validate: validateNumber,
    query: isInIntegerRange,
  },
];

const validateQueryStringParams = (params) => {
  if (!params || typeof params !== "object")
    throw new Error("Invalid query params");
  const validParams = [];
  for (key in params) {
    const builder = paramTypes.find((p) => p.key === key);
    if (builder) {
      builder.value = builder.validate(params[key]);
      validParams.push(builder);
    }
  }
  return validParams;
};

const getRecords = (params) => {
  const results = data.filter((d) => {
    const conditions = params.map((p) => p.query(d[p.key], p.value));
    return conditions.every((c) => c === true);
  });
  return results;
};

// need an object with: a key, a value and a find function

/* 
  Data length 2296
  Some area_code values are null... falsy
  Some population values are 0... falsy
  To find multiple elements based on a condition use Array.filter
  Required to search by zip code, city and latitude/longitude
  Let's add search by area code, population and county
  Min length of primary city is 3 characters
  Min length of county is 4 + 7 characters. All end with " County"
  Let's limit search of partial zip code and city to 3 characters minimum
*/

// const lengthOfCityName = (l) => data.filter((d) => d.longitude === null);

// console.log(findRecordByZip("01002"));

// console.log(lengthOfCityName(3).length);

// console.log(data.length);

// console.log(validateEventObject({ httpMethod: "GET", path: "/zip" }));

// console.log(
//   getRecords(validateQueryStringParams({ zip: "090", latitude: "42.0" }))
// );

console.log(getRecords(validateQueryStringParams({})).length);

// console.log(getRecords({ zip: "0106", estimated_population: 0 }));
