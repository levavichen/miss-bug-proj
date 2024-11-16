import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')

const PAGE_SIZE = 6

export const bugService = {
    query,
    getById,
    remove,
    save
}


function query(filterBy) {
    console.log(filterBy)
    var filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = bugs.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        filteredBugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    if (filterBy.userId) {
        filteredBugs = filteredBugs.filter((bug) => bug.owner._id === filterBy.userId)
        console.log(filteredBugs)
    }

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId, user) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    if (!user.isAdmin && bugs[bugIdx].owner._id !== user._id) return Promise.reject('Not your bug')

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}


function save(bug, user) {

    if (bug._id) {
        console.log(user)
        if (!user.isAdmin && bug.owner._id !== user._id) return Promise.reject('Not your bug')

        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)

        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = bug.severity
        bugToUpdate.updatedAt = Date.now()


    } else {
        bug = {
            _id: utilService.makeId(),
            title: bug.title,
            description: bug.description || '',
            severity: bug.severity,
            labels: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            owner: user
        }

        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}