Overview
=============================================
A NodeJS API client for [v3 of the MailChimp API](http://developer.mailchimp.com/documentation/mailchimp/reference/overview/). This is not an official package. There is no official package. Don't ask me why there isn't an official package.

Forked from: [mailchimp-v3](https://bitbucket.org/recaptureio/mailchimp-v3)

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

//to retrieve current lists
//http://developer.mailchimp.com/documentation/mailchimp/reference/lists/#read-get_lists

mailchimp
  .get('lists')
  .then(function(lists){
    console.log(lists);
  })
  .catch(function(error){
    console.log(error);
  });
```

In that example I am doing a request to 'lists', which is defined here: http://developer.mailchimp.com/documentation/mailchimp/reference/lists/#read-get_lists.
To make a request to any of the API endpoints (http://developer.mailchimp.com/documentation/mailchimp/reference/overview/), simply pass in that endpoint (minus the leading slash).

To do a POST request, use the .post() method, with the second parameter being the data you want to pass. The data object that you pass in should be set up exactly as the endpoint will expect it to be.

```
//to create a new campaign
//http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/#create-post_campaigns

mailchimp
  .post('campaigns', {
    type       : 'regular',
    recipients : {
      list_id  : 'YOUR-LIST-ID-HERE'
    },
    settings   : {
      subject_line : 'Dis tha subject line',
      from_name    : 'Thomas Edison',
      reply_to     : 'tom@lightbulbs.com'
    }
  })
  .then(function(result){
    console.log(result);
  })
  .catch(function(error){
    console.log(error);
  });
```

To do a PUT request, use the .put() method, with the second parameter being the data you want to pass.

To do a PATCH request, use the .put() method, with the second parameter being the data you want to pass.

To do a DELETE request, use the .delete() method.


###Batches

http://developer.mailchimp.com/documentation/mailchimp/reference/batches/

V3 of the MailChimp API includes support for batches, which work really well. You can batch things two different ways with this wrapper:

1: Use the default .post() method to pass the operations

```
//to create some new merge fields in your list
//http://developer.mailchimp.com/documentation/mailchimp/reference/lists/merge-fields/

mailchimp
  .post('batches', {
    operations : [
      {
        method : 'POST',
        path   : '/lists/YOUR-LIST-ID-HERE/merge-fields',
        body   : JSON.stringify({
          name : 'MERGETIZAG1',
          type : 'string'
        })
      }, {
        method : 'POST',
        path   : '/lists/YOUR-LIST-ID-HERE/merge-fields',
        body   : JSON.stringify({
          name : 'MERGETIZAG2',
          type : 'string'
        })
      }, {
        method : 'POST',
        path   : '/lists/YOUR-LIST-ID-HERE/merge-fields',
        body   : JSON.stringify({
          name : 'MERGETIZAG3',
          type : 'string'
        })
      }
    ]
  })
  .then(function(result){
    console.log(result);
  })
  .catch(function(error){
    console.log(error);
  });
```

MailChimp requires the body of each operation be a string, thus the JSON.stringify();


2: Use the batch object creator to simplify the process a bit

```
//to susbcribe some unfortunate email addresses to your list
//http://developer.mailchimp.com/documentation/mailchimp/reference/lists/members/
var batch = mailchimp.createBatch('lists/YOUR-LIST-ID-HERE/members', 'POST');

var batches = [
  {
    body: {
      status        : 'subscribed',
      email_address : 'steve@jobs.com'
    }
  }, {
    body: {
      status        : 'subscribed',
      email_address : 'tom@lightbulbs.com'
    }
  }, {
    body: {
      status        : 'subscribed',
      email_address : 'powder@puff.com'
    }
  }
];

batch
  .add(batches)
  .add({
    body: {
      status        : 'subscribed',
      email_address : 'joe@dirt.com'
    }
  })
  .send()
  .then(function(result){
    console.log(result);
  })
  .catch(function(error){
    console.log(error);
  });
```

You do not need to JSON.stringify() the body using this method. The wrapper will do it for you, if what you pass in is not a string.

batch.add() can take either an array of operations, or a single operation. When you create a batch by calling createBatch(), you can optionally pass in a path and method so you don't have to define it for every single batch operation. If you pass in a path and method, you can set a different path or method for a specific batch operation if you need to. 

Full documentation is coming soon. Be glad I even did this bro.

---