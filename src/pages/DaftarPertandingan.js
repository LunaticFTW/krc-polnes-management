import React, { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { getMatchesData, deleteMatch, getKeys, getLatestMatchId, getLatestMatchCount, addMatch } from "../Controllers/matchControllers"
import { getTeamsData, getLatestTeamCount } from "../Controllers/teamControllers"
import CrownSVG from "../images/crown"

const Content = ({movePage}) => {
    const [teams, setTeams] = useState([])
    const [matches, setMatches] = useState([])
    const [title, setTitle] = useState("")
    const [teamA, setTeamA] = useState(null)
    const [teamB, setTeamB] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const teamsData = await getTeamsData()
            const matchesData =await getMatchesData()
            setTeams(teamsData)
            setMatches(matchesData)
        }

        fetchData()
    }, [])

    const handleAddMatch = async () => {
        if(title && teamA && teamB) {
            const latestMatchId = await getLatestMatchId()
            const newMatch = {
                id: parseInt(latestMatchId) + 1,
                title: title,
                team_a: parseInt(teamA),
                team_b: parseInt(teamB),
                match_result: []
            }
    
            console.info(newMatch)
            addMatch(newMatch)
            const updatedMatches = await getMatchesData()
            setMatches(updatedMatches)
    
            setTitle("")
            setTeamA(null)
            setTeamB(null)
        }
    }
    return (
        <div className="w-screen h-4/5 overflow-scroll">
            <Ribbon
                teams={teams}
                title={title}
                teamA={teamA}
                teamB={teamB}
                setTitle={setTitle}
                setTeamA={setTeamA}
                setTeamB={setTeamB}
                onAddMatch={handleAddMatch}
            />
            <MatchesTable matches={matches} teams={teams} movePage={movePage} />
        </div>
    )
}

const Ribbon = ({
    teams,
    title,
    teamA,
    teamB,
    setTitle,
    setTeamA,
    setTeamB,
    onAddMatch
}) => {

    return (
        <div className="bg-gray-50 px-10 py-4 flex w-full items-center">
            <input 
                className="border-2 px-2 mx-4 rounded-lg"
                type="text"
                value={title}
                onChange={((e) => setTitle(e.target.value))}
                placeholder="Title"
            />

            <select 
                className="border-2 px-2 mx-4 rounded-lg"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
            >
                <option value="" disabled selected>
                    -- Pilih Tim A --
                </option>
                {teams.map((team) => (
                    <option
                        key={team.id}
                        value={team.id}
                        disabled={team.id == teamB}
                    >
                        {team.name}
                    </option>
                ))}        
            </select>
            
            <select 
                className="border-2 px-2 mx-4 rounded-lg"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
            >
                <option className="bg-gray-400" value="" disabled selected>
                    -- Pilih Tim B --
                </option>
                {teams.map((team) => (
                    <option
                        key={team.id}
                        value={team.id}
                        disabled={team.id == teamA}
                    >
                        {team.name}
                    </option>
                ))}        
            </select>

            <button 
                className="border-2 py-1 rounded-lg px-4 bg-gray-700 text-white font-bold"
                onClick={onAddMatch}
            >
                Add Match
            </button>
        </div>
    )
}

const MatchesTable = ({
    matches,
    teams,
    movePage
}) => {
    const getTeamName = (teamId, teams) => {
        const team = teams.find((team) => team.id === teamId)
        return team ? team.name : ""
    }

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className={"px-6 py-3 w-1/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                            ID
                        </th>
                        <th className={"px-6 py-3 w-2/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                            Title
                        </th>
                        <th className={"px-6 py-3 w-4/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                            TIM A
                        </th>
                        <th className={"px-6 py-3 w-4/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                            TIM B
                        </th>
                        <th className={"px-6 py-3 w-1/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {matches ? matches.map((match) => {
                        return (
                            <React.Fragment key={match.id}>
                                <tr className="bg-gray-50 hover:bg-gray-200">
                                    <td className="px-6 py-4 whitespace-nowrap">{match.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{match.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {match.match_result[0] ? 
                                            <div className="flex items-center">
                                                <div>
                                                    {getTeamName(match.team_a, teams)}
                                                </div>
                                                <div className="mx-5 px-2 py-2 rounded-xl bg-red-600 text-white font-bold">
                                                    {match.match_result[0].scoresTeamA} Pts
                                                </div>
                                                <div className="">
                                                    {match.match_result[0].winner === match.team_a ? <CrownSVG className={"w-12"} /> : null}
                                                </div>
                                            </div>
                                        : getTeamName(match.team_a, teams)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {match.match_result[0] ? 
                                            <div className="flex items-center">
                                                <div>
                                                    {getTeamName(match.team_b, teams)}
                                                </div>
                                                <div className="mx-5 px-2 py-2 rounded-xl bg-blue-500 text-white font-bold">
                                                    {match.match_result[0].scoresTeamB} Pts
                                                </div>
                                                <div className="">
                                                    {match.match_result[0].winner === match.team_b ? <CrownSVG className={"w-12"} /> : null}
                                                </div>
                                            </div>
                                        : getTeamName(match.team_b, teams)}
                                        </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {match.match_result[0] ? (
                                            <button className="text-white font-bold rounded-xl bg-green-600 py-2 px-4 mx-2" onClick={() => movePage('hasil-pertandingan', match.id)}>
                                                Hasil
                                            </button>
                                        ) : (
                                            <button className="text-white font-bold rounded-xl bg-gray-700 py-2 px-4 mx-2" onClick={() => movePage('pertandingan', match.id)}>
                                                Mulai
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </React.Fragment>
                        )
                    }) : null}
                </tbody>
            </table>
        </div>
    )
}

const DaftarPertandingan = ({ movePage })=> {
    return (
        <div className="fixed inset-0 overflow-hidden bg-gray-50">
            <Navbar title={'Daftar Pertandingan'} back={()=> movePage('main-menu')} />
            <Content movePage={movePage} />
        </div>
    )
}

export default DaftarPertandingan