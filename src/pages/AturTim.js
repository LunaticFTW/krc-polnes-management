import React, { useState, useEffect } from "react"
import Navbar from "./Navbar"
import { getTeamsData, addTeam, updateTeamData, deleteTeam, getLatestTeamId } from "../scripts/teamControllers"
import { getMatchesData } from "../scripts/matchControllers"

const Content = () => {
    const [teams, setTeams] = useState([])
    const [matches, setMatches] = useState([])
    const [onEditing, setOnEditing] = useState(0)
    const [onDelete, setOnDelete] = useState(0)

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsData = await getTeamsData()
            setTeams(teamsData)
        }

        fetchTeams()
    }, [teams])

    useEffect(() => {
        const fetchMatches = async () => {
            const matchesData = await getMatchesData()
            setMatches(matchesData)
        }

        fetchMatches()
    }, [matches])

    return (
        <div className="w-screen h-4/5 overflow-scroll">
            <Ribbon />
            <TeamsTable
                teams={teams}
                matches={matches}
                onEditing={onEditing}
                onDelete={onDelete}
                setTeams={setTeams}
                setOnEditing={setOnEditing}
                setOnDelete={setOnDelete}
            />
        </div>
    )
}

const Ribbon = ({ setTeams }) => {
    const [name, setName] = useState("")
    const [community, setCommunity] = useState("")
    
    const handleAdd = async () => {
        const latestTeamId = await getLatestTeamId()
        if(name && community) {
            const newTeam = {
                "id": parseInt(latestTeamId) + 1,
                "name": name,
                "community": community,
                "matches_history": []
            }
            addTeam(newTeam)
            const updatedData = await getTeamsData()
            console.info("Data added")
            setTeams(updatedData)
            setName("")
            setCommunity("")
        }
    }

    return (
        <div className="bg-gray-50 px-10 flex w-full items-center">
            <div className="py-4 px-2">
                <input className="border-2 rounded-lg px-4" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Tim"/>
            </div>
            <div className="py-4 px-2">
                <input className="border-2 rounded-lg px-4" type="text" value={community} onChange={(e) => setCommunity(e.target.value)} placeholder="Community"/>
            </div>
            <div className="py-4 px-2">
                <button className="bg-gray-700 text-white px-4 py-1 rounded-lg font-bold" onClick={handleAdd}>Tambah Tim Baru</button>
            </div>
        </div>
    )
}

