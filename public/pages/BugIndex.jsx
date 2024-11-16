import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
const { Link } = ReactRouterDOM


const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveBug(bugId) {
        console.log(bugId)
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    // function onAddBug() {
    //     const bug = {
    //         title: prompt('Bug title?'),
    //         severity: +prompt('Bug severity?'),
    //         description: prompt('Bug description?')
    //     }
    //     bugService
    //         .save(bug)
    //         .then((savedBug) => {
    //             console.log('Added Bug', savedBug)
    //             setBugs([...bugs, savedBug])
    //             showSuccessMsg('Bug added')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onAddBug ->', err)
    //             showErrorMsg('Cannot add bug')
    //         })
    // }

    // function onEditBug(bug) {
    //     const severity = +prompt('New severity?')
    //     const description = prompt('New description?')
    //     const bugToSave = { ...bug, severity, description }
    //     bugService
    //         .save(bugToSave)
    //         .then((savedBug) => {
    //             console.log('Updated Bug:', savedBug)
    //             const bugsToUpdate = bugs.map((currBug) =>
    //                 currBug._id === savedBug._id ? savedBug : currBug
    //             )
    //             setBugs(bugsToUpdate)
    //             showSuccessMsg('Bug updated')
    //         })
    //         .catch((err) => {
    //             console.log('Error from onEditBug ->', err)
    //             showErrorMsg('Cannot update bug')
    //         })
    // }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                {/* <button onClick={onAddBug}>Add Bug ⛐</button> */}
                <button><Link to="/bug/edit">Add Bug ⛐</Link></button>

            </section>
            <main>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <button onClick={() => { onChangePageIdx(1) }}>+</button>
                {filterBy.pageIdx + 1 || ''}
                <button onClick={() => { onChangePageIdx(-1) }} disabled={filterBy.pageIdx === 0}>-</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
            </main>
        </main>
    )
}
