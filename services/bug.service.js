import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}


function query(filterBy) {
    var filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = bugs.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        filteredBugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {

    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugToSave = {
            _id: bugToSave._id,
            title: bugToSave.title,
            description: bugToSave.description,
            severity: bugToSave.severity,
            updatedAt: Date.now(),
        }

        bugs[bugIdx].title = bugToSave.title
        bugs[bugIdx].description = bugToSave.description
        bugs[bugIdx].severity = bugToSave.severity
        bugs[bugIdx].updatedAt = bugToSave.updatedAt


    } else {
        bugToSave = {
            _id: utilService.makeId(),
            title: bugToSave.title,
            description: bugToSave.description || '',
            severity: bugToSave.severity,
            labels: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
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