const { processZipRequest } = require("./routes/zip");

// lambda-like handler function
module.exports.handler = async (event) => {
  const results = processEvent(event);
  return results;
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
