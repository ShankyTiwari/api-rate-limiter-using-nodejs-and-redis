/**
* api rate limiter nodejs redis
* @author Shashank Tiwari
*/

'use strict';

const rateLimiter = require('./config');
class Routes{

	constructor(app){
       	this.rateLimiter = new rateLimiter(app);
		this.app = app;
	}
	
	appRoutes(){
		this.app.get('/users', this.rateLimiter.usingRemoteAddress(), (request, response) => {
            response.status(200).json('You are welcome here.');
		});
		this.app.get('/user-details/:id', this.rateLimiter.asGetParamter(), (request, response) => {
			response.status(200).json('You are welcome here.');
		});
		this.app.post('/user-details', this.rateLimiter.asPostParamter(), (request, response) => {
			response.status(200).json('You are welcome here.');
		});
		this.app.post('/user-details-multi', this.rateLimiter.multipleConditionLimiter(), (request, response) => {
			response.status(200).json('You are welcome here.');
		});
		this.app.get('/details/:apiKey', this.rateLimiter.checkApiKey(), (request, response) => {
			response.status(200).json('You are welcome here.');
		});
	}

	routesConfig(){
		this.appRoutes();
	}
}
module.exports = Routes;