const Url = require("../model/url");
const mongoose = require("mongoose");
const Analytics = require("../model/analytics");
const uaParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const analytics = require("../model/analytics");


async function genrateShortUrl() {
    try{

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let urlId = '';

            const charactersLength = characters.length;
            for (let i = 0; i < 7; i++) {
                urlId += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

        const checkUrlId = await Url.findOne({ shorturl: urlId });

        while (checkUrlId === null)

        return urlId;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

async function extractAnalyticsData(req) {

    try{

    const ua = uaParser(req.headers['user-agent']);
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const country = geoip.lookup(ipAddress);
  
    return {
      ip: ipAddress,
      country: country ? country.country : 'Unknown',
      os: ua.os.name,
      browser: ua.browser.name,
      device: ua.device.type,
    }
} catch (erro) {
    console.log(error);
        return false;

}
  }

exports.general_short = async (req, res) => {

    const { longurl } = req.body;

    const urlId = await genrateShortUrl();

    if(!urlId){
        return res.status(400).json({
            success: false,
            error: "Something went wrong, please try again."
        })
    }

    console.log(urlId);

    const url = await Url.create({
        longurl: longurl,
        shorturl: urlId,
    })

    res.status(200).json({
        urlId
    })
};

exports.login_short = async (req, res) => {
    try {

        const { longurl, customUrl } = req.body;

        // check if the customUrl exists in the database

        if (customUrl) {
          const existingLink = await Url.findOne({ customUrl });
          if (existingLink) {
            return res.status(400).json({ error: 'Custom URL already taken' });
          }
        }
    

        if (longurl == null) {
            return res.status(400).json({
                success: false,
                error: "Please enter original url"
            })
        }

        const user = req.user;

        const urlId = await genrateShortUrl();
        
        const url = await Url.create({
            longurl: longurl,
            shorturl: urlId,
            owner: user._id,
            customUrl: customUrl,
            createdAt: Date.now()
        })

        const analytic = await Analytics.create({
            url: url._id,
            user: user._id,
            shortUrl: url.shorturl,
            createdAt: Date.now()
        })
    
        url.analytics = analytic._id;
        await url.save();

        user.urls.push(url._id);
        await user.save();

        console.log(analytic)

        res.status(200).json({
            success: true,
            message: "Url created successfully",
            url
        })
     } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
};


exports.get_Url = async (req, res) =>  {
    try {

    const { shorturl } = req.params;

    if(!shorturl || shorturl.length===0){
        return res.redirect('/');
    }

    const url = await Url.findOne ({
        $or: [
            {shorturl: shorturl},
            {customUrl: shorturl}
        ],
    })
    
    if (url) 
    {
        if(!url.owner){
            return res.redirect(url.longurl);
        }


        const analytic = await Analytics.findById(url.analytics);
        analytic.clicks++;
        const analyticsData = extractAnalyticsData(req);

        analytic.os.push(analyticsData.os);
                
        analytic.browser.push(analyticsData.browser);
        analytic.device.push(analyticsData.device);
        analytic.ip.push(analyticsData.ip);
        analytic.country.push(analyticsData.country);

    await analytic.save();

    
    return res.redirect(url.longurl);

    }


    res.status(404).json({
        error: 'Url not found'
    })

}
catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    })
}
}

exports.getMyUrl = async(req, res) => {

        const user = req.user;
  
    try {
      const history = await Url.find({ owner: user._id }).select("longurl shorturl customUrl createdAt");

      
  
      // Return the links with analytics data
      res.json(history.reverse());
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }

}

exports.viewUrl = async (req, res) => {
    try{

        const { shorturl } = req.params;
        const user = req.user;

        const url = await Url.findOne({ shorturl, owner: user._id }).populate('analytics');
        if(!url){
            return res.status(404).json({
                success: false,
                error: "Url not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Url fetched successfully",
            url
        })

    }
    catch(error){
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}


// const pageLimit = 6;