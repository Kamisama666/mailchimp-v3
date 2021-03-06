var mailchimp = require('../index.js');

mailchimp.setApiKey('YOUR-API-KEY-HERE');
//mailchimp.setDebug(true);

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
  .send()
  .then(function(result){
    console.log(result);
  })
  .catch(function(error){
    console.log(error);
  });