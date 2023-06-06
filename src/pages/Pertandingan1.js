import React, { useEffect, useRef, useState } from "react"
import { getMatchesData } from "../scripts/matchControllers"
import { getTeamsData } from "../scripts/teamControllers"
import Navbar from "./Navbar"

const Content = ({
    match,
    teamA,
    teamB,
}) => {
  
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [time, setTime] = useState(0)
  const [timestamps, setTimestamps] = useState([])
  const [pointsTeamA, setPointsTeamA] = useState(0)
  const [pointsTeamB, setPointsTeamB] = useState(0)
  const [checkpointsTeamA, setCheckpointsTeamA] = useState(0)
  const [checkpointsTeamB, setCheckpointsTeamB] = useState(0)
  const [retriesTeamA, setRetriesTeamA] = useState(0)
  const [retriesTeamB, setRetriesTeamB] = useState(0)
  const [scoresTeamA, setScoresTeamA] = useState(0)
  const [scoresTeamB, setScoresTeamB] = useState(0)
  const matchConfig = {
    scorePerPoint: 5,
    scorePerRetry: -0.5,
    maxCheckpoints: 4,
    maxPoints: 6,
    maxElapsedTime: 10000
  }
  const hotkeys = {
    startStop: "Space",
    reset: "KeyR",
    checkpointA: "KeyA",
    pointA: "KeyS",
    retryA: "KeyD",
    checkpointB: "KeyJ",
    pointB: "KeyK",
    retryB: "KeyL",
  }

  useEffect(() => {
    const checkpointCount = timestamps.reduce((count, timestamp) => timestamp.type === 'checkpoint' && timestamp.team === "A" ? count+1 : count, 0)
    const pointCount = timestamps.reduce((count, timestamp) => timestamp.type === 'point' && timestamp.team === "A"  ? count+1 : count, 0)
    const retryCount = timestamps.reduce((count, timestamp) => timestamp.type === 'retry' && timestamp.team === "A"  ? count+1 : count, 0)
    setCheckpointsTeamA(checkpointCount)
    setPointsTeamA(pointCount)
    setRetriesTeamA(retryCount)

  }, [timestamps])

  useEffect(() => {
    const calculatedScore = (pointsTeamA * matchConfig.scorePerPoint) + (retriesTeamA * matchConfig.scorePerRetry)
    setScoresTeamA(calculatedScore)

  }, [pointsTeamA, pointsTeamB, retriesTeamA, retriesTeamB])

    return (
      <div className="w-screen h-screen overflow-scroll relative">
        <div className="w-full justify-center flex text-gray-700 h-20 fixed top-0">
          <div className="text-5xl bg-red-600 text-white flex items-center justify-center font-bold w-1/3 text-center">
            {teamA.name}
          </div>
          <Stopwatch 
            isRunning={isRunning}
            time={time}
            pointsTeamA={pointsTeamA}
            pointsTeamB={pointsTeamB}
            checkpointsTeamA={checkpointsTeamA}
            checkpointsTeamB={checkpointsTeamB}
            matchConfig={matchConfig}
            hotkeys={hotkeys}
            setIsRunning={setIsRunning}
            setIsFinished={setIsFinished}
            setTime={setTime}
            setTimestamps={setTimestamps}
          />
          <div className="text-5xl bg-blue-400 text-white flex items-center justify-center font-bold w-1/3 text-center">
            {teamB.name}
          </div>
        </div>
        <div className="h-full w-full flex justify-center py-32 -translate-y-6 scale-90">
          {isFinished ? (
            <div className="bg-gray-200 h-full w-full">
              
            </div>) : (<DroidCamFeed />)}
        </div>
        <div className="w-full h-44 flex fixed bottom-0">
          <div className="bg-gray-200 w-1/3 z-10 h-full border-t-8 border-gray-300 flex">
            <div className=" w-1/3 h-full bg-red-600 flex items-center justify-center">
                <div className="text-white text-7xl font-black">75</div>
            </div>
            <div className="w-2/3 h-full flex flex-col">
              <div className="px-4 h-1/6">Checkpoints</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
              <div className="px-4 h-1/6">Points</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
              <div className="px-4 h-1/6">Retries</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 w-1/3 z-10 h-full">
            <Timestamps timestamps={timestamps}/>
          </div>
          <div className="bg-gray-200 w-1/3 z-10 h-full border-t-8 border-gray-300 flex">
            <div className="w-2/3 h-full flex flex-col items-end">
              <div className="px-4 h-1/6">Checkpoints</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
              <div className="px-4 h-1/6">Points</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
              <div className="px-4 h-1/6">Retries</div>
              <div className="px-4 h-1/6 w-3/4">
                <div className="bg-gray-50 rounded-full h-4"></div>
              </div>
            </div>
            <div className=" w-1/3 h-full bg-blue-600 flex items-center justify-center">
                <div className="text-white text-7xl font-black">75</div>
            </div>
          </div>
        </div>
      </div>
    )
}

