const { processZipRequest } = require("./routes/zip");

// lambda-like handler function
module.exports.handler = async (event) => {
  const results = processEvent(event);
  console.log(results.length);
  return "success";
};

const processEvent = (event) => {
  if (typeof event !== "object") throw new Error("event must be an object");
  const { httpMethod, path } = event;
  if (!path || typeof path !== "string")
    throw new Error("path property of event must be a string");
  if (!httpMethod || typeof httpMethod !== "string")
    throw new Error("httpMethod property of event must be a string");
  const routeNames = getAllRouteNames();
  if (!routeNames.includes(path)) throw new Error(`Invalid API path ${path}`);
  const { methods, processRequest } = getRouteProps(path);
  if (!methods || !methods.includes(httpMethod))
    throw new Error(`Invalid HTTP method ${httpMethod}`);
  return processRequest(event);
};

const routeTypes = [
  {
    name: "/zip",
    methods: ["GET"],
    processRequest: processZipRequest,
  },
];

const getAllRouteNames = () => routeTypes.map((r) => r.name);

const getRouteProps = (name) => {
  const routes = routeTypes.find((r) => r.name === name);
  if (!routes) return null;
  return routes;
};

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

// console.log(
//   getRecords(validateQueryStringParams({ zip: 0, estimated_population: 0 }))
//     .length
// );

// console.log(getRecords({ zip: "0106", estimated_population: 0 }));
