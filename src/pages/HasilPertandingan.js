import React, { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { getMatchesData } from "../Controllers/matchControllers"
import { getTeamsData } from "../Controllers/teamControllers"
import CrownSVG from "../images/crown"

const HasilPertandingan = ({
    pageData,
    movePage
}) => {
    const [teamA, setTeamA] = useState([])
    const [teamB, setTeamB] = useState([])
    const [match, setMatch] = useState([])

    const matchConfig = {
        scorePerPoint: 5,
        scorePerRetry: -0.5,
        maxCheckpoints: 4,
        maxPoints: 6,
        maxElapsedTime: 10000,
        preparationTime: 5000
    }

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

    console.info(match)

    return (
        <div className="fixed inset-0 overflow-hidden h-screen bg-gray-50">
            <Navbar back={() => movePage('daftar-pertandingan')}/>
            <div className={"flex flex-col h-screen"}>
                {/* Header */}
                <div className="w-full flex justify-center text-gray-700 h-20 div-top">
                    <div className="text-5xl bg-red-600 text-white flex items-center justify-center font-bold w-1/3 text-center">
                        {teamA.name}
                    </div>
                    <div className="z-10 w-1/3 flex justify-center items-center h-24 bg-yellow-300">
                        <div className="text-7xl font-bold tracking-widest">VS</div>
                    </div>
                    <div className="text-5xl bg-blue-600 text-white flex items-center justify-center font-bold w-1/3 text-center">
                        {teamB.name}
                    </div>
                </div>
                {match.match_result ? (
                <div className="py-10 bg-gray-100 w-full h-full flex justify-center overflow-scroll">
                    <div className="w-1/4 bg-white-100 px-10 flex justify-center">
                        <div>
                            {match.match_result[0].timestamps.filter((timestamp) => timestamp.team === 'A').map((timestamp) => (
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
                                        {match.match_result[0].winner ? (match.match_result[0].winner === teamA.id ? <CrownSVG className={"h-12 w-12"}/> : null) : "DRAW"}
                                    </div>
                                </td>
                                <th className="w-1/3">WINNER</th>
                                <td className="w-1/3">
                                    <div className="flex justify-center">
                                        {match.match_result[0].winner ? (match.match_result[0].winner === teamB.id ? <CrownSVG className={"h-12 w-12"}/> : null) : "DRAW"}
                                    </div>
                                </td>
                            </tr>
                            <tr className="h-24">
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].teamAFinishTime ? match.match_result[0].teamAFinishTime : "DNF"}
                                    </div>
                                </td>
                                <th>WAKTU FINISH</th>
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].teamBFinishTime ? match.match_result[0].teamBFinishTime : "DNF"}
                                    </div>
                                </td>
                            </tr>
                            <tr className="h-24">
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].pointsTeamA} / {matchConfig.maxPoints}
                                    </div>
                                </td>
                                <th>POIN DIAMBIL</th>
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].pointsTeamB} / {matchConfig.maxPoints}
                                    </div>
                                </td>
                            </tr>
                            <tr className="h-24">
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].checkpointsTeamA} / {matchConfig.maxCheckpoints}
                                    </div>
                                </td>
                                <th>CHECKPOINT DIAMBIL</th>
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].checkpointsTeamB} / {matchConfig.maxCheckpoints}
                                    </div>
                                </td>
                            </tr>
                            <tr className="h-24">
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].retriesTeamA}
                                    </div>
                                </td>
                                <th>JUMLAH RETRY</th>
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].retriesTeamB}
                                    </div>
                                </td>
                            </tr>
                            <tr className="h-24">
                                <td>
                                    <div className="flex justify-center">
                                        {match.match_result[0].scoresTeamA}
                                    </div>
                                </td>
                                <th>SCORE AKHIR</th>
                                <td>
                                <div className="flex justify-center">
                                        {match.match_result[0].scoresTeamB}
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="w-1/4 bg-white-100 px-10 flex justify-center">
                        <div>
                            {match.match_result[0].timestamps.filter((timestamp) => timestamp.team === 'B').map((timestamp) => (
                                <React.Fragment key={timestamp.time}>
                                    <span className="bg-blue-600 rounded-lg px-2 mx-4 font-bold text-white text-sm ">[ TEAM {timestamp.team} ] </span>
                                    <span className={timestamp.type === 'point' ? "text-green-600 font-bold tracking-widest" : timestamp.type === 'retry' ? "text-red-600 font-bold tracking-widest" : "font-bold tracking-widest"}>
                                        {timestamp.time} {timestamp.type === 'point' ? "+" + matchConfig.scorePerPoint : timestamp.type === 'retry' ? matchConfig.scorePerRetry : null} <br />
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>) : null}
            </div>
                
        </div>
    )
}

export default HasilPertandingan