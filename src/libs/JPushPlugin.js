/*var a=11;
console.log(a);

var jPush = {};

    jPush.onDeviceReady = function() {
        console.log("JPushPlugin:Device ready!");
        jPush.initiateUI();
    };
    jPush.getRegistrationID = function() {
        if(window.plugins){
            var tags=[];
            var alias="";
            window.plugins.jPushPlugin.setTagsWithAlias(tags, alias, function () {
                // Success callback
                console.log(tags + ' - ' + alias);
            });
            window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
            console.log(onGetRegistrationID);
            var onGetRegistrationID = function(data) {
                try {
                    console.log("JPushPlugin:registrationID is " + data);
                    if (data.length == 0) {
                        var t1 = window.setTimeout(getRegistrationID, 1000);
                    }
                    $("#registrationId").html(data);
                } catch (exception) {
                    console.log(exception);
                }
            };
        }


    };
    jPush.onOpenNotification = function(event) {
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            //alert("open Notification:" + alertContent);
            console.log(alertContent);

            f7.mainView.router.loadPage("/home/");

            //当点击通知栏


        } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
        }
    };

    jPush.initiateUI = function(getRegistrationID) {
        if(window.plugins){
            try {

                window.plugins.jPushPlugin.init();
                window.setTimeout(getRegistrationID, 1000);
                if (device.platform != "Android") {
                    window.plugins.jPushPlugin.setDebugModeFromIos();
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                } else {
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.setStatisticsOpen(true);
                }
            } catch (exception) {
                console.log(exception);
            }

        }

    };

    jPush.openNotificationInAndroidCallback=function(){
        if(window.plugins) {
            window.plugins.jPushPlugin.openNotificationInAndroidCallback(data);

            console.log(data);
            console.log(jPush);
        }
    };



    jPush.onDeviceReady();
    jPush.getRegistrationID();
    jPush.onDeviceReady();
    //jPush.onTagsWithAlias();
    jPush.onOpenNotification();
    jPush.openNotificationInAndroidCallback();
export default jPush;*/


