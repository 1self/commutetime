if (Meteor.isClient) {
  var config = {
        appId: "app-id-13dfd847c362ca3bf2edc269b36d3a84",
        appSecret: "app-secret-10a610485d080ee9c8480f5907150d9840ccdfb7797148949fb61cfee92bdf05",
        "appName": "co.1self.commuteTime",
        "appVersion": "0.0.1"
    };

  var lib1self = new Lib1self(config, Meteor.settings.public.env1self);

  Meteor.startup(function () {
        var isStreamRegistered = function () {
            return window.localStorage.streamId !== undefined;
        };

        var storeStreamDetails = function (stream) {
            window.localStorage.streamId = stream.streamid;
            window.localStorage.readToken = stream.readToken;
            window.localStorage.writeToken = stream.writeToken;
        };

        if (!isStreamRegistered()) {
            console.info("registering stream.");
            lib1self.registerStream(function (err, stream) {
                storeStreamDetails(stream);
            });
        }
    });

  Template.logging.events({
        'click #logActivity': function () {
            var commuteTimeInput = $("input[name='commuteTime']");
            var commuteTimeEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["self", "report"],
                "actionTags": ["commute", "travel"],
                "properties": {
                    "duration": parseInt(commuteTimeInput.val() * 60)
                }
            };
            
            lib1self.sendEvent(commuteTimeEvent, window.localStorage.streamId, window.localStorage.writeToken, function(){});
            commuteTimeInput.val("");
            console.log("Event sent:");
            console.log(commuteTimeEvent)
        }
    });

  Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });

  Template.selectVisualizations.events({
        'click #commuteTimeViz': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["self", "report"])
                .actionTags(["commute", "travel"])
                .sum("duration")
                .barChart()
                .backgroundColor("84c341")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });
}


