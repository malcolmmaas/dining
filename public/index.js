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
            mode: 'markers',
            type: 'scatter',
            name: 'Yahentamitsi',
            marker: {
                size: 12,
                symbol: 'circle',
                color: 'rgba(31, 119, 180, 0.5)'
            }
        },
        '251': {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: '251',
            marker: {
                size: 12,
                symbol: 'triangle-up',
                color: 'rgba(255, 127, 14, 0.5)'
            }
        },
        'South': {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: 'South',
            marker: {
                size: 12,
                symbol: 'square',
                color: 'rgba(44, 160, 44, 0.5)'
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
        var time = new Date('2022-12-14T' + datetime.substring(11,19))
        var rough_time = time.getHours() + time.getMinutes()/60 + time.getSeconds()/3600

        if (swipe_loc.includes('Yahentamitsi') || swipe_loc.includes('Yahentamitsu')) {
            traces['Yahentamitsi']['x'].push(date)
            traces['Yahentamitsi']['y'].push(rough_time)
        } else if (swipe_loc.includes('251')) {
            traces['251']['x'].push(date)
            traces['251']['y'].push(rough_time)
        } else if (swipe_loc.includes('SDH')) {
            traces['South']['x'].push(date)
            traces['South']['y'].push(rough_time)
        }
    }

    console.log(traces)

    var data = [traces['Yahentamitsi'], traces['251'], traces['South']];

    var layout = {
        // xaxis: {
        //     range: [ 0.75, 5.25 ]
        // },
        // yaxis: {
        //     range: [0, 24]
        // },
        title: 'Dining Hall Swipes'
    };

    Plotly.newPlot('plot', data, layout);

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

    relevSwipeDatetimes = []
    uid_compares.forEach((u) => {
        relevSwipeDatetimes.push(Object.keys(allData[u]['swipes']))
    })

    var overlaps = []

    var comparisons = [];
    var temp = [];
    var slent = Math.pow(2, uid_compares.length);

    for (var i = 0; i < slent; i++) {
        temp = [];
        for (var j = 0; j < uid_compares.length; j++) {
            if ((i & Math.pow(2, j))) {
                temp.push(uid_compares[j]);
            }
        }
        if (temp.length > 1) {
            comparisons.push(temp);
        }
    }

    console.log('[[[[[[[[[[[[[[[[[[[[[[')
    console.log(comparisons)

    function findOverlaps(uid_group) {
        if (c_arr.length == 2) {
            relevSwipeDatetimes[uid_compares.indexOf(c_arr[0])].forEach((dt1) => {
                relevSwipeDatetimes[uid_compares.indexOf(c_arr[1])].forEach((dt2) => {
                    if (Math.abs(dt2-dt1) < 30000) {
                        
                    }
                })
            })
        } else {
            uid_group.forEach((u) => {
                console.log(uid_group.splice(uid_group.indexOf(u), 1))
                findOverlaps(uid_group.splice(uid_group.indexOf(u), 1))
            })
            
        }
    }

    findOverlaps(uid_compares)

    // comparisons.forEach((c_arr) => {
    //     overlaps.push(findOverlaps(c_arr))
    // })

    // var comparisons = []
    // uid_compares.forEach((u, i) => {
    //     if (i>0) {comparisons.push(u)}
    //     comparisons.push([])
    // })


    var traces = {}

    // 'Yahentamitsi': {
    //     x: [],
    //     y: [],
    //     mode: 'markers',
    //     type: 'scatter',
    //     name: 'Yahentamitsi',
    //     marker: {
    //         size: 12,
    //         color: 'rgba(31, 119, 180, 0.5)'
    //     }
    // },

    var colors = [
        'rgba(255, 0, 0, '+1/uid_compares.length+')',
        'rgba(0, 255, 0, '+1/uid_compares.length+')',
        'rgba(0, 0, 255, '+1/uid_compares.length+')',
        'rgba(255, 255, 0, '+1/uid_compares.length+')',
        'rgba(255, 0, 255, '+1/uid_compares.length+')',
        'rgba(0, 255, 255, '+1/uid_compares.length+')',
    ]

    // var colors = [
    //     'rgba(31, 119, 180, '+1/uid_compares.length+')',
    //     'rgba(255, 127, 14, '+1/uid_compares.length+')',
    //     'rgba(44, 160, 44, '+1/uid_compares.length+')',
    //     'rgba(255, 127, 14, '+1/uid_compares.length+')',
    //     'rgba(255, 127, 14, '+1/uid_compares.length+')',
    //     'rgba(255, 127, 14, '+1/uid_compares.length+')',
    // ]

    uid_compares.forEach((c) => {
        var color = colors[uid_compares.indexOf(c)]
        traces['Yahentamitsi'+c] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: 'Yahentamitsi'+names[uids.indexOf(c)],
            marker: {
                size: 12,
                symbol: 'circle',
                color: color
            }
        }
        traces['251'+c] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: '251'+names[uids.indexOf(c)],
            marker: {
                size: 12,
                symbol: 'diamond',
                color: color
            }
        }
        traces['South'+c] = {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: 'South'+names[uids.indexOf(c)],
            marker: {
                size: 12,
                symbol: 'square',
                color: color
            }
        }
        for (const [datetime, swipe] of Object.entries(allData[c]['swipes'])) {
            var swipe_loc = swipe['location']
            var date = new Date(datetime.substring(0,10) + 'T00:00:00')
            var time = new Date('2022-12-14T' + datetime.substring(11,19))
            var rough_time = time.getHours() + time.getMinutes()/60 + time.getSeconds()/3600
            if (swipe_loc.includes('Yahentamitsi') || swipe_loc.includes('Yahentamitsu')) {
                traces['Yahentamitsi'+c]['x'].push(date)
                traces['Yahentamitsi'+c]['y'].push(rough_time)
            } else if (swipe_loc.includes('251')) {
                traces['251'+c]['x'].push(date)
                traces['251'+c]['y'].push(rough_time)
            } else if (swipe_loc.includes('SDH')) {
                traces['South'+c]['x'].push(date)
                traces['South'+c]['y'].push(rough_time)
            }
        }
    })

    console.log(traces)

    // var data = [traces['Yahentamitsi'], traces['251'], traces['South']];
    var data = Object.values(traces);

    var layout = {
        title: 'Dining Hall Swipes'
    };

    Plotly.newPlot('plot', data, layout);




    compares.forEach((c) => {

    })
    console.log(x)
    console.log(allData[uids[names.indexOf(x)]])
    // generatePlot(allData[uids[names.indexOf(x)]])
    return false
}

window.copyCode = copyCode
window.generatePlot = generatePlot
window.submitToDb = submitToDb
window.getData = getData
window.compare = compare