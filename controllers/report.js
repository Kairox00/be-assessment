const { response } = require("express");
const db = require("../models")
const mailer = require("../utils/mailer")
const axios = require("axios")
const https = require('https');


const createReport = async (req,res,next)=>{
    try{
        let urlCheck = await db.UrlCheck.findById(req.params.id).populate("user", {
            email: true,
        })
        let outages = 0;
        let downtime = 0;
        let uptime = 0;
        let history = [];
        let availability = 0;
        let wasDown = false;
        let totalPolls = 0
    
        
        setInterval(async ()=>{
            response = await poll(urlCheck);
            if(response.status>=400){
                outages++;
                downtime+=response.responseTime
                if(outages >= urlCheck.threshold && !wasDown){
                    await notify(urlCheck.webhook,"Url is down", "down");
                    wasDown = true;
                }
                
            }
            else{
                uptime+=response.responseTime
                if(wasDown){
                    await notify(urlCheck.webhook,"Url is up", "up");
                    wasDown = false;
                }
                
            }
            if(response.status !== urlCheck.assert){
                throw new Error(`Assertion failed ${response.status} !== ${urlCheck.assert}`);
            }

    
            history = [...history, `${new Date()}: ${response.statusText}`]
            totalPolls++
    
            availability = ((totalPolls - outages)/totalPolls) *100
       
            let report = {
                status: response.status,
                responseTime: response.responseTime,
                availability,
                outages,
                downtime,
                uptime,
                history,
                urlCheck: urlCheck._id
            }
        
            let savedReport = await db.Report.create(report);
            urlCheck.reports.push(savedReport._id);
            await urlCheck.save();
    
          }, urlCheck.interval *60000);
    
          res.status(200).send("Polling started");
    }
    catch(err){
        return next({
            status: 400,
            message: err.message
        })
    }
        
}

const getReports = async (req, res, next)=>{
    let urlCheck = await db.UrlCheck.findById(req.params.id).populate("reports");
    let reports = await db.Report.find().where('_id').in(urlCheck.reports).exec();
    return res.status(200).send(reports);
}

const notify = async (webhook, message, status)=>{
    let mailDetails = {
        from: process.env.email,
        to: urlCheck.user.email,
        subject: `URL is ${status}`,
        text: message
    };
    mailer.send(mailDetails);
    if(webhook){
        await axios.post(webhook, {text: message});
    }
   
}



const poll = async (urlCheck)=>{
    let {url, protocol, path, port, timeout, auth, ignoreSSL, httpHeaders} = urlCheck
    let fullUrl = `${protocol}://${url}`;
    if(port){
        fullUrl += `:${port}`
    }
    if(path){
        fullUrl += `/${path}`
    }
    const httpsAgent = new https.Agent({
        rejectUnauthorized: ignoreSSL
    });
    const headers = {};

    httpHeaders.forEach(header => {
        headers[header.key] = header.value;
    });

    let config = {
        method: "GET",
        url: fullUrl,
        timeout: timeout*1000,
        auth: auth,
        httpsAgent: httpsAgent,
        headers: headers
    }
    let start = Date.now();
    let response = await axios.request(config);
    let responseTime = Date.now() - start;
    response.responseTime = responseTime;
    return response;
}

module.exports = {createReport, getReports}