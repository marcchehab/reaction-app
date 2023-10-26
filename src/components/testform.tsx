import Reactionbutton from "./reactionbutton";
import React, { useRef, useState } from "react";
import "./testform.scss";

console.log(process.env.NODE_ENV);

export enum FormStatus {
  LOCKED = "locked",
  INIT = "init",
  CLICKTOSTART = "clicktostart",
  TESTWAIT = "testwait",
  TESTEARLY = "testearly",
  TESTREACT = "testreact",
  TESTRESULT = "testresult",
  DONE = "done",
}
export type ReactionFormData = {
  gender: string | null;
  age: number | null;
  email: string | null;
  gameHours: number | null;
  sportHours: number | null;
  reactiontests: number[] | null;
};

function Testform() {
  const [currentFormState, setFormState] = useState<FormStatus>(
    FormStatus.LOCKED
  );

  const formdataRef = useRef<ReactionFormData>({
    gender: null,
    age: null,
    email: null,
    gameHours: null,
    sportHours: null,
    reactiontests: [],
  });

  const [gameHours, setGameHours] = React.useState(null as number | null);
  const [sportHours, setSportHours] = React.useState(null as number | null);
  const [age, setAge] = React.useState(null as number | null);
  const emailRef = useRef<HTMLInputElement>(null);

  /**
   * Updates global formdata object incrementally and calls submitData() when all fields are filled including 5 results
   *
   * @param newdata
   */
  function updateResults(newdata: any) {
    formdataRef.current = { ...formdataRef.current, ...newdata };
    if (
      formdataRef.current.gender !== null &&
      formdataRef.current.age !== null &&
      formdataRef.current.gameHours !== null &&
      formdataRef.current.sportHours !== null
    ) {
      setFormState(FormStatus.INIT);
    }
    if (newdata.reactiontests !== undefined) {
      if (newdata.reactiontests.length === 5) {
        submitData();
      }
    }
  }

  function submitData() {
    console.log("submitting data");
    let url = "";
    if (process.env.NODE_ENV === "development") {
      url = "https://reactionapp-f88bb-default-rtdb.europe-west1.firebasedatabase.app/testflight.json";
    } else {
      url = "https://reactionapp-f88bb-default-rtdb.europe-west1.firebasedatabase.app/results.json";
    }
    fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify(formdataRef.current),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      console.log("data submitted");
      setFormState(FormStatus.DONE);
    });
  }

  const genderHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResults({ gender: e.target.value });
  };

  return (
    <div className="testform">
      <h1>Hallo! Herzlichen Dank!</h1>
      <p className="subtletext">
        ...dass Du Dir <span className="highlight">eine Minute</span> Zeit
        nimmst, mir für ein Biomedizin-Modul zu helfen und diesen{" "}
        <span className="highlight">anonymen</span> Reaktionstest zu machen.
      </p>
      <div className="control">
        <input
          type="radio"
          id="female"
          name="gender"
          value="female"
          onChange={genderHandler}
        />
        <label htmlFor="female">Weiblich</label>
        <input
          type="radio"
          id="male"
          name="gender"
          value="male"
          onChange={genderHandler}
        />
        <label htmlFor="male">Männlich</label>
        <input
          type="radio"
          id="other"
          name="gender"
          value="other"
          onChange={genderHandler}
        />
        <label htmlFor="other">Andere</label>
      </div>

      <div className="control slider-control">
        <label htmlFor="age">Alter</label>
        <br />
        <input
          type="range"
          id="age"
          min="0"
          max="100"
          value={age !== null ? age : "0"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAge(Number(e.target.value));
            updateResults({ age: Number(e.target.value) });
            e.target.classList.add("changed");
          }}
        />
        <span>{age !== null ? age + " Jahre" : ""}</span>
      </div>

      <div className="control slider-control">
        <label htmlFor="gameHours">
          Wie viele Stunden in der Woche spielst Du Computerspiele?
        </label>
        <br />
        <input
          type="range"
          id="gameHours"
          min="0"
          max="60"
          value={gameHours !== null ? gameHours : "0"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGameHours(Number(e.target.value));
            updateResults({ gameHours: Number(e.target.value) });
            e.target.classList.add("changed");
          }}
        />
        <span>{gameHours !== null ? gameHours + " Stunden" : ""}</span>
      </div>

      <div className="control slider-control">
        <label htmlFor="sportHours">
          Wie viele Stunden pro Woche treibst Du Sport?
        </label>
        <input
          type="range"
          id="sportHours"
          min="0"
          max="60"
          value={sportHours !== null ? sportHours : "0"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSportHours(Number(e.target.value));
            updateResults({ sportHours: Number(e.target.value) });
            e.target.classList.add("changed");
          }}
        />
        <span>{sportHours !== null ? sportHours + " Stunden" : ""}</span>
      </div>

      <div className="control">
        <label htmlFor="email">
          E-Mail <span className="subtletext">(freiwillig)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="E-Mail, falls Du meine Arbeit lesen möchtest."
          ref={emailRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateResults({ email: e.target.value });
          }}
        />
      </div>
      <Reactionbutton
        formstate={[currentFormState, setFormState]}
        updateresults={updateResults}
      />
      <div id="reponse"></div>
    </div>
  );
}

export default Testform;
