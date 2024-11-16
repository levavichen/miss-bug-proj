
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getFilterFromSearchParams,
    getEmptyBug
}


function query(filterBy = {}) {
    console.log(filterBy)
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        // .then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'

    return axios[method](BASE_URL + ((method === 'put') ? bug._id : ''), bug)
        .then(res => res.data)
}

function getEmptyBug(title = '', description = '', severity = 1) {
    return { title, description, severity }
}

function getDefaultFilter() {
    return { txt: '', minSeverity: '', pageIdx: 0 }
}


function getFilterFromSearchParams(searchParams) {
    const txt = searchParams.get('txt') || ''
    const minSeverity = searchParams.get('minSeverity') || ''
    return {
        txt,
        minSeverity
    }
}
