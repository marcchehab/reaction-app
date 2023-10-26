import Reactionbutton from "./reactionbutton";
import React, { useRef } from "react";
import "./testform.scss";

type ReactionFormData = {
  gender: string | null;
  email: string | null;
  gameHours: number | null;
  sportHours: number;
  reactiontests: number[] | null;
};

let formdata: ReactionFormData = {
  gender: null,
  email: null,
  gameHours: null,
  sportHours: 0,
  reactiontests: [],
};

export function updateResults(newdata: any) {
  console.log("updating results");
  console.log(newdata);
  formdata = { ...formdata, ...newdata };
}

function Testform() {
  const [gameHours, setGameHours] = React.useState(null as number | null);
  const [sportHours, setSportHours] = React.useState(0);
  const [gender, setGender] = React.useState(null as string | null);
  const emailRef = useRef<HTMLInputElement>(null);

  const genderHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value);
  };

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateResults({
      gender: gender,
      email: emailRef.current?.value,
      gameHours: gameHours,
      sportHours: sportHours,
    });

    // props.onAddMeetup(meetupData);
  }

  return (
    <div className="testform">
      <form onSubmit={submitHandler}>
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

        <div className="control">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            placeholder="E-Mail, falls Du meine Arbeit lesen möchtest."
            ref={emailRef}
          />
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
              e.target.classList.add("changed");
            }}
          />
          <span>{sportHours !== null ? sportHours + " Stunden" : ""}</span>
        </div>
        <Reactionbutton />
        <div id="reponse"></div>
      </form>
    </div>
  );
}

export default Testform;
//
// https://script.google.com/macros/s/AKfycbybcaKcgAscph_dDSg71WrDymuAggux4dweGAcRfLoeRhsmHfvUf59O4Txj4Crxx4am/exec
