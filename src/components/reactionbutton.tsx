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
        return <span className="subtletext">Please fill out the form first...</span>;
        case FormStatus.INIT:
          return "Ready for five short reaction tests?";
      case FormStatus.CLICKTOSTART:
        return (
          <span className="buttontext">
            Don't click too early! This area <span className="red">will first turn red</span>.
            <br />
            After a few seconds,{" "} <span className="green">it will turn green</span>. That's when you should click as fast as you can!
            <br />
            <br />
            Ready? Click to start the {results.current.length > 0 ? "next ": ""}test...
          </span>
        );
      case FormStatus.TESTWAIT:
        return "Wait for it to turn green...";
      case FormStatus.TESTEARLY:
        return "Too early!";
      case FormStatus.TESTREACT:
        return "Click!";
      case FormStatus.TESTRESULT:
        return (
          <span className="buttontext">
            Reaction time: <b>{results.current[results.current.length - 1]} ms</b>
            <br />
            {5 - results.current.length} tests remain.<br />
            Click when you are ready...
          </span>
        );
      case FormStatus.DONE:
        return "Thanks for participating!";
    }
  }
  return (
    <div>
      <label htmlFor="reactionbutton" className="reactionbuttonlabel">
        Reaction test
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
