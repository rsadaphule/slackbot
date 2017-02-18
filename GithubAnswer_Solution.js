var Bot = require('slackbots');
var request = require('request');

//settings
var settings = {

     token: '<PUT SLACK TOKEN HERE>',
     name: 'funbot'
};

var channel='leads' ;

var bot = new Bot(settings);

bot.on('start', function(){
               
               bot.postMessageToChannel(channel, 'Hello Channel. I am successfuly connected');

              }
     );


bot.on('message',  function(message){
                 
            if(message.type === 'message' && Boolean(message.text))
            {
            	console.log(message.channel);
            	if(typeof message.channel === 'string'  && message.channel[0] === 'C')
            	{
            		console.log(message.text.toLowerCase());
            		if(message.text.toLowerCase().indexOf('@u3zpp1aav') > -1 )
            		{
            			var command = message.text.toLowerCase();
            			var commandType = getCommandType(command);
            			switch(commandType)
            			{
            				case 'drawchart':
            								   console.log('attempting to get chart answer');
                                               var answer = getChartAnswer(command);
                                               bot.postMessageToChannel(channel, answer);
            				                   break;
            				case 'showgitstats':
            								   console.log('attempting to show git stats answer');
                                                getGitStatsAnswer(command);
                                               
            				                   break;
            				default:
                                     bot.postMessageToChannel(channel, "Hey there ! welcome to bot world");
                                     break;

            			}
            			
            		}
            		
            	}
            }
               

     }); 


 function getCommandType(command)    
 {
    if(command.indexOf('draw chart')>-1)  
    	return "drawchart";
    if(command.indexOf('show github top contributor stats')>-1)  
    	return "showgitstats";


 }


 function getChartAnswer(command)
 {
      //command : '@funbot draw chart type:pi data:{60,40,20} legends:{USA,UK,Russia}';
      var answer = "";
      var data = command.split(/ /i);
      var chartType = data[3].split(/:/i)[1];
      switch(chartType)
      {
          case 'pi':
                    chartType = 'p3';
                    break; 
          case 'line':
                    chartType = 'lc';
                    break; 
          case 'bar':
                    chartType = 'bvg';
                    break; 

      }
      console.log('chartType is ' + chartType);
      var chartData = data[4].split(/:/i)[1].replace('{','').replace('}','');
      console.log('chartData is ' + chartData);
      var legends = data[5].split(/:/i)[1].replace('{','').replace('}','').replace(/,/gi,'|');
	  console.log('legends is ' + legends);
      var urlFormat = 'https://chart.googleapis.com/chart?cht={0}&chs=250x100&chd=t:{1}&chl={2}';

      answer = urlFormat.replace('{0}',chartType).replace('{1}', chartData).replace('{2}', legends);
      console.log('answer is ' + answer);
      //Chart URL: https://chart.googleapis.com/chart?cht=p3&chs=250x100&chd=t:60,40,20&chl=USA|UK|Russia    

      return answer;

 }

 var options = {
       url: 'https://api.github.com/repos/{0}/contributors',
       headers: {
       	    'User-Agent':'request'
       }
 };

 
 

 function getGitStatsAnswer(command)
 {
      //command : '@funbot show github top contributor stats repo:facebook/stats';
      var answer = "";
      var data = command.split(/ /i);
      console.log("data is " + data);
      var repo = data[6].split(/:/i)[1];
      console.log("repo is " + repo);
      console.log("inside git answer") ;
      console.log("url before " + options.url );
      var localUrl = options.url.replace('{0}', repo);
      console.log("url after " + localUrl );

      options = {
       url: localUrl,
       headers: {
       	    'User-Agent':'request'
                }
       };

      request(options, function(error, response, body)
                {
                	 console.log(response) // Show the HTML for the Google homepage. 
				    var profile = JSON.parse(response.body);
				    //var profile = response;
				    console.log("profile2 " + profile);
				    var cntr=0;
				    for (var myKey in profile)
				    { 
				    	console.log(profile[myKey].avatar_url, profile[myKey].contributions,profile[myKey].login); 
				        var st = 'Name-{0} Contributions-{1}  image- {2}';
				        st = st.replace('{0}', profile[myKey].login).replace('{1}',profile[myKey].contributions).replace('{2}',profile[myKey].avatar_url) ;    
				    	console.log(st);
				    	bot.postMessageToChannel(channel, st);
				    	cntr++;
				    	if(cntr >= 5)
				    	{
				    	  break;
				    	}
				    }

                }

      	);



     
      

 }