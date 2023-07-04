import React, { useEffect, useRef, useState } from "react"
import { getMatchesData, updateMatchData } from "../Controllers/matchControllers"
import { getTeamsData, updateTeamData } from "../Controllers/teamControllers"
import { getSettings } from "../Controllers/settingController"
import CrownSVG from "../images/crown"

const Content = ({
    match,
    teamA,
    teamB,
    movePage,
    matchConfig,
    hotkeys
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
    const [winner, setWinner] = useState(0)
    const [teamAFinishTime, setTeamAFinishTime] = useState(0)
    const [teamBFinishTime, setTeamBFinishTime] = useState(0)
    const [timerType, setTimerType] = useState('Countdown')

    useEffect(() => {
        const checkpointCountTeamA = timestamps.reduce((count, timestamp) => timestamp.type === 'checkpoint' && timestamp.team === "A" ? count+1 : count, 0)
        const pointCountTeamA = timestamps.reduce((count, timestamp) => timestamp.type === 'point' && timestamp.team === "A"  ? count+1 : count, 0)
        const retryCountTeamA = timestamps.reduce((count, timestamp) => timestamp.type === 'retry' && timestamp.team === "A"  ? count+1 : count, 0)
        const checkpointCountTeamB = timestamps.reduce((count, timestamp) => timestamp.type === 'checkpoint' && timestamp.team === "B" ? count+1 : count, 0)
        const pointCountTeamB = timestamps.reduce((count, timestamp) => timestamp.type === 'point' && timestamp.team === "B"  ? count+1 : count, 0)
        const retryCountTeamB = timestamps.reduce((count, timestamp) => timestamp.type === 'retry' && timestamp.team === "B"  ? count+1 : count, 0)
        setCheckpointsTeamA(checkpointCountTeamA)
        setPointsTeamA(pointCountTeamA)
        setRetriesTeamA(retryCountTeamA)
        setCheckpointsTeamB(checkpointCountTeamB)
        setPointsTeamB(pointCountTeamB)
        setRetriesTeamB(retryCountTeamB)
    
    }, [timestamps])

    useEffect(() => {
        const calculatedScoreTeamA = (pointsTeamA * matchConfig.scorePerPoint) + (retriesTeamA * matchConfig.scorePerRetry)
        const calculatedScoreTeamB = (pointsTeamB * matchConfig.scorePerPoint) + (retriesTeamB * matchConfig.scorePerRetry)
        setScoresTeamA(calculatedScoreTeamA)
        setScoresTeamB(calculatedScoreTeamB)
    
    }, [matchConfig, pointsTeamA, pointsTeamB, retriesTeamA, retriesTeamB])

    useEffect(() => {
        if (isFinished) {
            let winner = null
            if (scoresTeamA > scoresTeamB) {
                winner = teamA.id
            } else if (scoresTeamB > scoresTeamA) {
                winner = teamB.id
            } else {
                winner = 0
            }
            console.info(winner)
            setWinner(winner)

            const teamACheckpoints = timestamps.filter(
                (checkpoint) => checkpoint.team === 'A' && checkpoint.type === 'checkpoint'
            )
            const teamBCheckpoints = timestamps.filter(
                (checkpoint) => checkpoint.team === 'B' && checkpoint.type === 'checkpoint'
            )
        
            if (teamACheckpoints.length >= 4) {
                const fourthCheckpoint = teamACheckpoints[3]
                setTeamAFinishTime(fourthCheckpoint.time)
            } else {
                setTeamAFinishTime(0) // Set to null if the 4th checkpoint is not found
            }
            if (teamBCheckpoints.length >= 4) {
                const fourthCheckpoint = teamBCheckpoints[3]
                setTeamBFinishTime(fourthCheckpoint.time)
            } else {
                setTeamBFinishTime(0) // Set to null if the 4th checkpoint is not found
            }

        }
    }, [isFinished, scoresTeamA, scoresTeamB]);

    const handleSave = async () => {
        console.info("Saved")
        const result = [{
            "winner": winner,
            "teamAFinishTime": teamAFinishTime,
            "teamBFinishTime": teamBFinishTime,
            "pointsTeamA": pointsTeamA,
            "pointsTeamB": pointsTeamB,
            "checkpointsTeamA": checkpointsTeamA,
            "checkpointsTeamB": checkpointsTeamB,
            "retriesTeamA": retriesTeamA,
            "retriesTeamB": retriesTeamB,
            "scoresTeamA": scoresTeamA,
            "scoresTeamB": scoresTeamB,
            "timestamps": timestamps
        }]
        teamA.matches_history.push(match.id);
        teamB.matches_history.push(match.id);
        match.match_result = result
        console.info(teamA)
        await updateMatchData(match.id, match)
        await updateTeamData(teamA.id, teamA)
        await updateTeamData(teamB.id, teamB)
        movePage('daftar-pertandingan')
    }

    const handleReset = () => {
        setTime(0)
        setIsRunning(false)
        setTimestamps([])
        setTimerType("Countdown")
        setIsFinished(false)
        setTeamAFinishTime(0)
        setTeamBFinishTime(0)
    }

    if(teamA && teamB && matchConfig && hotkeys) 
        return (
            <div className={`flex flex-col ${isFinished ? 'h-screen' : 'min-h-screen'}`}>
                {/* Header */}
                <div className="w-full flex justify-center text-gray-700 h-20 div-top">
                    <div className="text-5xl bg-red-600 text-white flex items-center justify-center font-bold w-1/3 text-center">
                        {teamA.name}
                    </div>
                    <Stopwatch 
                        isRunning={isRunning}
                        isFinished={isFinished}
                        time={time}
                        timerType={timerType}
                        pointsTeamA={pointsTeamA}
                        pointsTeamB={pointsTeamB}
                        checkpointsTeamA={checkpointsTeamA}
                        checkpointsTeamB={checkpointsTeamB}
                        matchConfig={matchConfig}
                        hotkeys={hotkeys}
                        setIsRunning={setIsRunning}
                        setIsFinished={setIsFinished}
                        setTime={setTime}
                        setTimerType={setTimerType}
                        setTimestamps={setTimestamps}
                        setTeamAFinishTime={setTeamAFinishTime}
                        setTeamBFinishTime={setTeamBFinishTime}
                        handleReset={handleReset}
                    />
                    <div className="text-5xl bg-blue-600 text-white flex items-center justify-center font-bold w-1/3 text-center">
                        {teamB.name}
                    </div>
                </div>

                {isFinished ? (
                    <div className="py-10 bg-gray-100 w-full h-full flex justify-center overflow-scroll">
                        <div className="w-1/4 bg-white-100 px-10 flex justify-center">
                            <div>
                                {timestamps.filter((timestamp) => timestamp.team === 'A').map((timestamp) => (
                                    <React.Fragment key={timestamp.time}>
                                        <span className="bg-red-600 rounded-lg px-2 mx-4 font-bold text-white text-sm">[ TEAM {timestamp.team} ] </span>
                                        <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                                            {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="flex-row w-2/4 text-3xl">
                            <table>
                                <tr className="h-24">
                                    <td className="w-1/3">
                                        <div className="flex justify-center">
                                            {winner ? (winner === teamA.id ? <CrownSVG className={"h-12 w-12"}/> : null) : "DRAW"}
                                        </div>
                                    </td>
                                    <th className="w-1/3">WINNER</th>
                                    <td className="w-1/3">
                                        <div className="flex justify-center">
                                            {winner ? (winner === teamB.id ? <CrownSVG className={"h-12 w-12"}/> : null) : "DRAW"}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24">
                                    <td>
                                        <div className="flex justify-center">
                                            {teamAFinishTime ? teamAFinishTime : "DNF"}
                                        </div>
                                    </td>
                                    <th>WAKTU FINISH</th>
                                    <td>
                                        <div className="flex justify-center">
                                            {teamBFinishTime ? teamBFinishTime : "DNF"}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24">
                                    <td>
                                        <div className="flex justify-center">
                                            {pointsTeamA} / {matchConfig.maxPoints}
                                        </div>
                                    </td>
                                    <th>POIN DIAMBIL</th>
                                    <td>
                                        <div className="flex justify-center">
                                            {pointsTeamB} / {matchConfig.maxPoints}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24">
                                    <td>
                                        <div className="flex justify-center">
                                            {checkpointsTeamA} / {matchConfig.maxCheckpoints}
                                        </div>
                                    </td>
                                    <th>CHECKPOINT DIAMBIL</th>
                                    <td>
                                        <div className="flex justify-center">
                                            {checkpointsTeamB} / {matchConfig.maxCheckpoints}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24">
                                    <td>
                                        <div className="flex justify-center">
                                            {retriesTeamA}
                                        </div>
                                    </td>
                                    <th>JUMLAH RETRY</th>
                                    <td>
                                        <div className="flex justify-center">
                                            {retriesTeamB}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="h-24">
                                    <td>
                                        <div className="flex justify-center">
                                            {scoresTeamA}
                                        </div>
                                    </td>
                                    <th>SCORE AKHIR</th>
                                    <td>
                                    <div className="flex justify-center">
                                            {scoresTeamB}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div className="flex justify-center w-full py-10">
                                <button className="bg-blue-500 font-bold text-white rounded-xl px-4 py-2 mx-4" onClick={() => handleSave()}>SIMPAN</button>
                                <button className="bg-red-600 font-bold text-white rounded-xl px-4 py-2 mx-4" onClick={() => handleReset()}>ULANG</button>
                            </div>
                        </div>
                        <div className="w-1/4 bg-white-100 px-10 flex justify-center">
                            <div>
                                {timestamps.filter((timestamp) => timestamp.team === 'B').map((timestamp) => (
                                    <React.Fragment key={timestamp.time}>
                                        <span className="bg-blue-600 rounded-lg px-2 mx-4 font-bold text-white text-sm ">[ TEAM {timestamp.team} ] </span>
                                        <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                                            {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full">

                        {/* Body */}
                        <div className="h-full overflow-y-auto w-full border-8 bg-gray-50 flex justify-center">
                            <DroidCamFeed />
                        </div>

                        {/* Footer */}
                        <div className="w-full h-48 flex div-bottom">
                            <div className="bg-gray-200 w-1/3 z-10 h-full border-t-8 border-gray-300 flex">
                                <div className=" w-1/3 h-full bg-red-600 flex items-center justify-center">
                                    <div className="text-white text-7xl font-black">{scoresTeamA}</div>
                                </div>
                                <div className="w-2/3 h-full flex flex-col">
                                    <div className="px-4 h-1/6 flex items-end">Checkpoints</div>
                                    <div className="px-4 h-1/6 w-3/4 flex items-center">
                                        <div className="bg-gray-50 rounded-full h-4 w-full">
                                            <div className="h-full rounded-lg bg-gray-700" style={checkpointsTeamA ? {width: `${(checkpointsTeamA/matchConfig.maxCheckpoints) * 100}%`} : {width: '5%'}}></div>
                                        </div>
                                        <div className="mx-5">
                                            {checkpointsTeamA}/{matchConfig.maxCheckpoints}
                                        </div>
                                    </div>
                                    <div className="px-4 h-1/6 flex items-end">Points</div>
                                    <div className="px-4 h-1/6 w-3/4 flex items-center">
                                        <div className="bg-gray-50 rounded-full h-4 w-full">
                                            <div className="h-full rounded-lg bg-green-600" style={pointsTeamA ? {width: `${(pointsTeamA/matchConfig.maxPoints) * 100}%`} : {width: '5%'}}></div>
                                        </div>
                                        <div className="mx-5">
                                            {pointsTeamA}/{matchConfig.maxPoints}
                                        </div>
                                    </div>
                                    <div className="px-4 h-1/6">Retries</div>
                                    <div className="px-4 h-1/6 w-3/4">
                                        <div className="font-bold text-2xl text-red-600">{retriesTeamA}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 w-1/3 z-10 h-full border-t-8 border-gray-300 py-5 px-2">
                                <Timestamps timestamps={timestamps} matchConfig={matchConfig} />
                            </div>
                            <div className="bg-gray-200 w-1/3 z-10 h-full border-t-8 border-gray-300 flex">
                                <div className="w-2/3 h-full flex justify-end">
                                    <div className="w-3/4 h-full flex-row">
                                        <div className="px-4 h-1/6 flex items-end">Checkpoints</div>
                                        <div className="px-4 h-1/6 w-full flex items-center">
                                            <div className="bg-gray-50 rounded-full h-4 w-full">
                                                <div className="h-full rounded-lg bg-gray-700" style={checkpointsTeamB ? {width: `${(checkpointsTeamB/matchConfig.maxCheckpoints) * 100}%`} : {width: '5%'}}></div>
                                            </div>
                                            <div className="mx-5">
                                                {checkpointsTeamB}/{matchConfig.maxCheckpoints}
                                            </div>
                                        </div>
                                        <div className="px-4 h-1/6 flex items-end">Points</div>
                                            <div className="px-4 h-1/6 w-full flex items-center">
                                                <div className="bg-gray-50 rounded-full h-4 w-full">
                                                    <div className="h-full rounded-lg bg-green-600" style={pointsTeamB ? {width: `${(pointsTeamB/matchConfig.maxPoints) * 100}%`} : {width: '5%'}}></div>
                                                </div>
                                                <div className="mx-5">
                                                    {pointsTeamB}/{matchConfig.maxPoints}
                                                </div>
                                            </div>
                                        <div className="px-4 h-1/6">Retries</div>
                                        <div className="px-4 h-1/6 w-full">
                                        <div className="font-bold text-2xl text-red-600">{retriesTeamB}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" w-1/3 h-full bg-blue-600 flex items-center justify-center">
                                    <div className="text-white text-7xl font-black">{scoresTeamB}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    else    
        return(<div></div>)
}

const Stopwatch = ({
    isRunning,
    isFinished,
    time,
    timerType,
    pointsTeamA,
    pointsTeamB,
    checkpointsTeamA,
    checkpointsTeamB,
    matchConfig,
    hotkeys,
    setIsRunning,
    setTime,
    setTimerType,
    setTimestamps,
    setIsFinished,
    setTeamAFinishTime,
    setTeamBFinishTime,
    handleReset
}) => {
    

    useEffect(() => {
        let timer = null;
    
        if (timerType === 'Countdown' && isRunning) {
          if (time === matchConfig.preparationTime) {
            setTimerType('StartCount');
            setTime(0);
            setIsRunning(true);
          } else {
            timer = setInterval(() => {
              setTime((prevTime) => prevTime + 10);
            }, 10);
          }
        } else if (timerType === 'StartCount' && isRunning) {
            if (time === 3000) {
              setTimerType('Stopwatch');
              setTime(0);
              setIsRunning(true);
            } else {
              timer = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
              }, 10);
            }
        
        } else if (timerType === 'Stopwatch' && isRunning && time < matchConfig.maxElapsedTime && (checkpointsTeamA < matchConfig.maxCheckpoints || checkpointsTeamB < matchConfig.maxCheckpoints)) {
          timer = setInterval(() => {
            setTime((prevTime) => prevTime + 10);
          }, 10);
        }
    
        return () => {
          clearInterval(timer);
        };

      }, [matchConfig, timerType, time, isRunning]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(event.code)
            if (event.code === hotkeys.startStop && event.target === document.body) {
                event.preventDefault()
                if (!isRunning && checkpointsTeamA < matchConfig.maxCheckpoints && checkpointsTeamB < matchConfig.maxCheckpoints && time < matchConfig.maxElapsedTime) {
                    setIsRunning(true)
                } else {
                    setIsRunning(false)
                }
            } else if (event.code === hotkeys.checkpointA && event.target === document.body) {
                event.preventDefault()
                if (isRunning && (checkpointsTeamA < matchConfig.maxCheckpoints && timerType === "Stopwatch")) {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"A", type:'checkpoint', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.checkpointB && event.target === document.body) {
                event.preventDefault()
                if (isRunning && (checkpointsTeamB < matchConfig.maxCheckpoints && timerType === "Stopwatch")) {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"B", type:'checkpoint', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.pointA && event.target === document.body) {
                event.preventDefault()
                if (isRunning && pointsTeamA < matchConfig.maxPoints && timerType === "Stopwatch") {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"A", type:'point', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.pointB && event.target === document.body) {
                event.preventDefault()
                if (isRunning && pointsTeamB < matchConfig.maxPoints && timerType === "Stopwatch" ) {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"B", type:'point', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.retryA && event.target === document.body) {
                event.preventDefault()
                if (isRunning && timerType === "Stopwatch") {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"A", type:'retry', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.retryB && event.target === document.body) {
                event.preventDefault()
                if (isRunning && timerType === "Stopwatch") {
                    setTimestamps((prevTimestamps) => [
                        ...prevTimestamps,
                        {team:"B", type:'retry', time:formatTime(time)},
                    ])
                }
            } else if (event.code === hotkeys.reset && event.target === document.body) {
                event.preventDefault()
                handleReset()
            }
        }
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [matchConfig, isRunning, time, checkpointsTeamA, checkpointsTeamB])

    useEffect(() => {
        if ((checkpointsTeamA === matchConfig.maxCheckpoints && checkpointsTeamB === matchConfig.maxCheckpoints) || time >= matchConfig.maxElapsedTime) {
            setIsRunning(false)
            setIsFinished(true)
        }
    }, [checkpointsTeamA, checkpointsTeamB, time])
    
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time % 60000) / 1000)
        const milliseconds = time % 1000
        return `${minutes}.${seconds < 10 ? "0" : ""}${seconds}:${
            milliseconds < 100 ? "0" : ""
        }${milliseconds}`
    }
    
    return (
        <div className="z-10 w-1/3 flex justify-center items-center h-24 bg-yellow-300">
            <div className="text-7xl font-bold tracking-widest">{isFinished ? "VS" : (timerType === "Countdown" ? formatTime(matchConfig.preparationTime - time) : (timerType === "StartCount" ? Math.ceil(3 - time/1000) : formatTime(time)))}</div>
        </div>
    )
}

const DroidCamFeed = () => {

    useEffect(() => {
        const videoElement = videoRef.current
      
        const handleResize = () => {
            const height = window.innerHeight - 80 - 192 - 30
            if (videoElement) {
                videoElement.style.height = `${height}px`
            }
        };
      
        const handleVideoLoadedMetadata = () => {
            handleResize()
        };
      
        // Attach the event listener to the window
        window.addEventListener('resize', handleResize)
        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', handleVideoLoadedMetadata)
        }
      
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize)
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleVideoLoadedMetadata)
            }
        }
      }, [])

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
        <div className="border-8 flex justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full" />
        </div>
    )
}
  
const Timestamps = ({
    timestamps,
    matchConfig,
    team
}) => {
    const timestampRef = useRef(null)
  
    useEffect(() => {
        const timestampElement = timestampRef.current
        if (timestampElement && timestampElement.lastChild) {
            timestampElement.scrollTop = timestampElement.scrollHeight
            timestampElement.lastChild.scrollIntoView({ behavior: 'smooth' })
        }
    }, [timestamps])
  
    return (
        <div className="h-full bottom-0 overflow-y-auto">
            <div ref={timestampRef}>
                {team === "A" ? timestamps.filter((timestamp) => timestamp.team === 'A').map((timestamp) => (
                    <React.Fragment key={timestamp.time}>
                        <span className="bg-red-600 rounded-lg px-2 mx-4 font-bold text-white text-sm">[ TEAM {timestamp.team} ] </span>
                        <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                            {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                        </span>
                    </React.Fragment>
                )) : (team === "B" ? (
                    timestamps.filter((timestamp) => timestamp.team === 'B').map((timestamp) => (
                        <React.Fragment key={timestamp.time}>
                            <span className="bg-blue-600 rounded-lg px-2 mx-4 font-bold text-white text-sm">[ TEAM {timestamp.team} ] </span>
                            <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                                {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                            </span>
                        </React.Fragment>
                ))) : (
                        timestamps.map((timestamp) => (
                            <React.Fragment key={timestamp.time}>
                                <span className={timestamp.team === 'A' ? "bg-red-600 rounded-lg px-2 mx-4 font-bold text-white text-sm" : "bg-blue-600 rounded-lg px-2 mx-4 font-bold text-white text-sm"}>[ TEAM {timestamp.team} ] </span>
                                <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                                    {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                                </span>
                            </React.Fragment>
                        ))
                    ))            
                }
            </div>
        </div>
    )
}

const Pertandingan = ({
    pageData,
    movePage
}) => {
    const [isFinished, setIsFinished] = useState(false)
    const [teamA, setTeamA] = useState([])
    const [teamB, setTeamB] = useState([])
    const [match, setMatch] = useState([])
    const [matchConfig, setMatchConfig] = useState([])
    const [hotkeys, setHotkeys] = useState([])

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettings()
            setMatchConfig(settings.matchConfig)
            setHotkeys(settings.hotkeys)
        }

        fetchSettings()
    }, [])

    useEffect (() => {
        const fetchMatch = async () => {
            const matchData = await getMatchesData(pageData)
            setMatch(matchData)
        }

        fetchMatch()
    }, [])

    useEffect (() => {
        const fetchTeams = async () => {
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
                title={match.title} 
            /> */}
            <Content 
                match={match}
                teamA={teamA}
                teamB={teamB} 
                movePage={movePage}
                matchConfig={matchConfig}
                hotkeys={hotkeys}
            />
        </div>
    )
}

export default Pertandingan