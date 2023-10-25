import "./reactionbutton.css";
import { useState } from "react";
import React from "react";

let prevtime: number;
let reactionbutton_content: string;

function Reactiontest() {

  function buttonHandler() {
    if (currentTestState === 0) {
      // Stopped, so start
      prevtime = Date.now();
      setTestState(1);
      console.log("started!")
    } 
    else if (currentTestState === 1) {
      // Running, so stop
      console.log(Date.now() - prevtime);
      prevtime = 0;
      setTestState(0);
    }
  }

  return (
    <button className="reactionbutton" onClick={buttonHandler}>
      {reactionbutton_content}
    </button>
  );
}

export default Reactiontest;
