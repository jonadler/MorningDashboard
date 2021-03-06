﻿namespace MorningDashboard

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client


[<JavaScript>]
module Client =
    let emptyTable (message: string) = Table [TR [TD [Text (message)]]] -< [Attr.Class "table"]

    let refreshBlock (id: string) (seconds: int) (initialContents: Element List) (getDataFunction: unit -> Async<('T option)>) (updateBlockFunction: (Element -> ('T -> unit))) = 
        let output = Div initialContents -< [Attr.Id id]     
        let repeater (e:Element) = 
            async {
                let! result = getDataFunction()
                match result with
                | Some x -> 
                    updateBlockFunction e x
                | _ -> ()
                }
            |> Async.Start
        do repeater output
        output |>! OnBeforeRender (fun dummy -> JS.SetInterval (fun () -> (repeater output)) (seconds*1000) |> ignore)

    let commuteBlock() =        
        let updateCommuteBlock (block:Element) (resultCommutes: Server.Commute.Response list) =
            let commuteMiniBlock (result:Server.Commute.Response) = 
                let makeRow (t:Server.Commute.TravelResponse) =
                        let transitMode = 
                            match t.Method with
                            | Server.Commute.TripMethod.Car -> TD [I [Attr.Class "fa fa-car"]]
                            | Server.Commute.TripMethod.Bus x -> TD [I [Attr.Class "fa fa-bus"]; Small [Text (" " + x)]]
                        TR [
                            transitMode -< [Attr.Class "col-md-2"]
                            TD [Small [Text t.Departure]]-< [Attr.Class ("col-md-5" + if t.Accent then " text-warning" else "")]
                            TD [Small [Text t.Arrival]]-< [Attr.Class "col-md-5"]
                            ]
                [
                    Div [H5 [Text result.RouteTitle]  -< [Attr.Class "text-primary"]] -< [Attr.Class "panel-body"];
                        Table (List.map makeRow result.TravelResponses) -< [Attr.Class "table table-condensed"]
                ]

            do block.Clear()
            block.Append 
                (Div (List.append
                            (List.singleton (Div [H4 [Text "Commute" ]] -< [Attr.Class "panel-heading"]))
                            (resultCommutes |> List.map commuteMiniBlock |> List.concat)
                            )
                         -< [Attr.Class "panel panel-default"])
        let getCommuteData = Server.Commute.getBlockData
        refreshBlock "commuteBlock" 5 List.empty<Element> getCommuteData updateCommuteBlock

    let wundergroundBlock() =        
        let updateBlock (block:Element) (result: Server.Wunderground.Response) =
            let forecastElements =
                result.Forecast
                |> List.map (fun forecast ->
                                TR [
                                    TD [Text forecast.Time]
                                    TD [I [Attr.Class ("wi " + forecast.WeatherIcon + if forecast.Accent then " text-warning" else "")]]
                                    TD [Text (forecast.Temperature + "°")]
                                ]
                            )
            let body = 
                [
                Div [H1 [I [Attr.Class ("weather wi " + result.Current.WeatherIcon)]] -< 
                                [Attr.Class ("highlight " + (if result.Current.Accent then "text-warning" else "text-primary"))]] -< [Attr.Class "col-md-5 text-center"]
                Div [   H4 [Text ("Now: " + result.Current.Temperature + "°")] -< [Attr.Class "text-primary"]
                        H4 [Text ("High: " + result.Current.High+ "°")] -< [Attr.Class "text-primary"]
                        H4 [Text ("Low: " + result.Current.Low+ "°")] -< [Attr.Class "text-primary"]
                        ] -< [Attr.Class "col-md-7"]
                ]
            block.Clear()
            block.Append 
                (Div [
                        Div [H4 [Text "Weather"]] -< [Attr.Class "panel-heading"]
                        Div body -< [Attr.Class "panel-body"]
                        Table forecastElements
                            -< [Attr.Class "table table-condensed"]
                        ] -< [Attr.Class "panel panel-default"])
        let getData = Server.Wunderground.getBlockData
        refreshBlock "wundergroundBlock" (60*15) List.empty<Element> getData updateBlock

    let currentTimeBlock() =        
        let updateBlock (block:Element) (result: Server.CurrentTime.Response) =
            block.Clear()
            block.Append 
                (Div[
                        Div [
                                H1 [Text result.Time] -< [Attr.Class "text-primary highlight-small"]
                                H4 [Text result.Weekday] -< [Attr.Class "text-primary"]
                                H4 [Text (result.Month + " " + result.Day)] -< [Attr.Class "text-primary"]
                                ] -< [Attr.Class "panel-body text-center"]  
                        ] -< [Attr.Class "panel panel-default"])
        let getData = Server.CurrentTime.getBlockData
        refreshBlock "currentTimeBlock" 5 List.empty<Element> getData updateBlock

    let calendarBlock() =        
        let updateBlock (block:Element) (result: Server.Calendar.Response) =
            let calendarElements =
                result.Calendars
                |> List.map(fun calendar ->
                        let instanceElements = 
                            calendar.Instances
                            |> List.map (fun instance ->
                                            TR [
                                                TD [Text (instance.Domain)] -< [Attr.Class "col-md-3"]
                                                TD [Text (instance.Event)] -< [Attr.Class "col-md-5"]
                                                TD [Text (instance.Time)] -< [Attr.Class "col-md-4"]
                                            ]
                                        )
                        [
                            Div [H5 [Text calendar.Name] -< [Attr.Class "text-primary"]] -< [Attr.Class "panel-body"];
                            (if List.length calendar.Instances > 0 then
                                Table instanceElements -< [Attr.Class "table table-condensed"]
                            else emptyTable "No events")
                        ]
                    )
                |> List.concat
            block.Clear()
            block.Append 
                (Div
                        (List.append
                            (List.singleton(Div [H4 [Text "Calendar" ]] -< [Attr.Class "panel-heading"]))
                            calendarElements)
                         -< [Attr.Class "panel panel-default"])
        let getData = Server.Calendar.getBlockData
        refreshBlock "calendarBlock" (15*60) List.empty<Element> getData updateBlock

    let twitterBlock() =        
        let updateBlock (block:Element) (result: Server.Twitter.Response) =
            let tweetElements =
                    let tweetElements = 
                        result.Tweets
                        |> List.map (fun tweet ->
                                        TR [
                                            TD [Text (tweet.Username + ": " + tweet.Text)]
                                        ]
                                    )
                    [
                        Div [H5 [Text result.Title] -< [Attr.Class "text-primary"]] -< [Attr.Class "panel-body"];
                        (if List.length tweetElements > 0 then Table tweetElements -< [Attr.Class "table table-condensed"] else emptyTable "No tweets available")
                    ]

            block.Clear()
            block.Append 
                (Div
                        (List.append
                            (List.singleton(Div [H4 [Text "Recent Tweets" ]] -< [Attr.Class "panel-heading"]))
                            tweetElements)
                         -< [Attr.Class "panel panel-default"])
        let getData = Server.Twitter.getBlockData
        refreshBlock "twitterBlock" (10) List.empty<Element> getData updateBlock

    let trafficMapBlock() =
        let getData () =
            async {return Some ()} 
        let initialElements = 
            [
                    Div [
                        Div [H4 [Text "Traffic"]] -< [Attr.Class "panel-heading"]
                        Div [Attr.Id "trafficMap"; Attr.Class "map"]
                    ] -< [Attr.Class "panel panel-default"]
            ]
        let updateBlock (block:Element) (result: unit) =
            do WebSharper.JQuery.JQuery.Of("trafficMap").Ready(JS.Window?createMap("trafficMap")).Ignore
        refreshBlock "trafficMapBlock" (10*60) initialElements getData updateBlock