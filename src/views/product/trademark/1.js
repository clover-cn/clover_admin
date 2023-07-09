var axios = require('axios');

var config = {
   method: 'get',
   url: 'https://www.xiaeke.com/benmao/index.php/Home/MorningTree/gainEnergy?user_id=141595&energy_type=0&energy=10',
   headers: { 
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', 
      'Accept': '*/*', 
      'Host': 'www.xiaeke.com', 
      'Connection': 'keep-alive'
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});