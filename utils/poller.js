const axios = require("axios")

const poll = async (url, protocol, )=>{
    let fullUrl = `${protocol}://${url}`;
    let response = await axios.get(fullUrl);
    return response;
}

module.exports = {poll}