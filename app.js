'use strict';

require('dotenv').config();

var builder = require('botbuilder');
var restify = require('restify');
var genderClassifierService = require('./genderClassifierService.js');

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`${server.name} listening to ${server.url}`);
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send('Welcome to the Gender Classifier Bot! I can predict your gender base on your height, width and shoe size (by centimeters)!');
        session.sendTyping();
        setTimeout(function () {
            builder.Prompts.text(session, 'What is your Height?');
        }, 2000);
    },
    function (session, results) {
        session.dialogData.height = results.response;
        builder.Prompts.text(session, 'What is your Width?');
    },
    function (session, results) {
        session.dialogData.width = results.response;
        builder.Prompts.text(session, 'What is your Shoe Size?');
    },
    function (session, results) {
        session.dialogData.shoeSize = results.response;
        session.sendTyping();
        genderClassifierService.predict(session.dialogData.height, 
                                        session.dialogData.width, 
                                        session.dialogData.shoeSize).then(function(response){
                                            session.send(`The predicted gender is: ${response}`);
                                        });
        session.endDialog();
    }
]);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});