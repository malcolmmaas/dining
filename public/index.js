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
            marker: { size: 12 }
        },
        '251': {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: '251',
            marker: { size: 12 }
        },
        'South': {
            x: [],
            y: [],
            mode: 'markers',
            type: 'scatter',
            name: 'South',
            marker: { size: 12 }
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
});

function getData() {
    let x = document.getElementById('autocomplete').value
    console.log(x)
    console.log(allData[uids[names.indexOf(x)]])
    generatePlot(allData[uids[names.indexOf(x)]])
}

window.copyCode = copyCode
window.generatePlot = generatePlot
window.submitToDb = submitToDb
window.getData = getData