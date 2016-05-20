namespace MorningDashboard

open WebSharper
open WebSharper.Sitelets

type EndPoint =
    | [<EndPoint "/">] Home


module Site =
    open WebSharper.Html.Server

    let HomePage =
        let HomePageTemplate =
              Content.Template<list<Element>>("~/Main.html").With("body", id)


        let body = [
                    Div[
                        ClientSide <@ Client.commuteBlock() @>
                        ] -< [Attr.Class "Container"]
                    ]
        Content.WithTemplate HomePageTemplate body

    [<Website>]
    let Main =
        Sitelet.Infer (fun (context:Context<EndPoint>) (endpoint:EndPoint) -> HomePage)