"use strict";

var superagent = require('superagent');
var Promise = require('bluebird');

(function() {

    /**
     * Initializes a new instance of the MailChimpBatch class.
     * @constructor
     */
    var MailChimpBatch = function() {};

    MailChimpBatch.prototype.setDefaultMethod = function(method) {
        this.defaultMethod = method;
        return this;
    };

    MailChimpBatch.prototype.setDefaultPath = function(path) {
        this.defaultPath = path;
        return this;
    };

    MailChimpBatch.prototype.setInstance = function(instance) {
        this.instance = instance;
        return this;
    };

    MailChimpBatch.prototype.add = function(operation) {

        if (!this.operations) {
            this.operations = [];
        }

        if (Array.isArray(operation)) {

            for (var i = 0; i < operation.length; i++) {
                this.add(operation[i]);
            }

            return this;

        }

        if (!operation.method) {
            operation.method = this.defaultMethod;
        }

        if (!operation.path) {
            operation.path = this.defaultPath;
        }

        if (typeof operation.body != 'string') {

            operation.body = JSON.stringify(operation.body);

        }

        this.operations.push(operation);

        return this;

    };

    MailChimpBatch.prototype.send = function() {

        if (!this.operations || this.operations.length == 0) {
            return Promise.reject('No batch operations have been added. Add one by calling .add()');
        }

        return this.instance._request(this.instance.api_key, 'post', 'batches', {
            operations: this.operations
        });

    };



    /**
     * Initializes a new instance of the MailChimp class.
     * @constructor
     */
    var MailChimp = function() {};


    MailChimp.prototype.options = {
        host: 'api.mailchimp.com',
        prefix: '/3.0/',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MailChimp-V3/1.0.0'
        },
        debug: false
    };


    /**
     * base request method
     * @param  {String}  apiKey  The API key
     * @param  {String}  method  The request method
     * @param  {String}  path    The API path
     * @param  {Object}  params  The params to send with the request
     * @return {Promise}
     */
    MailChimp.prototype._request = function(apiKey, method, path, params) {

        var _this = this;

        if (!apiKey) {
            apiKey = this.api_key;
            if (!apiKey) {
                return Promise.reject(new Error('No API key set.'));
            }
        }

        if (!method) {
            return Promise.reject(new Error('No method defined.'));
        }

        if (!path) {
            return Promise.reject(new Error('No path provided.'));
        }

        var requestUrl = this._getApiUrl(apiKey, path);

        return new Promise(function(resolve, reject) {

            if (_this.options.debug) {
                console.log('-- API KEY: ' + apiKey + ' --');
                console.log('-- REQUEST METHOD: ' + method + ' --');
                console.log('-- REQUEST URL: ' + requestUrl + ' --');
                console.log('-- REQUEST PARAMS: --');
                console.log(params ? params : 'no params');
            }

            var headers = _this.options.headers;
            headers.Authorization = 'apikey ' + apiKey;

            superagent
                [method](requestUrl)
                .set(headers)
                .send(params)
                .end(function(error, result) {

                    if (error) {

                        var response = error.response || {};
                        var responseBody = response.body || {};
                        var returnError = new Error(responseBody.detail || '');
                        returnError.type = responseBody.type || '';
                        returnError.title = responseBody.title || '';
                        returnError.status = responseBody.status || '';
                        returnError.instance = responseBody.instance || '';
                        returnError.errors = responseBody.errors || '';

                        return reject(returnError);
                    } else {
                        return resolve(result.body);
                    }

                });
        });
    };


    /**
     * retrieves the correct DC URL for the specified API key and path.
     * @param  {String}  apiKey  The API key
     * @param  {String}  path    The request path
     * @return {String}
     */
    MailChimp.prototype._getApiUrl = function(apiKey, path) {

        var requestUrl;

        var hostPieces = this.options.host.split('.');
        if (hostPieces.length === 3) {
            var dc = 'us1';

            var splitApiKey = apiKey.split('-');
            if (splitApiKey.length === 2) {
                dc = splitApiKey[1];
            }

            requestUrl = 'https://' + dc + '.' + this.options.host + this.options.prefix;

        } else {

            requestUrl = 'https://' + this.options.host + this.options.prefix;

        }

        return requestUrl + path;

    };


    MailChimp.prototype.get = function(path, params) {

        return this._request(this.api_key, 'get', path, params);

    };

    MailChimp.prototype.post = function(path, params) {

        return this._request(this.api_key, 'post', path, params);

    };

    MailChimp.prototype.put = function(path, params) {

        return this._request(this.api_key, 'put', path, params);

    };

    MailChimp.prototype.patch = function(path, params) {

        return this._request(this.api_key, 'patch', path, params);

    };

    MailChimp.prototype.delete = function(path, params) {

        return this._request(this.api_key, 'delete', path, params);

    };



    MailChimp.prototype.setApiKey = function(apiKey) {

        this.api_key = apiKey;
        return this;

    };

    MailChimp.prototype.setDebug = function(bool) {

        this.options.debug = bool ? true : false;
        return this;

    };


    MailChimp.prototype.createBatch = function(path, method) {

        var batch = new MailChimpBatch();

        batch.setDefaultPath(path);
        batch.setDefaultMethod(method);
        batch.setInstance(this);

        return batch;

    };


    module.exports = new MailChimp();

})();