class Response
{
  data;
  code;
  
  constructor(data, code)
  {
    this.data = data;
    this.code = code;
  }
}
module.exports = { Response };