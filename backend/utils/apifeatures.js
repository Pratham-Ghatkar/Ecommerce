const { json } = require("express");

class Apifeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword, // for finding any match of string
            $options: "i", // case sensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const querycopy = { ...this.querystr };

    const removefields = ["keyword", "page", "limit"];
    removefields.forEach((key) => delete querycopy[key]);
    let querystring = JSON.stringify(querycopy);
    querystring = querystring.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(querystring));
    return this;
  }
  pagination(resultperpage) {
    const currentpage = Number(this.querystr.page) || 1;
    const skip = resultperpage * (currentpage - 1);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }
}

module.exports = Apifeatures;
