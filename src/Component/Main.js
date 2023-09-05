import React, { useEffect, useRef, useState } from "react";
import data from "./JsonFile/data.json";

const Main = () => {
  const [transcript, setTranscript] = useState("");
  const [jsonData, getJsonData] = useState(data);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [date, setDate] = useState(() => new Date().toLocaleDateString());
  const [todaysDay, setTodaysDay] = useState(() => {
    const today = new Date();
    const options = { weekday: "long" }; // You can use 'short' or 'narrow' for different formats
    return today.toLocaleDateString(undefined, options);
  });
  const [dynamicState, setDynamicState] = useState({
    time: time,
    date: date,
    day: todaysDay,
  });

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000 * 60); // Update time every minute

    const dateInterval = setInterval(() => {
      setDate(new Date().toLocaleDateString());
    }, 1000 * 60 * 60); // Update date every hour

    return () => {
      clearInterval(timeInterval);
      clearInterval(dateInterval);
    };
  }, []);

  const handleChange = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript.toLowerCase();
      console.log(currentTranscript);
      const match = jsonData.find((val) => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices[0];
        if (val.command.includes(currentTranscript)) {
          if (val.command.includes(val.dynamicCommand)) {
            setTranscript(dynamicState[val.dynamicCommand]);
            if (selectedVoice) {
              const dynamicVoiceOutPut = new SpeechSynthesisUtterance(
                dynamicState[val.dynamicCommand]
              );
              dynamicVoiceOutPut.voice = selectedVoice;
              window.speechSynthesis.speak(dynamicVoiceOutPut);
            }
          } else {
            setTranscript(val.outPut);
            if (selectedVoice) {
              const voiceOutPut = new SpeechSynthesisUtterance(val.outPut);
              voiceOutPut.voice = selectedVoice;
              window.speechSynthesis.speak(voiceOutPut);
            }
            if (val.openUrl) {
              window.open(val.openUrl, "_blank");
            }
          }
          return true;
        }
        return false;
      });

      if (!match) {
        const dynamicVoiceOutPut = new SpeechSynthesisUtterance(
          "Sorry I dont Know"
        );
        window.speechSynthesis.speak(dynamicVoiceOutPut);
      }
    };

    recognition.start();
  };

  return (
    <>
      <button className="accessJarvis" onClick={handleChange}>
        <img
          className="clickBtnImage"
          src={process.env.PUBLIC_URL + "/images/a.gif"}
        />
      </button>
      <p>{transcript}</p>
    </>
  );
};

export default Main;
