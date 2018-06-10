/**
 * api rate limiter nodejs redis
 * @author Shashank Tiwari
 */

const client = require('./redis-database');

class Limiter{

    constructor(app){
        this.limiter = require('express-limiter')(app, client);
    }

    /**
     * For IP only
     */
    usingRemoteAddress() {
        return this.limiter({
            path: '/api/action',
            method: 'get',
            lookup: ['connection.remoteAddress'],
            total: 5,
            expire: 1000 * 60 * 60,
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }

    /**
     * For get request paramter
     */
    asGetParamter() {
        return this.limiter({
            path: '/user-details/:id',
            method: 'get',
            lookup: ['params.id'],
            total: 5,
            expire: 1000 * 60 * 60, 
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }

    /**
     * For post request paramter
     */
    asPostParamter() {
        return this.limiter({
            path: '/user-details-multi/',
            method: 'post',
            lookup: ['body.id' , 'connection.remoteAddress'],
            total: 5,
            expire: 1000 * 60 * 60,
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }
    
    /**
     * For post request paramter and with some specific IP
     */
    multipleConditionLimiter() {
        return this.limiter({
            path: '/user-details/',
            method: 'post',
            lookup: ['body.id'],
            total: 5,
            expire: 1000 * 60 * 60,
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }

    /**
     * For API key values
     */
    checkApiKey() {
        return this.limiter({
            path: '/details/',
            method: 'get',
            lookup: async (request, response, opts, next) => {
                try {
                    const validKeyResult = await this.isValidApiKey(request.params.apiKey);
                    if (validKeyResult) {
                        opts.lookup = 'params.apiKey'
                        opts.total = 10
                    } else {
                        opts.lookup = 'connection.remoteAddress'
                        opts.total = 5
                    }
                } catch (error) {
                    opts.lookup = 'connection.remoteAddress'
                    opts.total = 5
                }
                return next()
            },
            total: 5,
            expire: 1000 * 60 * 60,
            onRateLimited: function (request, response, next) {
                response.status(429).json('You are not welcome here, Rate limit exceeded');
            }
        });
    }

    isValidApiKey(apiKey) {
        /**
         * Here based on `apiKey` you should rreturn true or false.
         *`apiKey` can be compared with any api key stored in database.
         */
        return new Promise( (resolve, reject) => {
            1 ? resolve(true) : reject(false);
        });
    }
}

module.exports = Limiter;