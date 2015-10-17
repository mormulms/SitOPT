var url = "https://www.google.com:8080/this/is/a/test"
var splits = url.split("/")
console.log(url.substr(url.indexOf(splits[2]) + splits[2].length))
