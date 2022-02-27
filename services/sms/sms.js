const path = require("path");
const config = require(path.resolve("utils/config"))
const twilio = require("twilio")(config.twilio_account_sid, config.twilio_auth_token),
 VoiceResponse = require("twilio").twiml.VoiceResponse;


exports.text = async (to, message) =>{

	return await twilio.messages.create({
		from: config.twilio_messaging_service_sid,
		to: to,
		body: message
	});
}

/**
	*@params {to - reciever's number, message - the message to send}
*/ 
exports.call = async (to, message) => {
	
	return await twilio.calls.create({
        from: config.twilio_messaging_service_sid,
        to: to,
        twiml: `<Response> 
                    <Gather input="dtmf" timeout="3" numDigits="1" language="en-US" action="http://73d30ec95d80.ngrok.io/api/v1/call" method="POST"> 
                        <Say> ${message} </Say> 
                    </Gather>
                    <Say> ${message} </Say> 
                    <Say> ${message} </Say> 
                </Response>`
    })
}
