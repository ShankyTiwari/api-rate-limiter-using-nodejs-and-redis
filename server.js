/**
 * api rate limiter nodejs redis
 * @author Shashank Tiwari
 */

'use strict';

const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');

const routes = require('./routes'); 

class Server{

    constructor(){
        this.port =  process.env.PORT || 4000;
        this.host = `localhost`;
        
        this.app = express();
        this.http = http.Server(this.app);
    }

    appConfig(){        
        this.app.use(
            bodyParser.json()
        );
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
    }
    /* Including app Routes ends*/  

    appExecute(){

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }

}

const app = new Server();
app.appExecute();