const Stopwatch = ({
  isRunning,
  time,
  pointsTeamA,
  pointsTeamB,
  checkpointsTeamA,
  checkpointsTeamB,
  matchConfig,
  hotkeys,
  setIsRunning,
  setTime,
  setTimestamps,
  setIsFinished
}) => {

  useEffect(() => {
    let timer = null;
    if (isRunning && time < matchConfig.maxElapsedTime && (checkpointsTeamA < matchConfig.maxCheckpoints || checkpointsTeamB < matchConfig.maxCheckpoints)) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, time, checkpointsTeamA, checkpointsTeamB]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.code)
      if (event.code === hotkeys.startStop && event.target === document.body) {
        event.preventDefault();
        if (!isRunning && checkpointsTeamA < matchConfig.maxCheckpoints && checkpointsTeamB < matchConfig.maxCheckpoints && time < matchConfig.maxElapsedTime) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      } else if (event.code === hotkeys.checkpointA && event.target === document.body) {
        event.preventDefault();
        if (isRunning && (checkpointsTeamA < matchConfig.maxCheckpoints)) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"A", type:'checkpoint', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.checkpointB && event.target === document.body) {
        event.preventDefault();
        if (isRunning && (checkpointsTeamB < matchConfig.maxCheckpoints)) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"B", type:'checkpoint', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.pointA && event.target === document.body) {
        event.preventDefault();
        if (isRunning && pointsTeamA < matchConfig.maxPoints) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"A", type:'point', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.pointB && event.target === document.body) {
        event.preventDefault();
        if (isRunning && pointsTeamB < matchConfig.maxPoints) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"B", type:'point', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.retryA && event.target === document.body) {
        event.preventDefault();
        if (isRunning) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"A", type:'retry', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.retryB && event.target === document.body) {
        event.preventDefault();
        if (isRunning) {
          setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            {team:"B", type:'retry', time:formatTime(time)},
          ]);
        }
      } else if (event.code === hotkeys.reset && event.target === document.body) {
        event.preventDefault();
        handleReset();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, time, checkpointsTeamA, checkpointsTeamB]);

  useEffect(() => {
    if ((checkpointsTeamA === matchConfig.maxCheckpoints && checkpointsTeamB === matchConfig.maxCheckpoints) || time >= matchConfig.maxElapsedTime) {
      setIsRunning(false);
      setIsFinished(true)
    }
  }, [checkpointsTeamA, checkpointsTeamB, time]);

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setTimestamps([])
    setIsFinished(false)
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;
    return `${minutes}.${seconds < 10 ? "0" : ""}${seconds}:${
      milliseconds < 100 ? "0" : ""
    }${milliseconds}`;
  };

  return (
    <div className="z-10 w-1/3 flex justify-center items-center h-24 bg-yellow-300">
      <div className="text-7xl font-bold tracking-widest">{formatTime(time)}</div>
      {isRunning}
    </div>
  )
}

const DroidCamFeed = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream
      } catch (error) {
        console.error("Failed to load stream", error)
      }
    })()
  }, [])

  return (
    <div className="w-4/6">
      <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
    </div>
  )
}

const Timestamps = ({ timestamps }) => {
  const timestampRef = useRef(null);

  useEffect(() => {
    const timestampElement = timestampRef.current;
    if (timestampElement && timestampElement.lastChild) {
      timestampElement.scrollTop = timestampElement.scrollHeight;
      timestampElement.lastChild.scrollIntoView({ behavior: 'smooth' });
    }
  }, [timestamps]);

  return (
    <div className="h-full bottom-0 overflow-y-auto">
      <div ref={timestampRef}>
        {timestamps.map((timestamp) => (
          <React.Fragment key={timestamp.time}>
            {timestamp.time} - {timestamp.team} <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Pertandingan = ({
    pageData,
    movePage
}) => {
    const [isFinished, setIsFinished] = useState(false)
    const [teamA, setTeamA] = useState([])
    const [teamB, setTeamB] = useState([])
    const [match, setMatch] = useState([])

    useEffect (() => {
        const fetchMatch = async () => {
            const matchData = await getMatchesData(pageData)
            setMatch(matchData)
        }

        fetchMatch()
    }, [])

    useEffect (() => {
        const fetchTeams = async () => {
            console.info(match)
            if(match) {
                const teamA = await getTeamsData(match.team_a)
                const teamB = await getTeamsData(match.team_b)
                setTeamA(teamA)
                setTeamB(teamB)
            }
        }

        fetchTeams()
    }, [match])

    return (
        <div className="fixed inset-0 overflow-hidden h-screen bg-gray-50">
            {/* <Navbar 
                title={match.title}*/}
            <Content 
                match={match}
                teamA={teamA}
                teamB={teamB} 
                movePage={movePage}
            />
        </div>
    )
}

export default Pertandingan