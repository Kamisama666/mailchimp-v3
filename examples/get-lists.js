var mailchimp = require('../index.js');

mailchimp.setApiKey('YOUR-API-KEY-HERE');
//mailchimp.setDebug(true);

mailchimp
  .get('lists')
  .then(function(data){
    console.log(data);
  }).catch(function(error){
    console.log(error);
  });
