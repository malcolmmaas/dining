console.log('AAAAAAAAAAA')
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAnS6iMFl2lZRLMkiRuipmais2PLzVjvy4",
    authDomain: "umddining-95442.firebaseapp.com",
    databaseURL: "https://umddining-95442-default-rtdb.firebaseio.com",
    projectId: "umddining-95442",
    storageBucket: "umddining-95442.appspot.com",
    messagingSenderId: "151157337798",
    appId: "1:151157337798:web:f59b5dcd9ded1e4c66b1c7",
    measurementId: "G-CBNYC9N3XX"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, child, get, set, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log(db)

var allData = {}
var names = []
var uids = []

const dbRef = ref(getDatabase());
get(child(dbRef, '/')).then((snapshot) => {
    if (snapshot.exists()) {
        allData = snapshot.val();
        for (let key in allData) {
            names.push(allData[key]['name']);
            uids.push(key)
        }
        // console.log(allData)
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});

// console.log(allData)

function generatePlot(passedData) {
    var traces = {
        'Yahentamitsi': {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: 'Yahentamitsi',
            marker: {
                size: 12,
                symbol: 'circle',
                color: 'rgba(31, 119, 180, 1)'
            }
        },
        '251': {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: '251',
            marker: {
                size: 12,
                symbol: 'diamond',
                color: 'rgba(255, 127, 14, 1)'
            }
        },
        'South': {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: 'South',
            marker: {
                size: 12,
                symbol: 'square',
                color: 'rgba(44, 160, 44, 1)'
            }
        },
    }

    if (passedData == 'from form') {
        try {
            let x = JSON.parse(document.getElementById('copied').value)

            console.log(Object.values(x))
            console.log(Object.values(x)[0])

            // clean data into database type format
            passedData = {
                'name': x['name']
            }
            var cleanedSwipes = {}
            Object.values(x['swipes']).forEach((swipe) => {
                var swipe_loc = swipe[1]
                if (swipe_loc != undefined) {
                    cleanedSwipes[swipe[2].substring(0,swipe[2].length-2)] = {
                        'location': swipe[1]
                    }
                }
            })
            passedData['swipes'] = cleanedSwipes
        } catch(e) {
            console.log(e)
            alert('There was an issue with the data you pasted. Try reloading and going through the instructions again.')
            return false
        }
    }

    console.log('))))))))))))))))))))))))))))))))))))))))')
    console.log(passedData)

    for (const [datetime, swipe] of Object.entries(passedData['swipes'])) {
        var swipe_loc = swipe['location']
        var date = new Date(datetime.substring(0,10) + 'T00:00:00')
        // console.log(datetime)
        // console.log(datetime.substring(11,19))
        var time = new Date('2022-12-14T' + datetime.substring(11,19))
        var rough_time = time.getHours() + time.getMinutes()/60 + time.getSeconds()/3600
        // console.log(rough_time)
        // console.log(time.getMinutes())
        // console.log(time.getSeconds())

        if (swipe_loc.includes('Yahentamitsi') || swipe_loc.includes('Yahentamitsu')) {
            traces['Yahentamitsi']['x'].push(date)
            traces['Yahentamitsi']['y'].push(rough_time)
            traces['Yahentamitsi']['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
        } else if (swipe_loc.includes('251')) {
            traces['251']['x'].push(date)
            traces['251']['y'].push(rough_time)
            traces['251']['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
        } else if (swipe_loc.includes('SDH')) {
            traces['South']['x'].push(date)
            traces['South']['y'].push(rough_time)
            traces['South']['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
        }
    }

    console.log(traces)

    var data = [traces['Yahentamitsi'], traces['251'], traces['South']];

    var layout = {
        yaxis: {
            range: [6, 22],
            title: 'Time of day'
        },
        xaxis: {
            title: 'Date'
        },
        showlegend: true,
        legend: {
            x: 0,
            y: -0.2
        },
        title: 'Dining Hall Swipes'
    };

    Plotly.newPlot('plot1', data, layout);

    return false
}

function copyCode() {
    console.log('BBBBBBBBb')
    navigator.clipboard.writeText(`
        console.log('QUICK! PRESS TAB!')
        setTimeout(async()=>{
            metadata = document.getElementsByClassName('mb-0')[0].innerHTML
            try {
                await navigator.clipboard.writeText(JSON.stringify({
                    swipes: $('#balance-trans').DataTable().rows().data(),
                    uid: metadata.substring(metadata.indexOf('(UID: ')+6, metadata.indexOf(', SEMESTER')),
                    name: metadata.substring(3, metadata.indexOf('(UID: ')-1)
                }));
                console.log('Data successfully copied.');
            }
            catch(e) {
                console.log('Data copy failed. Maybe you didn\\'t press tab quickly enough?\\nPaste the code and try again.');
            }
        }, 3000)
    `)
    document.getElementById('copyIndicator').innerHTML = 'Code copied!'
    return false
}

function submitToDb() {
    try {
        if (confirm('WARNING: By pressing OK, you acknowledge that you are allowing your name and the associated swipe data you submit to be viewed by anyone who comes to this website.')) {
            let x = JSON.parse(document.getElementById('copied').value)
        
            var cleanedSwipes = {}
            Object.values(x['swipes']).forEach((swipe) => {
                var swipe_loc = swipe[1]
                if (swipe_loc != undefined) {
                    cleanedSwipes[swipe[2].substring(0,swipe[2].length-2)] = {
                        'location': swipe[1]
                    }
                }
            })
        
            var toSubmit = {
                'name': x['name'],
                'swipes': cleanedSwipes
            }
        
            console.log(toSubmit)
        
            update(ref(db, '/' + x['uid'] + '/swipes'), cleanedSwipes);
            update(ref(db, '/' + x['uid']), {'name': x['name']});
        
            window.location.reload()
            return false
        } else {return false}
    } catch(e) {
        console.log(e)
        alert('There was an issue with the data you pasted. Try reloading and going through the instructions again.')
        return false
    }

}

$(function() {
    $("#autocomplete").autocomplete({
        source: names
    });
    $("#compare1").autocomplete({
        source: names
    });
    $("#compare2").autocomplete({
        source: names
    });
    $("#compare3").autocomplete({
        source: names
    });
    $("#compare4").autocomplete({
        source: names
    });
    $("#compare5").autocomplete({
        source: names
    });
});

function getData() {
    let x = document.getElementById('autocomplete').value
    console.log(x)
    console.log(allData[uids[names.indexOf(x)]])
    generatePlot(allData[uids[names.indexOf(x)]])
}

function compare() {
    let x = document.getElementById('autocomplete').value
    let compares = [
        x,
        document.getElementById('compare1').value,
        document.getElementById('compare2').value,
        document.getElementById('compare3').value,
        document.getElementById('compare4').value,
        document.getElementById('compare5').value
    ]

    var uid_compares = []
    compares.forEach((c) => {
        if (c != '') {uid_compares.push(uids[names.indexOf(c)])}
    })

    var relevSwipeDatetimes = []
    uid_compares.forEach((u) => {
        console.log(allData[u]['swipes'])
        relevSwipeDatetimes.push(Object.entries(allData[u]['swipes']).map(function([dt, swipe]) {
            var swipe_loc = swipe['location']
            if (swipe_loc.includes('Yahentamitsi') || swipe_loc.includes('Yahentamitsu')) swipe_loc = 'Yahentamitsi'
            else if (swipe_loc.includes('251')) swipe_loc = '251'
            else if (swipe_loc.includes('SDH')) swipe_loc = 'South'
            else return null
            return {
                'date': new Date(dt),
                'location': swipe_loc
            }
        }).filter(s => s != null))
        console.log(structuredClone(relevSwipeDatetimes[0]))
    })

    console.log('........................................')
    console.log(structuredClone(relevSwipeDatetimes))
    
    var combinations = {}
    combinations[0] = relevSwipeDatetimes[0]
    console.log(structuredClone(combinations))

    for (let i = 1; i < relevSwipeDatetimes.length; i++) {
        var combinations_old = structuredClone(combinations)
        for (const [index, sub_arr] of Object.entries(combinations)) {
            combinations[index + i.toString()] = []
        }
        
        var solos = []
        relevSwipeDatetimes[i].forEach((swipe2) => {
            var dt2 = swipe2['date']
            var loc2 = swipe2['location']
            var overlap = false;
            for (const [index, sub_arr] of Object.entries(combinations_old)) {
                sub_arr.every((swipe1) => {
                    var dt1 = swipe1['date']
                    var loc1 = swipe1['location']
                    // console.log(Math.abs(dt1 - dt2))
                    if (Math.abs(dt1 - dt2) < 30000 && loc1 == loc2) {
                        if (dt1 - dt2 < 0) {
                            combinations[index + i.toString()].push(swipe1)
                            combinations[index].splice(combinations[index].findIndex(q => q['date'].toString() == swipe1['date'].toString()), 1)
                        } else {
                            combinations[index + i.toString()].push(swipe2)
                            combinations[index].splice(combinations[index].findIndex(q => q['date'].toString() == swipe1['date'].toString()), 1)
                        }
                        // console.log(swipe1['date'])
                        // console.log(structuredClone(combinations[index]))
                        // console.log(combinations[index].findIndex(q => q['date'].toString() == swipe1['date'].toString()))
                        overlap = true;
                        return false
                    } else return true
                })
            }
            if (!overlap) solos.push(swipe2)
        })
        combinations[i] = solos
    }
    console.log(uid_compares)
    console.log(combinations)
    console.log('aAAAAAAAAAAAAAAAAAAAAAAA')

    var indexNameMap = {}
    Object.keys(combinations).forEach((index) => {
        var relevNames = []
        for (const c of index.toString()) {
            relevNames.push(names[uids.indexOf(uid_compares[c])])
        }
        indexNameMap[index] = relevNames
    })
    console.log(indexNameMap)

    var traces = {}

    var colors = [
        'rgba(255, 0, 0, '+1/uid_compares.length+')',
        'rgba(0, 255, 0, '+1/uid_compares.length+')',
        'rgba(0, 0, 255, '+1/uid_compares.length+')',
        'rgba(255, 255, 0, '+1/uid_compares.length+')',
        'rgba(255, 0, 255, '+1/uid_compares.length+')',
        'rgba(0, 255, 255, '+1/uid_compares.length+')',
    ]

    var table1Content = `<b><tr>
                        <td>Name</td>
                        <td>First swipe</td>
                        <td>Last swipe</td>
                        <td>Total</td>
                        <td>251</td>
                        <td>South</td>
                        <td>Yahentamitsi</td>
                        </tr></b>`
    uid_compares.forEach((c) => {
        var color = colors[uid_compares.indexOf(c)]
        traces['Yahentamitsi'+c] = {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: 'Yahentamitsi'+c,
            marker: {
                size: 12,
                symbol: 'circle',
                color: color
            }
        }
        traces['251'+c] = {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: 'Yahentamitsi'+c,
            marker: {
                size: 12,
                symbol: 'diamond',
                color: color
            }
        }
        traces['South'+c] = {
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: 'Yahentamitsi'+c,
            marker: {
                size: 12,
                symbol: 'square',
                color: color
            }
        }
        var count251 = 0
        var countSouth = 0
        var countY = 0
        for (const [datetime, swipe] of Object.entries(allData[c]['swipes'])) {
            var swipe_loc = swipe['location']
            var date = new Date(datetime.substring(0,10) + 'T00:00:00')
            var time = new Date('2022-12-14T' + datetime.substring(11,19))
            var rough_time = time.getHours() + time.getMinutes()/60 + time.getSeconds()/3600
            if (swipe_loc.includes('Yahentamitsi') || swipe_loc.includes('Yahentamitsu')) {
                traces['Yahentamitsi'+c]['x'].push(date)
                traces['Yahentamitsi'+c]['y'].push(rough_time)
                traces['Yahentamitsi'+c]['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
                countY++
            } else if (swipe_loc.includes('251')) {
                traces['251'+c]['x'].push(date)
                traces['251'+c]['y'].push(rough_time)
                traces['251'+c]['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
                count251++
            } else if (swipe_loc.includes('SDH')) {
                traces['South'+c]['x'].push(date)
                traces['South'+c]['y'].push(rough_time)
                traces['South'+c]['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0'))
                countSouth++
            }
        }

        var swipeDates = Object.keys(allData[c]['swipes'])
        var date1 = new Date(swipeDates[0].substring(0,10) + 'T00:00:00')
        var date2 = new Date(swipeDates[swipeDates.length-1].substring(0,10) + 'T00:00:00')
        var date1txt = date1.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
        var date2txt = date2.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
        var totalCount = count251+countSouth+countY
        table1Content += '<tr><td>'+names[uids.indexOf(c)]+'</td><td>'+date1txt+'</td><td>'+date2txt+'</td><td>'+totalCount+'</td><td>'+count251+'</td><td>'+countSouth+'</td><td>'+countY+'</td></tr>'
    })

    console.log(traces)

    var data = Object.values(traces);

    var layout = {
        yaxis: {
            range: [6, 22],
            title: 'Time of day'
        },
        xaxis: {
            title: 'Date'
        },
        showlegend: true,
        legend: {
            x: 0,
            y: -0.2
        },
        title: 'Dining Hall Swipes'
    };

    Plotly.newPlot('plot1', data, layout);






    var traces = {}

    var colors = [
        'rgba(255, 0, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 0, 255, 1)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 0, 0, 1)'
    ]

    var j = 0
    var table2Content = ''
    var row1Content = '<td></td>'
    var colNames = []
    uid_compares.forEach((u, i) => {
        if (i%2 == 0) {
            row1Content += '<td>' + names[uids.indexOf(u)] + '</td>'
            colNames.push(u)
        }
    })
    table2Content += '<tr>' + row1Content + '</tr>'
    uid_compares.forEach((u, i) => {
        if (i%2 != 0 || i==uid_compares.length-1) {
            var rowContent = '<td>' + names[uids.indexOf(u)] + '</td>'
            colNames.forEach((c) => {
                if (c != u) {
                    var twoWays = 0
                    Object.keys(combinations).forEach((key) => {
                        if (key.includes(i) && key.includes(uid_compares.indexOf(c))) twoWays += combinations[key].length
                    })
                    rowContent += '<td>' + twoWays + '</td>'
                }
            })

            table2Content += '<tr>' + rowContent + '</tr>'
        }
    })
    // if (uid_compares.length%2 != 0) {
    //     table2Content += '<tr><td>' + uid_compares[uid_compares.length-1] + '</td></tr>'
    // }
    for (const [indices, swipes] of Object.entries(combinations)) {
    
    }


    for (const [indices, swipes] of Object.entries(combinations)) {
    // comparisons.forEach((c, i) => {
        var color = colors[j]
        console.log(color)
        traces['Yahentamitsi'+indices] = {
            name: 'Yahentamitsi'+indices,
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: '',
            marker: {
                size: 12,
                symbol: 'circle',
                color: color
            }
        }
        traces['251'+indices] = {
            name: '251'+indices,
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: '',
            marker: {
                size: 12,
                symbol: 'diamond',
                color: color
            }
        }
        traces['South'+indices] = {
            name: 'South'+indices,
            x: [],
            y: [],
            text: [],
            mode: 'markers',
            type: 'scatter',
            hovertemplate: '%{x}' +
            '<br>%{text}',
            name: '',
            marker: {
                size: 12,
                symbol: 'square',
                color: color
            }
        }
        swipes.forEach((swipe) => {
            var swipe_loc = swipe['location']
            var datetime = swipe['date']
            var date = new Date(datetime)
            date.setHours(0,0,0,0)
            var time = new Date(datetime)
            time.setFullYear(2022, 12, 14)
            // console.log(swipe_loc)
            var rough_time = time.getHours() + time.getMinutes()/60 + time.getSeconds()/3600
            if (swipe_loc + indices in traces) {
                traces[swipe_loc + indices]['x'].push(date)
                traces[swipe_loc + indices]['y'].push(rough_time)
                traces[swipe_loc + indices]['text'].push(time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0')
                                                        + '<br>' + indexNameMap[indices].join(', '))
            }
        })
        j++;
    }

    console.log(traces)

    var data = Object.values(traces);

    var layout = {
        yaxis: {
            range: [6, 22],
            title: 'Time of day'
        },
        xaxis: {
            title: 'Date'
        },
        showlegend: true,
        legend: {
            x: 0.5,
            y: -1
        },
        title: 'Dining Hall Swipes'
    };

    Plotly.newPlot('plot2', data, layout);

    // uid_compares.forEach()
    document.getElementById('table1').innerHTML = table1Content
    document.getElementById('table2').innerHTML = table2Content

    console.log(x)
    console.log(allData[uids[names.indexOf(x)]])
    return false
}

window.copyCode = copyCode
window.generatePlot = generatePlot
window.submitToDb = submitToDb
window.getData = getData
window.compare = compare