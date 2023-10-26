import "./reactionbutton.scss";
import { useRef } from "react";
import { FormStatus, ReactionFormData } from "./testform";

function Reactiontest(props : {
  formstate: [FormStatus, React.Dispatch<React.SetStateAction<FormStatus>>];
  updateresults: (newdata: Partial<ReactionFormData>) => void;
}) {
  const [currentFormState, setFormState] = props.formstate;
  let timeout = useRef<ReturnType<typeof setInterval> | null>(null);
  let results = useRef<number[]>([]);
  let prevtime = useRef<number>(0);
  function buttonHandler() {
    switch (currentFormState) {
      case FormStatus.INIT:
        setFormState(FormStatus.CLICKTOSTART);
        break;
      case FormStatus.CLICKTOSTART:
        setFormState(FormStatus.TESTWAIT);
        timeout.current = setTimeout(() => {
          prevtime.current = Date.now();
          setFormState(FormStatus.TESTREACT);
        }, Math.random() * 4000 + 1000);
        break;
      case FormStatus.TESTWAIT:
        clearTimeout(timeout.current!);
        setFormState(FormStatus.TESTEARLY);
        setTimeout(() => {
          setFormState(FormStatus.CLICKTOSTART);
        }, 2000);
        break;
      case FormStatus.TESTREACT:
        results.current.push(Date.now() - prevtime.current);
        props.updateresults({ reactiontests: results.current });
        setFormState(FormStatus.TESTRESULT);
        break;
      case FormStatus.TESTRESULT:
        if (results.current.length < 5) {
          setFormState(FormStatus.CLICKTOSTART);
        } else {
          setFormState(FormStatus.DONE);
        }
        break;
    }
  }
  function _reactionbuttonText() {
    switch (currentFormState) {
      case FormStatus.LOCKED:
        return <span className="subtletext">Füllen Sie bitte zuerst das Formular aus...</span>;
        case FormStatus.INIT:
          return "Bereit für fünf kurze Reaktionstests?";
      case FormStatus.CLICKTOSTART:
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
      case FormStatus.TESTWAIT:
        return "Warten auf Grün...";
      case FormStatus.TESTEARLY:
        return "Zu früh!";
      case FormStatus.TESTREACT:
        return "Klick!";
      case FormStatus.TESTRESULT:
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
      case FormStatus.DONE:
        return "Herzlichen Dank für Ihre Teilnahme!";
    }
  }
  return (
    <div>
      <label htmlFor="reactionbutton" className="reactionbuttonlabel">
        Reaktionstest
      </label>
      <button
        className={"reactionbutton " + currentFormState}
        onClick={buttonHandler}
        id="reactionbutton"
      >
        {_reactionbuttonText()}
      </button>
    </div>
  );
}

export default Reactiontest;
