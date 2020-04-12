import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
const Break = props => {
  return (
    <div id="break-container">
      <div id="break-label">TO REST</div>
      <div
        id="break-length"
        dangerouslySetInnerHTML={{ __html: props.breakLength }}
      ></div>
      <div className="button" id="break-decrement" onClick={props.onClick}>
        rest is for suckers
      </div>
      <div id="break-increment" onClick={props.onClick}>
        party never ends
      </div>
    </div>
  );
};
const Session = props => {
  return (
    <div id="session-container">
      <div id="session-label">TO WORK</div>
      <div
        id="session-length"
        dangerouslySetInnerHTML={{ __html: props.sessionLength }}
      ></div>
      <div id="session-decrement" onClick={props.onClick}>
        just to much for me
      </div>
      <div id="session-increment" onClick={props.onClick}>
        can push harder
      </div>
    </div>
  );
};
const Pomodoro = props => {
  return (
    <div id="pomodoro-container">
      {" "}
      <div
        id="pomodoro"
        /*dangerouslySetInnerHTML={{
          __html: String.fromCodePoint(0x1f345)
        }}*/
        style={{ background: "transparent" }}
      >
        <img
          src="https://res.cloudinary.com/dmujv3o3b/image/upload/v1586523013/tomatoPng.png"
          id="pomodoroPicture"
        ></img>
      </div>
      <div
        id="pomodoro-after"
        style={{
          background: "linear-gradient(to top, red 0% 3%, #20DF20 3% 100%)"
        }}
      ></div>
    </div>
  );
};
const Timer = props => {
  return (
    <div
      id="time-left"
      dangerouslySetInnerHTML={{
        __html: props.toShow
      }}
    ></div>
  );
};
const TimerLabel = props => {
  return (
    <div
      id="timer-label"
      dangerouslySetInnerHTML={{ __html: props.activePhase }}
    ></div>
  );
};
const OnOff = props => {
  return (
    <div
      id="start_stop"
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
    >
      ⏯️
    </div>
  );
};
const Reset = props => {
  return (
    <div id="reset" onClick={props.onClick}>
      reset
    </div>
  );
};
const Audio = props => {
  return <audio id="beep" src={props.audioSource}></audio>;
};
class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      breakTimeLeft: 300,
      sessionTimeLeft: 1500,
      toShow: null,
      startStop: "off",
      timing: null,
      activePhase: "Session"
    };
    this.onClickLength = this.onClickLength.bind(this);
    this.toShowTransformer = this.toShowTransformer.bind(this);
    this.onClickStartStop = this.onClickStartStop.bind(this);
    this.onClickReset = this.onClickReset.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
  }
  onClickLength(e) {
    if (event.target.id === "break-decrement") {
      if (this.state.breakLength === 1) {
        return; //alert("Break's length has to be at least 1 min long");
      } else if (this.state.breakTimeLeft - 60 <= 0) {
        this.setState({ breakTimeLeft: 0 });
      } else {
        let decreasedBreakLength = this.state.breakLength - 1;
        let decreasedBreakTimeLeft = this.state.breakTimeLeft - 60;
        this.setState(state => {
          return {
            breakLength: decreasedBreakLength,
            breakTimeLeft: decreasedBreakTimeLeft
          };
        });
        if (this.state.activePhase === "Break") {
          this.setState(state => {
            return {
              toShow: this.toShowTransformer(state.breakTimeLeft)
            };
          });
        }
      }
    }
    if (event.target.id === "break-increment") {
      if (this.state.breakLength === 60) {
        return; //alert("Are you in your vacation?");
      } else {
        let increasedBreakLength = this.state.breakLength + 1;
        let increasedBreakTimeLeft = this.state.breakTimeLeft + 60;
        this.setState(state => {
          return {
            breakLength: increasedBreakLength,
            breakTimeLeft: increasedBreakTimeLeft
          };
        });
        if (this.state.activePhase === "Break") {
          this.setState(state => {
            return {
              toShow: this.toShowTransformer(state.breakTimeLeft)
            };
          });
        }
      }
    }
    if (event.target.id === "session-decrement") {
      if (this.state.sessionLength === 1) {
        return; //alert("Session's length has to be at least 1 min long");
      } else if (this.state.sessionTimeLeft - 60 <= 0) {
        this.setState({ sessionTimeLeft: 0 });
      } else {
        let decreasedSessionLength = this.state.sessionLength - 1;
        let decreasedSessionTimeLeft = this.state.sessionTimeLeft - 60;
        this.setState(state => {
          return {
            sessionLength: decreasedSessionLength,
            sessionTimeLeft: decreasedSessionTimeLeft
          };
        });
        if (this.state.activePhase === "Session") {
          this.setState(state => {
            return {
              toShow: this.toShowTransformer(state.sessionTimeLeft)
            };
          });
        }
      }
    }
    if (event.target.id === "session-increment") {
      if (this.state.sessionLength === 60) {
        return; //alert("Working as much without breaks decreases efficiency");
      } else {
        let increasedSessionLength = this.state.sessionLength + 1;
        let increasedSessionTimeLeft = this.state.sessionTimeLeft + 60;
        this.setState(state => {
          return {
            sessionLength: increasedSessionLength,
            sessionTimeLeft: increasedSessionTimeLeft
          };
        });
        if (this.state.activePhase === "Session") {
          this.setState(state => {
            return {
              toShow: this.toShowTransformer(state.sessionTimeLeft)
            };
          });
        }
      }
    }
  }
  onClickStartStop() {
    let timing;
    let timerActivator = () => {
      let decreasedSessionTimeLeft;
      let decreasedBreakTimeLeft;
      if (this.state.activePhase === "Session") {
        if (this.state.sessionTimeLeft === 0) {
          //let breakTimeLeft = this.state.breakTimeLeft - 1; /*the commented out code in this method provides avoiding of added seconds (one after the start push and other one on each phase change), but ast provides tests non-passing */
          this.setState({
            activePhase: "Break",
            //breakTimeLeft: breakTimeLeft,
            sessionTimeLeft: this.state.sessionLength * 60,
            toShow: this.toShowTransformer(
              this.state.breakTimeLeft /*breakTimeLeft*/
            )
          });
          document.getElementById("beep").play();
          return;
        } else {
          decreasedSessionTimeLeft = this.state.sessionTimeLeft - 1;
          let colorLine =
            82 -
            (79 / this.state.sessionLength / 60) *
              decreasedSessionTimeLeft; /*this.state.sessionTimeLeft*/
          this.setState({
            sessionTimeLeft: decreasedSessionTimeLeft,
            toShow: this.toShowTransformer(decreasedSessionTimeLeft)
          });
          let background = `linear-gradient(to top, red 0% ${colorLine}%, #20DF20 ${colorLine}% 100%)`;
          document.getElementById(
            "pomodoro-after"
          ).style.background = background;
          console.log(
            document.getElementById("pomodoro-after").style.background
          );
        }
      } else {
        if (this.state.breakTimeLeft === 0) {
          //let sessionTimeLeft = this.state.sessionTimeLeft - 1;
          this.setState({
            activePhase: "Session",
            //sessionTimeLeft: sessionTimeLeft,
            breakTimeLeft: this.state.breakLength * 60,
            toShow: this.toShowTransformer(
              this.state.sessionTimeLeft /*sessionTimeLeft*/
            )
          });
          document.getElementById("beep").play();
          return;
        } else {
          decreasedBreakTimeLeft = this.state.breakTimeLeft - 1;
          let colorLine =
            (79 / this.state.breakLength / 60) * decreasedBreakTimeLeft +
            3; /*this.state.breakTimeLeft*/
          this.setState({
            breakTimeLeft: decreasedBreakTimeLeft,
            toShow: this.toShowTransformer(decreasedBreakTimeLeft)
          });
          let background = `linear-gradient(to top, red 0% ${colorLine}%, #20DF20 ${colorLine}% 100%)`;
          document.getElementById(
            "pomodoro-after"
          ).style.background = background;
        }
      }
    };
    if (this.state.startStop === "off") {
      //timerActivator();
      timing = setInterval(timerActivator, 1000);
      this.setState({ startStop: "on", timing: timing });
      document.getElementById("break-container").style.display = "none";
      document.getElementById("session-container").style.display = "none";
      document.getElementById("timer-label").style.display = "none";
      document.getElementById("time-left").style.display = "none";
      document.getElementById("reset").style.display = "none";
      document.getElementById("start_stop").style.border = "none";
      document.getElementById("start_stop").style.opacity = ".2";
    } else {
      this.setState({ startStop: "off" });
      timing = clearInterval(this.state.timing);
      document.getElementById("break-container").style.display = "block";
      document.getElementById("session-container").style.display = "block";
      document.getElementById("timer-label").style.display = "block";
      document.getElementById("time-left").style.display = "block";
      document.getElementById("reset").style.display = "flex";
      document.getElementById("start_stop").style.border =
        "solid 1px rgb(7, 54, 15)";
      document.getElementById("start_stop").style.borderRadius = "5px";
      document.getElementById("start_stop").style.opacity = "1";
    }
  }
  toShowTransformer(timestamp) {
    let sessionTimeLeft = timestamp;
    let sessionTimeLeftMinutes = Math.floor(sessionTimeLeft / 60);
    let sessionTimeLeftSeconds = sessionTimeLeft % 60;
    let toShowSessionMinutes = sessionTimeLeftMinutes
      .toString()
      .padStart(2, "0");
    let toShowSessionSeconds = sessionTimeLeftSeconds
      .toString()
      .padStart(2, "0");
    return `${toShowSessionMinutes}:${toShowSessionSeconds}`;
  }
  onClickReset() {
    clearInterval(this.state.timing);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      breakTimeLeft: 300,
      sessionTimeLeft: 1500,
      timing: null,
      activePhase: "Session",
      startStop: "off",
      toShow: this.toShowTransformer(1500)
    });
    document.getElementById("beep").load();
    document.getElementById("pomodoro-after").style.background =
      "linear-gradient(to top, red 0% 3%, #20DF20 3% 100%)";
  }
  componentDidMount() {
    if (this.state.activePhase === "Session") {
      this.setState({
        toShow: this.toShowTransformer(this.state.sessionTimeLeft)
      });
    } else {
      this.setState({
        toShow: this.toShowTransformer(this.state.breakTimeLeft)
      });
    }
  }
  onMouseOver() {
    document.getElementById("break-container").style.display = "block";
    document.getElementById("session-container").style.display = "block";
    document.getElementById("timer-label").style.display = "block";
    document.getElementById("time-left").style.display = "block";
    document.getElementById("reset").style.display = "flex";
    document.getElementById("start_stop").style.border =
      "solid 1px rgb(7, 54, 15)";
    document.getElementById("start_stop").style.borderRadius = "5px";
    document.getElementById("start_stop").style.opacity = "1";
  }
  render() {
    return (
      <div id="pomodoro-project">
        <Break
          breakLength={this.state.breakLength}
          onClick={this.onClickLength}
        />
        <Session
          sessionLength={this.state.sessionLength}
          onClick={this.onClickLength}
        />
        <Pomodoro onMouseOver={this.onMouseOver} />
        <TimerLabel activePhase={this.state.activePhase} />
        <Timer toShow={this.state.toShow} />
        <OnOff onClick={this.onClickStartStop} onMouseOver={this.onMouseOver} />
        <Reset onClick={this.onClickReset} />
        <Audio audioSource="https://res.cloudinary.com/dmujv3o3b/video/upload/v1584535807/beep-for-pomodoro.wav" />
        <p id="attribution">
          Icon made by Freepik from www.flaticon.com <br />
          &#169; Designed and coded by Sergii Popravka
        </p>
      </div>
    );
  }
}
ReactDOM.render(
  <PomodoroClock />,
  document.getElementById("for-react-content")
);
