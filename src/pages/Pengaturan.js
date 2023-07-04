import React, { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { getSettings, updateSettings } from "../Controllers/settingController"

const Pengaturan= ({ movePage })=> {
    const [maxElapsedTime, setMaxElapsedTime] = useState(0)
    const [preparationTime, setPreparationTime] = useState(0)
    const [scorePerPoint, setScorePerPoint] = useState(0)
    const [scorePerRetry, setScorePerRetry] = useState(0)
    const [maxPoints, setMaxPoints] = useState(0)
    const [maxCheckpoints, setMaxCheckpoints] = useState(0)
    const [startStop, setStartStop] = useState("")
    const [reset, setReset] = useState("")
    const [checkpointA, setCheckpointA] = useState("")
    const [pointA, setPointA] = useState("")
    const [retryA, setRetryA] = useState("")
    const [checkpointB, setCheckpointB] = useState("")
    const [pointB, setPointB] = useState("")
    const [retryB, setRetryB] = useState("")
    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettings()
            setMaxElapsedTime(settings.matchConfig.maxElapsedTime)
            setPreparationTime(settings.matchConfig.preparationTime)
            setScorePerPoint(settings.matchConfig.scorePerPoint)
            setScorePerRetry(settings.matchConfig.scorePerRetry)
            setMaxPoints(settings.matchConfig.maxPoints)
            setMaxCheckpoints(settings.matchConfig.maxCheckpoints)
            setStartStop(settings.hotkeys.startStop)
            setReset(settings.hotkeys.reset)
            setCheckpointA(settings.hotkeys.checkpointA)
            setPointA(settings.hotkeys.pointA)
            setRetryA(settings.hotkeys.retryA)
            setCheckpointB(settings.hotkeys.checkpointB)
            setPointB(settings.hotkeys.pointB)
            setRetryB(settings.hotkeys.retryB)
        }

        fetchSettings()
    }, [])

    const handleSave = async () => {
        const settings = await getSettings()
        settings.matchConfig.maxElapsedTime = maxElapsedTime
        settings.matchConfig.preparationTime = preparationTime
        settings.matchConfig.scorePerPoint = scorePerPoint
        settings.matchConfig.scorePerRetry = scorePerRetry
        settings.matchConfig.maxPoints = maxPoints
        settings.matchConfig.maxCheckpoints = maxCheckpoints
        settings.hotkeys.startStop = startStop
        settings.hotkeys.reset = reset
        settings.hotkeys.checkpointA = checkpointA
        settings.hotkeys.pointA = pointA
        settings.hotkeys.retryA = retryA
        settings.hotkeys.checkpointB = checkpointB
        settings.hotkeys.pointB = pointB
        settings.hotkeys.retryB = retryB
        await updateSettings(settings)
    }
    
    return (
        <div className={"fixed flex flex-col h-screen inset-0 overflow-scroll"}>
            <Navbar title={'pengaturan'} back={()=> movePage('main-menu')}/>
            <div className={"w-full flex justify-center flex-1 py-16"}>
                <div className="w-2/4 flex flex-col">
                    <div className="font-bold text-4xl text-gray-700 py-5">
                        Pertandingan
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>Durasi Pertandingan</div>
                        <div>{maxElapsedTime ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={maxElapsedTime}
                                onChange={(e) => setMaxElapsedTime(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Waktu Persiapan
                        </div>
                        <div>{preparationTime ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={preparationTime}
                                onChange={(e) => setPreparationTime(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Penambahan per Point
                        </div>
                        <div>{scorePerPoint ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={scorePerPoint}
                                onChange={(e) => setScorePerPoint(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Pengurangan per Retry
                        </div>
                        <div>{scorePerRetry ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={scorePerRetry}
                                onChange={(e) => setScorePerRetry(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Jumlah Point Maksimal
                        </div>
                        <div>{maxPoints ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={maxPoints}
                                onChange={(e) => setMaxPoints(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Jumlah Checkpoint Maksimal
                        </div>
                        <div>{maxCheckpoints ? (
                            <input 
                                className="text-right"
                                type="number"
                                value={maxCheckpoints}
                                onChange={(e) => setMaxCheckpoints(e.target.value)} 
                            />
                        ) : null}</div>
                    </div>
                    <hr className="h-5 my-2 bg-gray-700 opacity-30"/>
                    <div className="font-bold text-4xl text-gray-700 py-5">
                        Hotkeys
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Start/Stop/Pause
                        </div>
                        <div>{startStop ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={startStop}
                                onKeyPress={(e) => setStartStop(e.code)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Reset
                        </div>
                        <div>{reset ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={reset}
                                onKeyPress={(e) => setReset(e.code)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Checkpoint A
                        </div>
                        <div>{checkpointA ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={checkpointA}
                                onKeyPress={(e) => setCheckpointA(e.code)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Point A
                        </div>
                        <div>{pointA ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={pointA}
                                onKeyPress={(e) => setPointA(e.code)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Retry A
                        </div>
                        <div>{retryA ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={retryA}
                                onKeyPress={(e) => setRetryA(e.code)}
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Checkpoint B
                        </div>
                        <div>{checkpointB ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={checkpointB}
                                onKeyPress={(e) => setCheckpointB(e.code)} 
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Point B
                        </div>
                        <div>{pointB ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={pointB}
                                onKeyPress={(e) => setPointB(e.code)}
                            />
                        ) : null}</div>
                    </div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2 flex justify-between">
                        <div>
                            Retry B
                        </div>
                        <div>{retryB ? (
                            <input 
                                className="text-right"
                                type="text"
                                value={retryB}
                                onKeyPress={(e) => setRetryB(e.code)}
                            />
                        ) : null}</div>
                    </div>
                    <div className="flex justify-center py-10">
                        <button className="inline-block py-2 px-4 mx-2 rounded-xl font-bold text-white bg-blue-500" onClick={handleSave}>SIMPAN</button>
                        <div className="inline-block py-2 px-4 mx-2 rounded-xl font-bold text-white bg-red-600">RESET</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pengaturan