$(document).on("click", "#speak", init);

function init() {

    // TODO: RECOGNIZE SPEECH

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
        window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const color = event.results[0][0].transcript;
        $("#query").val(color);
        $("#submit").click();
        console.log(`Confidence: ${event.results[0][0].confidence}`);
    };

}



$(document).on("click", "#submit", send);

function send() {

    var text = $("#query").val();

    if (text == "") {

        alert("Write something!");

    } else {

        $("#output").prepend("<br />");
        $("#output").prepend("[😀] " + text);
        $("#query").val("");

        $.ajax({
            url: 'https://code.schoolofdesign.ca/api/openai/v1/chat/completions',
            crossDomain: true,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                'model': 'gpt-4o-mini',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are my expert advisor specialized in music. Only speak to me in English, and keep the response to five sentences max.'
                    },
                    {
                        'role': 'user',
                        'content': text
                    },
                    {
                        'role': 'assistant',
                        'content': 'Refer to the following conversation. ' + $("#output").text()
                    }
                ]
            })
        }).done(function (response) {

            var reply = response.choices[0].message.content;

            $("#output").prepend("<br />");
            $("#output").prepend("[🤖] " + reply);

            // TODO: SYNTHESIZE SPEECH

            const synth = window.speechSynthesis;
            const utterThis = new SpeechSynthesisUtterance(reply);
            utterThis.pitch = 1;
            utterThis.rate = 1;
            synth.speak(utterThis);



        });


    }
}