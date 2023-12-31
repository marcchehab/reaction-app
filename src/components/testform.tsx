import Reactionbutton from "./reactionbutton";
import React, { useRef, useState } from "react";
import "./testform.scss";

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
  screenRes: number | null;
};

function Testform() {
  const initFormStatus =
    localStorage["reaction-app"] === undefined
      ? FormStatus.LOCKED
      : FormStatus.DONE;
  const [currentFormState, setFormState] = useState<FormStatus>(initFormStatus);
  const [width, height] = [window.screen.width, window.screen.height];
  const screenRes = Math.min(width, height);
  const formdataRef = useRef<ReactionFormData>({
    gender: null,
    age: null,
    email: null,
    gameHours: null,
    sportHours: null,
    reactiontests: [],
    screenRes: screenRes,
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
      url =
        "https://reactionapp-f88bb-default-rtdb.europe-west1.firebasedatabase.app/testflight.json";
    } else {
      url =
        "https://reactionapp-f88bb-default-rtdb.europe-west1.firebasedatabase.app/results.json";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(formdataRef.current),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      console.log("data submitted");
      setFormState(FormStatus.DONE);
      localStorage["reaction-app"] = FormStatus.DONE;
    });
  }

  const genderHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResults({ gender: e.target.value });
  };

  return (
    <div className="testform">
      <h1>Hello and welcome!</h1>
      <p className="subtletext">
        Thanks for taking <span className="highlight">about one minute</span> of
        your time to take this <span className="highlight">anonymous</span>{" "}
        reaction test!
      </p>
      {currentFormState === FormStatus.DONE && (
        <p className="subtletext green">
          Thanks for having participated in this test!
        </p>
      )}
      <div className="control radios">
        <label htmlFor="gender">Sex</label>
        <br />
        <span>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            onChange={genderHandler}
          />
          <label htmlFor="female">Female</label>
        </span>
        <span>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            onChange={genderHandler}
          />
          <label htmlFor="male">Male</label>
        </span>
      </div>
      <div className="control slider-control">
        <label htmlFor="age">Age</label>
        <p className="output">{age !== null ? age + " years" : ""}</p>
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
      </div>
      <div className="control slider-control">
        <label htmlFor="gameHours">
          How many hours per week do you play computer games?
        </label>
        <p className="output">
          {gameHours !== null ? gameHours + " hours" : ""}
        </p>
        <input
          type="range"
          id="gameHours"
          min="0"
          max="50"
          value={gameHours !== null ? gameHours : "0"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGameHours(Number(e.target.value));
            updateResults({ gameHours: Number(e.target.value) });
            e.target.classList.add("changed");
          }}
        />
      </div>
      <div className="control slider-control">
        <label htmlFor="sportHours">
          How many hours per week do you do sports?
        </label>
        <p className="output">
          {sportHours !== null ? sportHours + " hours" : ""}
        </p>
        <input
          type="range"
          id="sportHours"
          min="0"
          max="20"
          value={sportHours !== null ? sportHours : "0"}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSportHours(Number(e.target.value));
            updateResults({ sportHours: Number(e.target.value) });
            e.target.classList.add("changed");
          }}
        />
      </div>
      <div className="control">
        <label htmlFor="email">
          Email <span className="subtletext">(not required)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="If you're interested in the results, leave your email here..."
          ref={emailRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateResults({ email: e.target.value });
          }}
        />
      </div>
      <div className="spacer-50"></div>
      <Reactionbutton
        formstate={[currentFormState, setFormState]}
        updateresults={updateResults}
      />
      <div className="spacer-150"></div>
    </div>
  );
}

export default Testform;
