const apiUrl = "http://localhost:3090/matches"

export const getMatchesData = async (matchId) => {
    let url = `${apiUrl}`
    if (matchId) {
        url += `/${matchId}`
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

export const deleteMatch = async (matchId) => {
    const url = `${apiUrl}/${matchId}`
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

export const updateMatchData = async (matchId, matchData) => {
    const response = await fetch(`${apiUrl}/${matchId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
    })

    const updatedData = await response.json()
    return updatedData
}

export const addMatch = async (matchData) => {
    const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
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

export const getLatestMatchId = async () => {
    try {
        const response = await fetch(apiUrl)
        const matches = await response.json()
        if(matches[0]) {
        const latestMatchId = matches[matches.length-1].id
        return latestMatchId
        } else {
            return 0
        }
    } catch(error) {
        console.error(error)
    }
}

export const getLatestMatchCount = async () => {
    try {
        const response = await fetch(apiUrl)
        const matches = await response.json()
        if(matches[0]) {
            const latestMatchCount = matches.length
            return latestMatchCount
        } else {
            return 0
        }
    } catch(error) {
        console.error(error)
    }
}