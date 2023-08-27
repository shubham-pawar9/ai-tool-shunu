import React, { useEffect, useRef, useState } from "react";
import data from "./JsonFile/data.json";
import audioFile from "../Audio/start.mp3";

const Main = () => {
  const [transcript, setTranscript] = useState("");
  const [jsonData, getJsonData] = useState(data);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [date, setDate] = useState(() => new Date().toLocaleDateString());
  const [dynamicState, setDynamicState] = useState({
    time: time,
    date: date,
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
  const dynamicRef = useRef();
  useEffect(() => {
    dynamicRef.current = dynamicState;
    console.log(dynamicState["date"]);
  }, [dynamicState]);

  const handleChange = () => {
    const audio = new Audio(audioFile);
    audio.play();
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript.toLowerCase();
      console.log(currentTranscript);
      jsonData &&
        jsonData.map((val) => {
          if (val.command.includes(currentTranscript)) {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices[4];
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
                window.open(val.openUrl, "_blank"); // Open URL in a new tab
              }
            }
          }
          return null; // You need to return something from the map function
        });
    };
    recognition.start();
  };

  return (
    <>
      <button className="accessJarvis" onClick={handleChange}>
        Jarvis Here
      </button>
      <p>Transcript: {transcript}</p>
      <p>
        {date}:{time}
      </p>
    </>
  );
};

export default Main;
