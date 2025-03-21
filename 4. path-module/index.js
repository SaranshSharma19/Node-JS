// Path module provides utilities for working with file and directory path


const path = require('path')

console.log("Directory Name: ", path.dirname(__filename));
console.log("File Name: ", path.basename(__filename));
console.log("File Extension: ", path.extname(__filename));

const joinedPath = path.join("/user","documents","main","mydoc")
console.log("Joined Path", joinedPath)

const resolvePath = path.resolve("user","document","main","mydoc")
console.log("Resolve Path", resolvePath)

const normalizePath = path.normalize('/user/.documents/../node/projects');
console.log("Normalize Path",normalizePath)