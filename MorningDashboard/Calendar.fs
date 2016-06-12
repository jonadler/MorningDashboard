﻿namespace MorningDashboard

open Newtonsoft.Json

module Calendar =
    type CalendarType =
        | Outlook
        | Google
    type BusyStatus =
        | Free
        | Tentative
        | Busy
        | OutOfOffice
    type CustomFunctions = {
        BusyStatus: EWSoftware.PDI.Objects.VEvent -> BusyStatus
        IsAllDay: EWSoftware.PDI.Objects.VEvent -> bool
        }

    type CalendarInfo = {Name: string; Url: string; Type: CalendarType}
    type Instance = {Domain: string; Name: string; StartTime: System.DateTimeOffset; EndTime: System.DateTimeOffset; BusyStatus: BusyStatus; IsAllDay: bool}
    type Calendar = {Name: string; Date: System.DateTime; Instances: Instance seq}
    let calendarCache = SharedCode.makeNewCache<CalendarInfo*System.DateTime,Calendar>()


    let getCustomFunctions (t: CalendarType) =
        let outlookFunctions = 
            let busyStatus (event: EWSoftware.PDI.Objects.VEvent) =
                try match event.CustomProperties.["X-MICROSOFT-CDO-BUSYSTATUS"].Value with
                    | "BUSY" -> Busy
                    | "TENTATIVE" -> Tentative
                    | "FREE" -> Free
                    | "OOF" -> OutOfOffice
                    | _ -> Busy
                with | _ -> Busy
            let isAllDay (event: EWSoftware.PDI.Objects.VEvent) =
                try event.CustomProperties.["X-MICROSOFT-CDO-ALLDAYEVENT"].Value = "TRUE" 
                with | _ -> false
            {CustomFunctions.BusyStatus = busyStatus; IsAllDay = isAllDay}

        let googleFunctions = 
            let busyStatus (event: EWSoftware.PDI.Objects.VEvent) =
                try match event.Status.Value with
                    | "CONFIRMED" -> Busy
                    | "TENTATIVE" -> Tentative
                    | "CANCELLED" -> Free
                    | _ -> Busy
                with | _ -> Busy
            let isAllDay (event: EWSoftware.PDI.Objects.VEvent) = false
            {CustomFunctions.BusyStatus = busyStatus; IsAllDay = isAllDay}
        match t with
        | Outlook -> outlookFunctions
        | Google -> googleFunctions

    let getCalendarInfo (keyFile: string) =
        let getType (s:string) = 
            match s with | "Outlook" -> Outlook | _ -> Google
        keyFile
        |> System.IO.File.ReadAllText
        |> Linq.JObject.Parse
        |> (fun x -> x.["Calendars"])
        |> Seq.map (fun calendar -> {Name = string calendar.["Name"]; Url = string calendar.["Url"]; Type = getType (string calendar.["Type"])})

    let getRawCalendar (calendarUrl: string) =
        let parser = new EWSoftware.PDI.Parser.VCalendarParser()
        do calendarUrl
        |> ((new System.Net.WebClient()).DownloadString)
        |> parser.ParseString
        parser.VCalendar

    let getInstancesInRange (customFunctions: CustomFunctions) (calendarName: string) (calendar: EWSoftware.PDI.Objects.VCalendar) (date: System.DateTime) =
        let dateStartTime = date.Date
        let dateEndTime = date.Date.AddDays(1.0)
        calendar.Events 
        |> Seq.map (fun e -> 
            let eventName = e.Summary.Value
            let busyStatus = customFunctions.BusyStatus e
            let isFlaggedAllDay = customFunctions.IsAllDay e
            e.InstancesBetween(dateStartTime,dateEndTime,true)
            |> Seq.map (fun instance -> 
                            let startTime =  instance.StartDateTime
                            let endTime = instance.EndDateTime
                            let isAllDay = isFlaggedAllDay || (startTime <= dateStartTime  && endTime >= dateEndTime)
                            {Domain= calendarName; Name= eventName; StartTime = System.DateTimeOffset startTime; EndTime = System.DateTimeOffset endTime; 
                                BusyStatus = busyStatus; IsAllDay = isAllDay}
                            )
            |> Seq.filter (fun instance -> instance.StartTime < System.DateTimeOffset dateEndTime && instance.EndTime > System.DateTimeOffset dateStartTime)
            )
        |> Seq.concat
        |> Seq.sortBy (fun instance -> (instance.StartTime, instance.Name))

    let getCalendar (date: System.DateTime) (calendarInfo:CalendarInfo) =
        try
            let customFunctions = getCustomFunctions calendarInfo.Type
            let rawCalendar = getRawCalendar calendarInfo.Url
            let instances = getInstancesInRange customFunctions calendarInfo.Name rawCalendar date
            Some {Calendar.Name = calendarInfo.Name;Instances = instances;Date=date}
        with | _ -> None

    let getCalendarWithCache (date: System.DateTime) (calendarInfo) =
        SharedCode.getFromCache calendarCache (15.0*60.0-5.0) (fun (i,d) -> getCalendar d i) (calendarInfo,date)

    let getCombinedCalendarWithCache (date: System.DateTime) (calendarInfos: CalendarInfo seq) =
        let calendarInstanceSets = 
            calendarInfos
            |> Seq.map (fun cal -> async { return getCalendarWithCache date cal })
            |> Async.Parallel
            |> Async.RunSynchronously
            |> Seq.choose id
            |> Seq.map (fun cal -> (cal.Name,Set.ofSeq cal.Instances))

        let getCalendarsWithInstances (calendarInstanceSets: (string*Set<Instance>) seq) (instance:Instance) =
            let validCalendars = 
                calendarInstanceSets
                |> Seq.map (fun (cal,instances) -> (cal, Set.contains instance instances))
            if Seq.forall snd validCalendars then
                match Seq.length calendarInstanceSets with
                | 0 -> ""
                | 1 -> calendarInstanceSets |> Seq.head |> fst
                | 2 -> "Both"
                | _ -> "All"
            else
                validCalendars
                |> Seq.filter snd
                |> Seq.map fst
                |> SharedCode.formatter
                
        let allInstances = 
            calendarInstanceSets
            |> Seq.map snd
            |> Set.unionMany
            |> Set.map (fun instance -> {instance with Domain = getCalendarsWithInstances calendarInstanceSets instance})
            |> Set.toSeq
            |> Seq.sortBy (fun instance -> (instance.StartTime,instance.EndTime,instance.Domain)) 
        {Name = calendarInfos
                |> Seq.map (fun x -> x.Name) 
                |> Seq.sort 
                |> SharedCode.formatter; 
        Instances = allInstances;
        Date = date}
        
        