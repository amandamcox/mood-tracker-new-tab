let today = new Date()
let thisMonth = today.getMonth()
let thisYear = today.getFullYear()
let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const displayCalendar = (year, month) => {
    console.log(year, month)
    chrome.storage.sync.get(['moodData'], function (result) {
        if (!chrome.runtime.error && result) {
            let savedDataSet = result.moodData
            if (savedDataSet) {
                let daysInMonth = 32 - new Date(year, month, 32).getDate();
                const calendarDiv = document.getElementById('past-calendar')
                calendarDiv.innerHTML = ''
                document.getElementById('month-title').innerText = `${monthNames[month]} ${year}`

                let i = 1
                while (i <= daysInMonth) {
                    let newDiv = calendarDiv.appendChild(document.createElement('div'))
                    newDiv.setAttribute('date', `${month + 1}/${i}/${year}`)
                    let dataByDate = savedDataSet.filter(each => newDiv.getAttribute('date') == each.date)
                    if (dataByDate.length > 0) {
                        newDiv.innerHTML = `<p class="calendar-number">${i}</p>`
                        dataByDate.map(
                            eachSavedMood => newDiv.innerHTML += `<span style="font-size: 22px;">${eachSavedMood.feeling}</span>: ${eachSavedMood.reason}<br />`
                        )
                    }
                    else {
                        newDiv.innerHTML = `<p class="calendar-number">${i}</p>`
                    }
                    i++
                }

                if (month - 1 === -1) {
                    month = 12
                    year = year - 1
                }

                document.getElementById('previous-month-button').innerHTML = `<input type="button" year="${year}" month="${month - 1}" value="View ${monthNames[month - 1]} ${year} Data" />`

                if (month != thisMonth || year != thisYear) {
                    document.getElementById('current-month-button').innerHTML = `<input type="button" value="Back to ${monthNames[thisMonth]} ${thisYear}" />`
                }
                else {
                    document.getElementById('current-month-button').innerHTML = ''
                }
            }
        }
    })
}

const saveToday = () => {
    const form = document.forms['today-form'].elements
    const todaysMoods = {
        date: today.toLocaleDateString(),
        feeling: form.feeling.value,
        reason: form.reason.value
    }
    chrome.storage.sync.get(['moodData'], function (result) {
        if (!chrome.runtime.error && Object.keys(result).length > 0) {
            let savedDataArr = result.moodData
            savedDataArr.push(todaysMoods)
            chrome.storage.sync.set({'moodData': savedDataArr})
        }
        else if (!chrome.runtime.error && Object.keys(result).length === 0) {
            let savedDataArr = []
            savedDataArr.push(todaysMoods)
            chrome.storage.sync.set({'moodData': savedDataArr})
        }
    })
}

displayCalendar(thisYear, thisMonth)

document.getElementById('today-form').addEventListener('submit', saveToday)
document.getElementById('previous-month-button').addEventListener('click', () => {
    const year = document.querySelector('#previous-month-button input[type=button]').getAttribute('year')
    const month = document.querySelector('#previous-month-button input[type=button]').getAttribute('month')
    displayCalendar(year, month)
})
document.getElementById('current-month-button').addEventListener('click', () => {
    displayCalendar(thisYear, thisMonth)
})