const TeamsTable = ({
    teams,
    matches,
    onEditing,
    onDelete,
    setTeams,
    setOnEditing,
    setOnDelete,
}) => {
    return (
        <div>
            <div>
                <table 
                    className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className={"px-6 py-3 w-1/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                                ID
                            </th>
                            <th className={"px-6 py-3 w-4/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                                Name
                            </th>
                            <th className={"px-6 py-3 w-3/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                                Community
                            </th>
                            <th className={"px-6 py-3 w-2/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                                Matches History
                            </th>
                            <th className={"px-6 py-3 w-2/12 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"}>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {teams ? teams.map((team) => {
                            return (
                                <React.Fragment key={team.id}>
                                    {onEditing && onEditing === team.id ? (
                                        <RowOnEditing
                                            team={team}
                                            setTeams={setTeams}
                                            setOnEditing={setOnEditing}
                                        />
                                        ) : (
                                        onDelete && onDelete === team.id ? (
                                        <RowOnDelete
                                            matches={matches}
                                            onDelete={onDelete}
                                            setTeams={setTeams}
                                            setOnDelete={setOnDelete}
                                        />
                                        ) : (
                                        <Row 
                                            team={team}  // Add this line
                                            setOnEditing={setOnEditing}
                                            setOnDelete={setOnDelete}
                                        />
                                        )
                                    )}
                                </React.Fragment>
                            )
                        }) : null}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Row = ({
    team,
    setOnEditing,
    setOnDelete
}) => {
    const handleEdit = () => {
        setOnEditing(team.id)
    }

    const handleDelete = async () => {
        setOnDelete(team.id)
    }

    return (
        <tr className="bg-gray-50 hover:bg-gray-200">
            <td className="px-6 py-4 whitespace-nowrap">{team.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">{team.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{team.community}</td>
            <td className="px-6 py-4 whitespace-nowrap">{team.matches_history}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-white font-bold rounded-xl bg-gray-700 py-2 px-4 mx-2" onClick={handleEdit}>
                    Ubah
                </button>
                <button className="text-white font-bold rounded-xl bg-red-600 py-2 px-4 mx-2" onClick={handleDelete}>
                    Hapus
                </button>
            </td>
        </tr>
    )
}


const RowOnDelete = ({
    onDelete,
    matches,
    setTeams,
    setOnDelete
}) => {
    const handleDelete = async () => {
        deleteTeam(onDelete)
        console.info("data deleted")
        const updatedData = await getTeamsData()
        setTeams(updatedData)
        setOnDelete(0)
    }

    const matchingMatch = matches.find((match) => match.team_a === onDelete || match.team_b === onDelete)

    return (
        <tr>
            <td colSpan={5}>
                {matchingMatch ? (
                    <div className="h-full w-full bg-red-600  px-6 py-4 whitespace-nowrap flex">
                        <div className="font-bold text-white py-2 px-4 mx-2">
                            Data tim {onDelete} dipakai di match {matchingMatch.title}!
                        </div>
                        <div>
                            <button
                                className="text-white font-bold rounded-xl bg-gray-700 py-2 px-4 mx-2"
                                onClick={() => setOnDelete(0)}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full bg-red-600  px-6 py-4 whitespace-nowrap flex">
                        <div className="font-bold text-white py-2 px-4 mx-2">
                            Data tim {onDelete} akan dihapus! Apa anda yakin?
                        </div>
                        <div>
                            <button 
                                className="text-white font-bold rounded-xl bg-blue-500 py-2 px-4 mx-2" 
                                onClick={() => handleDelete()}
                            >
                                Hapus
                            </button>
                        </div>
                        <div>
                            <button
                                className="text-white font-bold rounded-xl bg-gray-700 py-2 px-4 mx-2"
                                onClick={() => setOnDelete(0)}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    )
}

const RowOnEditing = ({
    team,
    setTeams,
    setOnEditing
}) => {
    const [name, setName] = useState(team.name)
    const [community, setCommunity] = useState(team.community)
    
    const handleSave = async () => {
        team.name = name
        team.community = community
        await updateTeamData(team.id, team)
        const updatedData = await getTeamsData()
        setTeams(updatedData)
        setOnEditing(0)
    }

    return (
        <tr>
            <td className="px-6 py-4 w-1/12 whitespace-nowrap bg-gray-400">
                {team.id}
            </td>
            <td className="px-6 py-4 w-4/12 whitespace-nowrap bg-gray-400">
                <input 
                    className="rounded-xl px-4" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
            </td>
            <td className="px-6 py-4 w-3/12 whitespace-nowrap bg-gray-400">
                <input 
                className="rounded-xl px-4" 
                type="text" 
                value={community}
                onChange={(e) => setCommunity(e.target.value)}/>
            </td>
            <td className="px-6 py-4 w-3/12 whitespace-nowrap bg-gray-400">{team.matches_history}</td>
            <td className="px-6 py-4 w-2/12 whitespace-nowrap bg-gray-400">
                <button
                    className="text-white font-bold rounded-xl bg-gray-700 py-2 px-4 mx-2"
                    onClick={handleSave}
                >
                    Simpan
                </button>
                <button 
                    className="text-white font-bold rounded-xl bg-red-600 py-2 px-4 mx-2" 
                    onClick={()=> setOnEditing(0)}
                >
                    Batal
                </button>
            </td>
        </tr>
    )
}

const AturTim = ({ movePage }) => {
    return (
        <div className="fixed inset-0 overflow-hidden bg-gray-50">
            <Navbar title={'Atur Tim'} back={() => movePage('main-menu')} />
            <Content />
        </div>
    )
}

export default AturTim