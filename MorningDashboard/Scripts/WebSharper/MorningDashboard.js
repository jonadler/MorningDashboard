(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,List,Html,Client,Operators,Tags,Attr,Seq,MorningDashboard,Client1,Remoting,AjaxRemotingProvider,T,Concurrency,setInterval,jQuery,window;
 Runtime.Define(Global,{
  MorningDashboard:{
   Client:{
    calendarBlock:function()
    {
     var updateBlock,getData;
     updateBlock=function(block)
     {
      return function(result)
      {
       var x,mapping,lists,calendarElements,arg106,arg107,arg108;
       x=result.Calendars;
       mapping=function(calendar)
       {
        var x1,mapping1,instanceElements,arg104,arg105,x5;
        x1=calendar.Instances;
        mapping1=function(instance)
        {
         var arg10,arg101,x2,arg102,x3,arg103,x4;
         x2=instance.Domain;
         arg101=List.ofArray([Tags.Tags().text(x2)]);
         x3=instance.Event;
         arg102=List.ofArray([Tags.Tags().text(x3)]);
         x4=instance.Time;
         arg103=List.ofArray([Tags.Tags().text(x4)]);
         arg10=List.ofArray([Operators.add(Tags.Tags().NewTag("td",arg101),List.ofArray([Attr.Attr().NewAttr("class","col-md-3")])),Operators.add(Tags.Tags().NewTag("td",arg102),List.ofArray([Attr.Attr().NewAttr("class","col-md-5")])),Operators.add(Tags.Tags().NewTag("td",arg103),List.ofArray([Attr.Attr().NewAttr("class","col-md-4")]))]);
         return Tags.Tags().NewTag("tr",arg10);
        };
        instanceElements=List.map(mapping1,x1);
        x5=calendar.Name;
        arg105=List.ofArray([Tags.Tags().text(x5)]);
        arg104=List.ofArray([Operators.add(Tags.Tags().NewTag("h5",arg105),List.ofArray([Attr.Attr().NewAttr("class","text-primary")]))]);
        return List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg104),List.ofArray([Attr.Attr().NewAttr("class","panel-body")])),Seq.length(calendar.Instances)>0?Operators.add(Tags.Tags().NewTag("table",instanceElements),List.ofArray([Attr.Attr().NewAttr("class","table table-condensed")])):Client1.emptyTable("No events")]);
       };
       lists=List.map(mapping,x);
       calendarElements=List.concat(lists);
       block["HtmlProvider@33"].Clear(block.get_Body());
       arg108=List.ofArray([Tags.Tags().text("Calendar")]);
       arg107=List.ofArray([Tags.Tags().NewTag("h4",arg108)]);
       arg106=List.append(List.singleton(Operators.add(Tags.Tags().NewTag("div",arg107),List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]))),calendarElements);
       return block.AppendI(Operators.add(Tags.Tags().NewTag("div",arg106),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")])));
      };
     };
     getData=function()
     {
      return AjaxRemotingProvider.Async("MorningDashboard:1",[]);
     };
     return Client1.refreshBlock("calendarBlock",15*60,Runtime.New(T,{
      $:0
     }),getData,updateBlock);
    },
    commuteBlock:function()
    {
     var updateCommuteBlock,getCommuteData;
     updateCommuteBlock=function(block)
     {
      return function(resultCommutes)
      {
       var commuteMiniBlock,arg10d,arg10e,arg10f,lists;
       commuteMiniBlock=function(result)
       {
        var makeRow,arg10a,arg10b,x4,arg10c;
        makeRow=function(t)
        {
         var matchValue,transitMode,_,x,arg10,arg101,arg102,x1,arg103,arg104,arg105,arg106,arg107,x2,arg108,arg109,x3;
         matchValue=t.Method;
         if(matchValue.$==0)
          {
           x=matchValue.$0;
           arg101=List.ofArray([Attr.Attr().NewAttr("class","fa fa-bus")]);
           x1=" "+x;
           arg102=List.ofArray([Tags.Tags().text(x1)]);
           arg10=List.ofArray([Tags.Tags().NewTag("i",arg101),Tags.Tags().NewTag("small",arg102)]);
           _=Tags.Tags().NewTag("td",arg10);
          }
         else
          {
           arg104=List.ofArray([Attr.Attr().NewAttr("class","fa fa-car")]);
           arg103=List.ofArray([Tags.Tags().NewTag("i",arg104)]);
           _=Tags.Tags().NewTag("td",arg103);
          }
         transitMode=_;
         x2=t.Departure;
         arg107=List.ofArray([Tags.Tags().text(x2)]);
         arg106=List.ofArray([Tags.Tags().NewTag("small",arg107)]);
         x3=t.Arrival;
         arg109=List.ofArray([Tags.Tags().text(x3)]);
         arg108=List.ofArray([Tags.Tags().NewTag("small",arg109)]);
         arg105=List.ofArray([Operators.add(transitMode,List.ofArray([Attr.Attr().NewAttr("class","col-md-2")])),Operators.add(Tags.Tags().NewTag("td",arg106),List.ofArray([Attr.Attr().NewAttr("class","col-md-5"+(t.Accent?" text-warning":""))])),Operators.add(Tags.Tags().NewTag("td",arg108),List.ofArray([Attr.Attr().NewAttr("class","col-md-5")]))]);
         return Tags.Tags().NewTag("tr",arg105);
        };
        x4=result.RouteTitle;
        arg10b=List.ofArray([Tags.Tags().text(x4)]);
        arg10a=List.ofArray([Operators.add(Tags.Tags().NewTag("h5",arg10b),List.ofArray([Attr.Attr().NewAttr("class","text-primary")]))]);
        arg10c=List.map(makeRow,result.TravelResponses);
        return List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10a),List.ofArray([Attr.Attr().NewAttr("class","panel-body")])),Operators.add(Tags.Tags().NewTag("table",arg10c),List.ofArray([Attr.Attr().NewAttr("class","table table-condensed")]))]);
       };
       block["HtmlProvider@33"].Clear(block.get_Body());
       arg10f=List.ofArray([Tags.Tags().text("Commute")]);
       arg10e=List.ofArray([Tags.Tags().NewTag("h4",arg10f)]);
       lists=List.map(commuteMiniBlock,resultCommutes);
       arg10d=List.append(List.singleton(Operators.add(Tags.Tags().NewTag("div",arg10e),List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]))),List.concat(lists));
       return block.AppendI(Operators.add(Tags.Tags().NewTag("div",arg10d),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")])));
      };
     };
     getCommuteData=function()
     {
      return AjaxRemotingProvider.Async("MorningDashboard:4",[]);
     };
     return Client1.refreshBlock("commuteBlock",5,Runtime.New(T,{
      $:0
     }),getCommuteData,updateCommuteBlock);
    },
    currentTimeBlock:function()
    {
     var updateBlock,getData;
     updateBlock=function(block)
     {
      return function(result)
      {
       var arg10,arg101,arg102,x,arg103,x1,arg104,x2;
       block["HtmlProvider@33"].Clear(block.get_Body());
       x=result.Time;
       arg102=List.ofArray([Tags.Tags().text(x)]);
       x1=result.Weekday;
       arg103=List.ofArray([Tags.Tags().text(x1)]);
       x2=result.Month+" "+result.Day;
       arg104=List.ofArray([Tags.Tags().text(x2)]);
       arg101=List.ofArray([Operators.add(Tags.Tags().NewTag("h1",arg102),List.ofArray([Attr.Attr().NewAttr("class","text-primary highlight-small")])),Operators.add(Tags.Tags().NewTag("h4",arg103),List.ofArray([Attr.Attr().NewAttr("class","text-primary")])),Operators.add(Tags.Tags().NewTag("h4",arg104),List.ofArray([Attr.Attr().NewAttr("class","text-primary")]))]);
       arg10=List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg101),List.ofArray([Attr.Attr().NewAttr("class","panel-body text-center")]))]);
       return block.AppendI(Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")])));
      };
     };
     getData=function()
     {
      return AjaxRemotingProvider.Async("MorningDashboard:2",[]);
     };
     return Client1.refreshBlock("currentTimeBlock",5,Runtime.New(T,{
      $:0
     }),getData,updateBlock);
    },
    emptyTable:function(message)
    {
     var arg10,arg101,arg102;
     arg102=List.ofArray([Tags.Tags().text(message)]);
     arg101=List.ofArray([Tags.Tags().NewTag("td",arg102)]);
     arg10=List.ofArray([Tags.Tags().NewTag("tr",arg101)]);
     return Operators.add(Tags.Tags().NewTag("table",arg10),List.ofArray([Attr.Attr().NewAttr("class","table")]));
    },
    refreshBlock:function(id,seconds,initialContents,getDataFunction,updateBlockFunction)
    {
     var output,repeater,f;
     output=Operators.add(Tags.Tags().NewTag("div",initialContents),List.ofArray([Attr.Attr().NewAttr("id",id)]));
     repeater=function(e)
     {
      var arg00;
      arg00=Concurrency.Delay(function()
      {
       return Concurrency.Bind(getDataFunction(null),function(_arg1)
       {
        var _,x;
        if(_arg1.$==1)
         {
          x=_arg1.$0;
          (updateBlockFunction(e))(x);
          _=Concurrency.Return(null);
         }
        else
         {
          _=Concurrency.Return(null);
         }
        return _;
       });
      });
      return Concurrency.Start(arg00,{
       $:0
      });
     };
     repeater(output);
     f=function()
     {
      var value;
      value=setInterval(function()
      {
       return repeater(output);
      },seconds*1000);
      return;
     };
     Operators.OnBeforeRender(f,output);
     return output;
    },
    trafficMapBlock:function()
    {
     var getData,arg10,arg101,arg102,arg103;
     getData=function()
     {
      return Concurrency.Delay(function()
      {
       return Concurrency.Return({
        $:1,
        $0:null
       });
      });
     };
     arg102=List.ofArray([Tags.Tags().text("Traffic")]);
     arg101=List.ofArray([Tags.Tags().NewTag("h4",arg102)]);
     arg103=List.ofArray([Attr.Attr().NewAttr("id","trafficMap"),Attr.Attr().NewAttr("class","map")]);
     arg10=List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg101),List.ofArray([Attr.Attr().NewAttr("class","panel-heading")])),Tags.Tags().NewTag("div",arg103)]);
     return Client1.refreshBlock("trafficMapBlock",10*60,List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")]))]),getData,function()
     {
      return function()
      {
       return jQuery("trafficMap").ready(window.createMap.call(null,"trafficMap"));
      };
     });
    },
    twitterBlock:function()
    {
     var updateBlock,getData;
     updateBlock=function(block)
     {
      return function(result)
      {
       var x,mapping,tweetElements,tweetElements1,arg102,arg103,x2,arg104,arg105,arg106;
       x=result.Tweets;
       mapping=function(tweet)
       {
        var arg10,arg101,x1;
        x1=tweet.Username+": "+tweet.Text;
        arg101=List.ofArray([Tags.Tags().text(x1)]);
        arg10=List.ofArray([Tags.Tags().NewTag("td",arg101)]);
        return Tags.Tags().NewTag("tr",arg10);
       };
       tweetElements=List.map(mapping,x);
       x2=result.Title;
       arg103=List.ofArray([Tags.Tags().text(x2)]);
       arg102=List.ofArray([Operators.add(Tags.Tags().NewTag("h5",arg103),List.ofArray([Attr.Attr().NewAttr("class","text-primary")]))]);
       tweetElements1=List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg102),List.ofArray([Attr.Attr().NewAttr("class","panel-body")])),Seq.length(tweetElements)>0?Operators.add(Tags.Tags().NewTag("table",tweetElements),List.ofArray([Attr.Attr().NewAttr("class","table table-condensed")])):Client1.emptyTable("No tweets available")]);
       block["HtmlProvider@33"].Clear(block.get_Body());
       arg106=List.ofArray([Tags.Tags().text("Recent Tweets")]);
       arg105=List.ofArray([Tags.Tags().NewTag("h4",arg106)]);
       arg104=List.append(List.singleton(Operators.add(Tags.Tags().NewTag("div",arg105),List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]))),tweetElements1);
       return block.AppendI(Operators.add(Tags.Tags().NewTag("div",arg104),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")])));
      };
     };
     getData=function()
     {
      return AjaxRemotingProvider.Async("MorningDashboard:0",[]);
     };
     return Client1.refreshBlock("twitterBlock",10,Runtime.New(T,{
      $:0
     }),getData,updateBlock);
    },
    wundergroundBlock:function()
    {
     var updateBlock,getData;
     updateBlock=function(block)
     {
      return function(result)
      {
       var x,mapping,forecastElements,body,arg105,arg106,arg107,arg108,arg109,arg10a,x3,arg10b,x4,arg10c,x5,arg10d,arg10e,arg10f;
       x=result.Forecast;
       mapping=function(forecast)
       {
        var arg10,arg101,x1,arg102,arg103,arg104,x2;
        x1=forecast.Time;
        arg101=List.ofArray([Tags.Tags().text(x1)]);
        arg103=List.ofArray([Attr.Attr().NewAttr("class","wi "+forecast.WeatherIcon+(forecast.Accent?" text-warning":""))]);
        arg102=List.ofArray([Tags.Tags().NewTag("i",arg103)]);
        x2=forecast.Temperature+"°";
        arg104=List.ofArray([Tags.Tags().text(x2)]);
        arg10=List.ofArray([Tags.Tags().NewTag("td",arg101),Tags.Tags().NewTag("td",arg102),Tags.Tags().NewTag("td",arg104)]);
        return Tags.Tags().NewTag("tr",arg10);
       };
       forecastElements=List.map(mapping,x);
       arg108="weather wi "+result.Current.WeatherIcon;
       arg107=List.ofArray([Attr.Attr().NewAttr("class",arg108)]);
       arg106=List.ofArray([Tags.Tags().NewTag("i",arg107)]);
       arg105=List.ofArray([Operators.add(Tags.Tags().NewTag("h1",arg106),List.ofArray([Attr.Attr().NewAttr("class","highlight "+(result.Current.Accent?"text-warning":"text-primary"))]))]);
       x3="Now: "+result.Current.Temperature+"°";
       arg10a=List.ofArray([Tags.Tags().text(x3)]);
       x4="High: "+result.Current.High+"°";
       arg10b=List.ofArray([Tags.Tags().text(x4)]);
       x5="Low: "+result.Current.Low+"°";
       arg10c=List.ofArray([Tags.Tags().text(x5)]);
       arg109=List.ofArray([Operators.add(Tags.Tags().NewTag("h4",arg10a),List.ofArray([Attr.Attr().NewAttr("class","text-primary")])),Operators.add(Tags.Tags().NewTag("h4",arg10b),List.ofArray([Attr.Attr().NewAttr("class","text-primary")])),Operators.add(Tags.Tags().NewTag("h4",arg10c),List.ofArray([Attr.Attr().NewAttr("class","text-primary")]))]);
       body=List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg105),List.ofArray([Attr.Attr().NewAttr("class","col-md-5 text-center")])),Operators.add(Tags.Tags().NewTag("div",arg109),List.ofArray([Attr.Attr().NewAttr("class","col-md-7")]))]);
       block["HtmlProvider@33"].Clear(block.get_Body());
       arg10f=List.ofArray([Tags.Tags().text("Weather")]);
       arg10e=List.ofArray([Tags.Tags().NewTag("h4",arg10f)]);
       arg10d=List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10e),List.ofArray([Attr.Attr().NewAttr("class","panel-heading")])),Operators.add(Tags.Tags().NewTag("div",body),List.ofArray([Attr.Attr().NewAttr("class","panel-body")])),Operators.add(Tags.Tags().NewTag("table",forecastElements),List.ofArray([Attr.Attr().NewAttr("class","table table-condensed")]))]);
       return block.AppendI(Operators.add(Tags.Tags().NewTag("div",arg10d),List.ofArray([Attr.Attr().NewAttr("class","panel panel-default")])));
      };
     };
     getData=function()
     {
      return AjaxRemotingProvider.Async("MorningDashboard:3",[]);
     };
     return Client1.refreshBlock("wundergroundBlock",60*15,Runtime.New(T,{
      $:0
     }),getData,updateBlock);
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Operators=Runtime.Safe(Client.Operators);
  Tags=Runtime.Safe(Client.Tags);
  Attr=Runtime.Safe(Client.Attr);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  MorningDashboard=Runtime.Safe(Global.MorningDashboard);
  Client1=Runtime.Safe(MorningDashboard.Client);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  T=Runtime.Safe(List.T);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  setInterval=Runtime.Safe(Global.setInterval);
  jQuery=Runtime.Safe(Global.jQuery);
  return window=Runtime.Safe(Global.window);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());
