class Response {
    data;
    code;
}
generateResponse = (res, data, code) => {
  const response = new Response();
  response.data = data;
  response.code = code;
  return res.status(code).json(response);
};
module.exports = { Response, generateResponse };