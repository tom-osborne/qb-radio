// Fetch and set NOTIFY_CONFIG from client script callback
const fetchNotifyConfig = async () => {
    NOTIFY_CONFIG = await fetchNui("getUIConfig", {}, BrowserMockConfigData);
    if (isEnvBrowser() || DEV_MODE) {
        console.log("Fetched Config:");
        console.dir(NOTIFY_CONFIG);
    }
};

const radioUI = async({ data }) => {
    // Otherwise we process any old MessageEvent with a data property
    if (data?.action !== "notify") return;
    // Make sure we have sucessfully fetched out config properly
    if (!NOTIFY_CONFIG) {
        console.error(
            "The notification config did not load properly, trying again for next time"
        );
        // Lets check again to see if it exists
        await fetchNotifyConfig();
        // If we have a config lets re-run notification with same data, this
        // isn't recursive though.
        if (NOTIFY_CONFIG) return radioUI({ data });
    }
}
$(function() {
    window.addEventListener('message', function(event) {
        if (event.data.type == "open") {
            QBRadio.SlideUp()
        }

        if (event.data.type == "close") {
            QBRadio.SlideDown()
        }

        if (event.data.type == "showActiveTalker") {
            QBRadio.ShowActiveTalker()
        }

        if (event.data.type == "hideActiveTalker") {
            QBRadio.HideActiveTalker()
        }
    });

    document.onkeyup = function (data) {
        if (data.which == 27) { // Escape key
            $.post('https://qb-radio/escape', JSON.stringify({}));
            QBRadio.SlideDown()
        } else if (data.which == 13) { // Enter key
            $.post('https://qb-radio/joinRadio', JSON.stringify({
                channel: $("#channel").val()
            }));
        }
    };
});

QBRadio = {}

$(document).on('click', '#submit', function(e){
    e.preventDefault();

    $.post('https://qb-radio/joinRadio', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#disconnect', function(e){
    e.preventDefault();

    $.post('https://qb-radio/leaveRadio');
});

$(document).on('click', '#volumeUp', function(e){
    e.preventDefault();

    $.post('https://qb-radio/volumeUp', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#volumeDown', function(e){
    e.preventDefault();

    $.post('https://qb-radio/volumeDown', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#decreaseradiochannel', function(e){
    e.preventDefault();

    $.post('https://qb-radio/decreaseradiochannel', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#increaseradiochannel', function(e){
    e.preventDefault();

    $.post('https://qb-radio/increaseradiochannel', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#poweredOff', function(e){
    e.preventDefault();

    $.post('https://qb-radio/poweredOff', JSON.stringify({
        channel: $("#channel").val()
    }));
});

QBRadio.SlideUp = function() {
    $(".container").css("display", "block");
    $(".radio-container").animate({bottom: "6vh",}, 250);
}

QBRadio.SlideDown = function() {
    $(".radio-container").animate({bottom: "-110vh",}, 400, function(){
        $(".container").css("display", "none");
    });
}

QBRadio.ShowActiveTalker = function() {
    console.log("SHOW NUI")
    $("#activeTalker").css("display", "block");
}

QBRadio.HideActiveTalker = function() {
    console.log("HIDE NUI")
    $("#activeTalker").css("display", "none");
}