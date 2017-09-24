'use strict';

var request = require('request-promise');

module.exports = {
    predict: predict
}

// consume Azure Machine Learning Web Service
// you can get all the information you need to consume the web service you've created
// with the command: az ml service usage realtime -i YOUR_SERVICE_ID
function predict(height, width, shoeSize) {
    const options = {
        method: 'POST',
        uri: 'http://<WEB_SERVICE_IP_ADDRESS>:80/api/v1/service/<SERVICE_NAME>/score',
        json: true,
        body: {
            input_df: [{
                height: height,
                width: width,
                shoe_size: shoeSize
            }]
        },
        headers: {
            'Authorization': 'Bearer <BEARER_KEY>',
            'Content-Type': 'application/json'
        }
    }

    return request(options);
}