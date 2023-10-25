import Reactionbutton from "./reactionbutton";
import { useState } from "react";

function Testform() {
  const [currentTestState, setTestState] = useState(0);
  return (
    <div>
      <Reactionbutton />
    </div>
  );
}

export default Testform;
