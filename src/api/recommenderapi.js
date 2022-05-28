import axios from "axios";

//API Deployed Link is added as base url to simply use without running api in local-machine
export default axios.create({
  baseURL:"https://epic-mrs-api.herokuapp.com/",
  // baseURL:"http://127.0.0.1:5000/",
  headers: { "Content-Type": "multipart/form-data" },
});
