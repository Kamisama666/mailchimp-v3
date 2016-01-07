Overview
=============================================
A NodeJS API client for [v3 of the MailChimp API](http://developer.mailchimp.com/documentation/mailchimp/reference/overview/). This is not an official package. There is no official package. Don't ask me why there isn't an official package.


###Usage
This can be installed via our [npm package](https://npmjs.org/package/mailchimp-v3) using:
```
$ npm install mailchimp-v3
```

This wrapper uses promises by way of Bluebird, and the underlying transport library is Superagent because why not.

This wrapper basically does all the busy work for you, so you can make basic requests really easily, like this:

```
var mailchimp = require('mailchimp-v3');
mailchimp.setApiKey('YOUR-API-KEY');
mailchimp
  .get('lists')
  .then(function(lists){
    console.log(lists);
  })
  .catch(function(error){
    console.log(error);
  });
```


---