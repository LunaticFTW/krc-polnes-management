const apiUrl = "http://localhost:3030/teams"

export const getTeamsData = async (teamId) => {
    let url = `${apiUrl}`
    if (teamId) {
        url += `/${teamId}`
    }
    try {
        const response = await fetch(url)
        const data = await response.json()
        if(data) {
            return data
        } else {
            return 0
        }
    } catch (error) {
        console.log(error)
    }
}

export const deleteTeam = async (teamId) => {
    const url = `${apiUrl}/${teamId}`
    try {
        const response = await fetch(url, {
            method: "DELETE",
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export const updateTeamData = async (teamId, teamData) => {
    const response = await fetch(`${apiUrl}/${teamId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
    })

    const updatedData = await response.json()
    return updatedData
}

export const addTeam = async (teamData) => {
    const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
    })

    const updatedData = await response.json()
    return updatedData
}

export const getKeys = async () => {
    const response = await fetch(apiUrl)
    const data = await response.json()
    if(data[0]) {
        const keys = Object.keys(data[0])
        return keys
    } else {
        return 0
    }
}

export const getLatestTeamId = async () => {
    try {
        const response = await fetch(apiUrl)
        const teams = await response.json()
        if(teams[0]) {
        const latestTeamId = teams[teams.length-1].id
        return latestTeamId
        } else {
            return 0
        }
    } catch(error) {
        console.error(error)
    }
}

export const getLatestTeamCount = async () => {
    try {
        const response = await fetch(apiUrl)
        const teams = await response.json()
        if(teams[0]) {
            const latestTeamCount = teams.length
            return latestTeamCount
        } else {
            return 0
        }
    } catch(error) {
        console.error(error)
    }
}