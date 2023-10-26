import "./reactionbutton.scss";
import { useState, useRef } from "react";
import { updateResults } from "./testform";

enum Status {
  LOCKED = "locked",
  INIT = "init",
  CLICKTOSTART = "clicktostart",
  TESTWAIT = "testwait",
  TESTEARLY = "testearly",
  TESTREACT = "testreact",
  TESTRESULT = "testresult",
}

function Reactiontest(props : {
  locked: boolean;
}) {
  const [currentTestState, setTestState] = useState<Status>(Status.LOCKED);
  let timeout = useRef<ReturnType<typeof setInterval> | null>(null);
  let results = useRef<number[]>([]);
  let prevtime = useRef<number>(0);
  if (!props.locked && currentTestState === Status.LOCKED) {
    setTestState(Status.INIT);
  }
  function buttonHandler() {
    switch (currentTestState) {
      case Status.INIT:
        setTestState(Status.CLICKTOSTART);
        break;
      case Status.CLICKTOSTART:
        setTestState(Status.TESTWAIT);
        timeout.current = setTimeout(() => {
          prevtime.current = Date.now();
          setTestState(Status.TESTREACT);
        }, Math.random() * 4000 + 1000);
        break;
      case Status.TESTWAIT:
        clearTimeout(timeout.current!);
        setTestState(Status.TESTEARLY);
        setTimeout(() => {
          setTestState(Status.CLICKTOSTART);
        }, 2000);
        break;
      case Status.TESTREACT:
        results.current.push(Date.now() - prevtime.current);
        updateResults({ reactiontests: results.current });
        setTestState(Status.TESTRESULT);
        break;
      case Status.TESTRESULT:
        if (results.current.length < 5) {
          setTestState(Status.CLICKTOSTART);
        }
        break;
    }
  }
  function _reactionbuttonText() {
    switch (currentTestState) {
      case Status.LOCKED:
        return <span className="subtletext">Füllen Sie bitte zuerst das Formular aus...</span>;
        case Status.INIT:
          return "Bereit für fünf kurze Reaktionstests?";
      case Status.CLICKTOSTART:
        return (
          <span className="buttontext">
            Diese Fläche <span className="red">wird zuerst rot</span>. Klicken
            Sie dann <span className="red">nicht</span>!
            <br />
            Nach einigen Sekunden{" "}
            <span className="green">wechselt sie zu grün</span>. Klicken Sie
            dann so schnell wie möglich!
            <br />
            <br />
            Wenn Sie weiterklicken, startet der Test...
          </span>
        );
      case Status.TESTWAIT:
        return "Warten auf Grün...";
      case Status.TESTEARLY:
        return "Zu früh!";
      case Status.TESTREACT:
        return "Klick!";
      case Status.TESTRESULT:
        return (
          <span className="buttontext">
            Reaktionszeit:{" "}
            <b>{results.current[results.current.length - 1]} ms</b>
            <br />
            Es bleiben noch <b>
              {5 - results.current.length} Tests
            </b> übrig. <br />
            Klicken Sie weiter, wenn Sie bereit sind...
          </span>
        );
    }
  }
  return (
    <div>
      <label htmlFor="reactionbutton" className="reactionbuttonlabel">
        Reaktionstest
      </label>
      <button
        className={"reactionbutton " + currentTestState}
        onClick={buttonHandler}
        id="reactionbutton"
      >
        {_reactionbuttonText()}
      </button>
    </div>
  );
}

export default Reactiontest;
