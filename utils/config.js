require("dotenv").config();

var environments = {};

environments.staging = {
    'port': 3000,
    'host': 'http://localhost:3000/api/v1/',
    'secret': 'lucifertest',
    'application_name': 'Learnguage',
    'db': 'postgres://postgres:root@localhost:5432/learnguage',
    'sendgrid_api_key': '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',
    'sendgrid_username': 'apikey',
    'sendgrid_from': 'no-reply@learnguagehub.com',
    'twilio_account_sid': 'AC9c5d4bcb7513c9924246a4d35fd71eb0',
    'twilio_auth_token': 'e65a7d93466ccdf179929cc15a30bf31',
    'twilio_messaging_service_sid': '+17472236190',
    'aws_access_key_id': 'AKIATQYSF5TU6FHW7BXG',
    'aws_secret_key': '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',
    'aws_bucket_fname': 'learnguage',
    'platformEncryptionKey': 'ZPUyxiyqGiYyXutHJfG3jTrpnDsh0XqK',
    'database_user': 'postgres',
    'database_host': 'localhost',
    'database': 'learnguage',
    'database_password': '12345',
    'database_port': 5432,
};

environments.production = {
    'port': process.env.port,
    'host': process.env.host,
    'secret': process.env.secret,
    'application_name': process.env.application_name,
    'db': process.env.db,
    'sendgrid_api_key': process.env.sendgrid_api_key,
    'sendgrid_username': process.env.username,
    'sendgrid_from': process.env.sendgrid_from,
    'twilio_account_sid': process.env.twilio_account_sid,
    'twilio_auth_token': process.env.twilio_account_sid,
    'twilio_messaging_service_sid': process.env.twilio_messaging_service_sid,
    'aws_access_key_id': process.env.aws_access_key_id,
    'aws_secret_key': process.env.aws_secret_key,
    'aws_bucket_fname': process.env.aws_bucket_fname,
    'platformEncryptionKey': process.env.platformEncryptionKey
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;