class Response
{
  code;
  data;
  
  constructor(data, code)
  {
    this.data = data;
    this.code = code;
  }
}
module.exports = { Response };