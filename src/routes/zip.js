const data = require("../data.json");

const validateString = (value, key) => {
  if (typeof value === "string" && value.length >= 3) return value;
  throw new Error(
    `Invalid ${key} param. ${key} must be a string of at least 3 characters.`
  );
};

const validateNumber = (value, key) => {
  const parsedValue = parseFloat(value);
  if (!isNaN(value)) return parsedValue;
  throw new Error(`Invalid ${key} param value. ${key} must be a number.`);
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

const buildStructure = ({ key, validate, query, value }) => ({
  key,
  query,
  value: validate(value, key),
});

const paramTypes = [
  {
    key: "zip",
    validate: validateString,
    query: hasString,
  },
  {
    key: "primary_city",
    validate: validateString,
    query: hasString,
  },
  {
    key: "county",
    validate: validateString,
    query: hasString,
  },
  {
    key: "latitude",
    validate: validateNumber,
    query: isInFloatRange,
  },
  {
    key: "logitude",
    validate: validateNumber,
    query: isInFloatRange,
  },
  {
    key: "estimated_population",
    validate: validateNumber,
    query: isInIntegerRange,
  },
];

const validateQueryStringParams = (params) => {
  if (!params || typeof params !== "object")
    throw new Error("Invalid queryStringParameters object");
  const validParams = [];
  for (key in params) {
    const builder = paramTypes.find((p) => p.key === key);
    if (builder) {
      const value = params[key];
      const structure = buildStructure({ value, ...builder });
      validParams.push(structure);
    }
  }
  return validParams;
};

const getZipData = (params) => {
  const validParams = validateQueryStringParams(params);
  const results = data.filter((d) => {
    const conditions = validParams.map((p) => p.query(d[p.key], p.value));
    return conditions.every((c) => c === true);
  });
  return results;
};

const processZipRequest = (event) => {
  const { httpMethod, queryStringParameters } = event;
  if (httpMethod === "GET") {
    return getZipData(queryStringParameters);
  }
  throw new Error("Invalid /zip request");
};

module.exports = { processZipRequest };
