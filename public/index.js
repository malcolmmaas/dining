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
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log(db)

const dbRef = ref(getDatabase());
get(child(dbRef, 'test')).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});



function generatePlot() {
    // console.log('thing')
    // return false
    var b = document.forms['theform']
    console.log('b')
    var d = document.forms["theform"]["copied"].value
    console.log('d')
    // return false
    let x = JSON.parse(document.forms["theform"]["copied"].value)
    console.log('DSKfhkjhfkgfdkfjdlkjhfsdhkuhlisdhkgjfkfc')
    // return false
    try {

        console.log(Object.values(x))
        console.log(Object.values(x)[0])

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

        console.log('a')
        Object.values(x['swipes']).forEach((swipe) => {
            var swipe_loc = swipe[1]
            // console.log('b')
            console.log(swipe_loc)
            if (swipe_loc != undefined) {

                var date = new Date(swipe[2].substring(0,10) + 'T00:00:00')
                var time = new Date('2022-12-14T' + swipe[2].substring(11,19))
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
        })

        console.log(traces)

        // var trace1 = {
        //     x: [1, 2, 3, 4, 5],
        //     y: [1, 6, 3, 6, 1],
        //     mode: 'markers',
        //     type: 'scatter',
        //     name: 'Team A',
        //     marker: { size: 12 }
        // };

        //     var trace2 = {
        //     x: [1.5, 2.5, 3.5, 4.5, 5.5],
        //     y: [4, 1, 7, 1, 4],
        //     mode: 'markers',
        //     type: 'scatter',
        //     name: 'Team B',
        //     marker: { size: 12 }
        // };

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
    }
    catch (err) {
        console.log(err)
        return false
    }

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


// metadata = document.getElementsByClassName('mb-0')[0].innerHTML
// name = metadata.substring(3, metadata.indexOf('(UID: ')-1)
// uid = metadata.substring(metadata.indexOf('(UID: ')+6, metadata.indexOf(', SEMESTER'))


function submitToDb() {
    let x = JSON.parse(document.forms["theform"]["copied"].value)
    console.log('DSKfhkjhfkgfdkfjdlkjhfsdhkuhlisdhkgjfkfc')


    var cleanedSwipeList = []
    Object.values(x['swipes']).forEach((swipe) => {
        console.log(swipe)
        var swipe_loc = swipe[1]
        // console.log('b')
        console.log(swipe_loc)
        if (swipe_loc != undefined) {
            cleanedSwipeList.push(swipe)
        }
    })



    var toSubmit = {
        'name': x['name'],
        'swipes': Object.values(cleanedSwipeList)
    }

    console.log(toSubmit)


    set(ref(db, '/'+x['uid']), toSubmit);


    // console.log(Object.values(x))
    // console.log(Object.values(x)[0])

    return false
}

window.copyCode = copyCode
window.generatePlot = generatePlot
window.submitToDb = submitToDb