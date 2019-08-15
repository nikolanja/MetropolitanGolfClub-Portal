const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const endpoint = 'https://mgsc-club.firebaseapp.com/';
const dropbox_access_token = 'sdfasdfUwegsgwegx';

const cors = require('cors')({
    origin: true,
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('SG.q14myw0rKNu4Q0c');
let INVITE_TEMPLATE = 'd-a83b64sde38abd'
let PASSCODE_TEMPLATE = 'd-aab4weg71a0f40b'
let siteDomain = 'https://mgsc-club.firebaseapp.com/'

function sendInviteEmail(email, passCode, userID){
    const msg = {
        to: email,
        from: "Metropolitan Golf & Social Club (“MGSC”) <membership@mgsc.club>",
        subject: 'MGSC Invitation',
        templateId: INVITE_TEMPLATE,
        dynamic_template_data: {
            user_passcode: passCode,
            user_link: siteDomain + 'home?' + userID
        }
    }

    sgMail.send(msg, (error, response) => {
        if(error){
            console.log('sending mail is failed.')
            console.log(error)
            console.log('-----------------')
        }
    })
}

function newUsercode() {
    return Math.floor((Math.random() * 1000000) + 1);
}

exports.createUser = functions.database.ref('requestUsers/{userId}').onCreate(async (snap) => {

    const data = snap.val();
    const passcode = newUsercode()
    const userRef = snap.ref;

    userRef.update({userCode: passcode})

	var excel = require('excel4node');
    var workbook = new excel.Workbook();

    var worksheet = workbook.addWorksheet('user info');
    // Create a reusable style
    var style = workbook.createStyle({
        font: {
            color: '#404040',
            size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    worksheet.cell(1, 1).string('Full Name').style(style);          worksheet.cell(1, 2).string(data.fullName === undefined ? '' : data.fullName).style(style);
    worksheet.cell(2, 1).string('Email').style(style);              worksheet.cell(2, 2).string(data.email).style(style);
    worksheet.cell(3, 1).string('Age').style(style);                worksheet.cell(3, 2).string(data.age === undefined ? '' : data.age).style(style);
    worksheet.cell(4, 1).string('Linkedin Url').style(style);       worksheet.cell(4, 2).string(data.linkedinUrl === undefined ? '' : data.linkedinUrl).style(style);
    worksheet.cell(5, 1).string('Prior Club').style(style);         worksheet.cell(5, 2).string(data.oldClub === undefined ? '' : data.oldClub).style(style);
    worksheet.cell(6, 1).string('passcode').style(style);           worksheet.cell(6, 2).string(String(passcode)).style(style);
    worksheet.cell(7, 1).string('url').style(style);                worksheet.cell(7, 2).string(endpoint + "home?" + data.userID).style(style);

    let filename = data.fullName === undefined ? 'invite' : data.fullName;

    if(data.fullName === undefined && data.age === undefined){
        //invited user
        sendInviteEmail(data.email, passcode, data.userID);
    }

    return workbook.writeToBuffer().then((buffer) => {
        const request = require('request');
        let options = {
            method: "POST",
            url: 'https://content.dropboxapi.com/2/files/upload',
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "Bearer " + dropbox_access_token,
                "Dropbox-API-Arg": JSON.stringify({
                    "path": "/MGSC user request/" + filename.trim() + data.userID + '.xlsx',
                    "mode": "overwrite",
                    "autorename": true,
                    "mute": false
                }),
            },
            body: buffer
        };

        return request(options, (err, res, body) => {
            if(err){

                return admin.database().ref("/Errors/" + data.userID).set({
                    error: err.toString()
                });
            }else {

                return userRef.update({
                    checked: true
                });
            }
        })
    })
});

exports.checkUserVerification = functions.https.onRequest(async (req, res)=>{
    return cors(req, res, ()=>{
        let userid = req.body.userid
        let passcode = req.body.passcode;

        let ref = admin.database().ref('requestUsers/' + userid)

        ref.once('value', (snapshot) => {
            if(snapshot.exists()){
                if(snapshot.val().userCode === parseInt(passcode, 10)){
                    res.status(200).send({success: true})

                    ref.update({
                        userCode: newUsercode()
                    })
                }else {
                    res.status(200).send({success: false, error: 'not matched'})
                }
            }else {
                res.status(200).send({success: false, error: 'there is no user.'})
            }
        })
    })
})

exports.mgscAdminCheck = functions.https.onRequest(async (req, res) => {
    return cors(req, res, () => {
        let param = req.body.checkStr;

        admin.database().ref('check').once('value', (snapshot) => {
            if(snapshot.exists()){
                if(param === snapshot.val()){
                    res.status(200).send({success: true});
                }else {
                    res.status(200).send({success: false, error: 'not match'});
                }
            }else {
                res.status(200).send({success: false, error: 'unknown error'});
            }
        })
    })
})

exports.sendPasscodeMail = functions.https.onRequest(async (req, res) => {
    return cors(req, res, () => {
        let email = req.body.email
        admin.database().ref('requestUsers').orderByChild('email').equalTo(email).once('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(snap =>{
                    let user = snap.val()
                    let passCode = user.userCode
                    const msg = {
                        to: email,
                        from: "Metropolitan Golf & Social Club (“MGSC”) <membership@mgsc.club>",
                        subject: 'MGSC Passcode',
                        templateId: PASSCODE_TEMPLATE,
                        dynamic_template_data: {
                            user_passcode: passCode,
                        }
                    }
                
                    sgMail.send(msg, (error, response) => {
                        if(error){
                            console.log('sending mail is failed.')
                            console.log(error)
                            console.log('-----------------')
                        }
                    })
                    return res.status(200).send({success: true});
                })
            }else {
                res.status(200).send({success: false, error: "There is no such user."})
            }
        })
    })
})

exports.downloadDatabase = functions.https.onRequest(async (req, res) => {
    return cors(req, res, () => {
        let token = req.body.token;
        admin.database().ref('check').once('value', (snapshot) => {
            if(token === snapshot.val()){

                var excel = require('excel4node');
                var workbook = new excel.Workbook();
                // Create a reusable style
                var style = workbook.createStyle({
                    font: {
                        color: '#404040',
                        size: 12
                    },
                    numberFormat: '$#,##0.00; ($#,##0.00); -'
                });

                var signedWorkSheet = workbook.addWorksheet('signed user list');
                signedWorkSheet.cell(1, 1).string('No').style(style);
                signedWorkSheet.cell(1, 2).string('Full Name').style(style);
                signedWorkSheet.cell(1, 3).string('Email').style(style);
                signedWorkSheet.cell(1, 4).string('Age').style(style);
                signedWorkSheet.cell(1, 5).string('Occupation').style(style);
                signedWorkSheet.cell(1, 6).string('Linkedin Url').style(style);
                signedWorkSheet.cell(1, 7).string('Prior Club').style(style);
                signedWorkSheet.cell(1, 8).string('Live State').style(style);
                signedWorkSheet.cell(1, 9).string('Live City').style(style);
                signedWorkSheet.cell(1, 10).string('Live Neighbor').style(style);
                signedWorkSheet.cell(1, 11).string('Work State').style(style);
                signedWorkSheet.cell(1, 12).string('Work City').style(style);
                signedWorkSheet.cell(1, 13).string('Work Neighbor').style(style);
                signedWorkSheet.cell(1, 14).string('Membership').style(style);
                signedWorkSheet.cell(1, 15).string('Link').style(style);
                let i = 1;
                admin.database().ref('users').once('value', (snapshot) => {
                    if(snapshot.exists()){
                        snapshot.forEach(snap =>{
                            i++;
                            var data = snap.val();
                            if(data.fullName === undefined) data.fullName = '';
                            if(data.email === undefined) data.email = '';
                            if(data.age === undefined) data.age = '';
                            if(data.occupation === undefined) data.occupation = '';
                            if(data.linkedinUrl === undefined) data.linkedinUrl = '';
                            if(data.oldClub === undefined) data.oldClub = '';
                            if(data.liveState === undefined) data.liveState = '';
                            if(data.liveCity === undefined) data.liveCity = '';
                            if(data.liveNeighbor === undefined) data.liveNeighbor = '';
                            if(data.workState === undefined) data.workState = '';
                            if(data.workCity === undefined) data.workCity = '';
                            if(data.workNeighbor === undefined) data.workNeighbor = '';

                            signedWorkSheet.cell(i, 1).string((i-1) + ' ').style(style);
                            signedWorkSheet.cell(i, 2).string(data.fullName).style(style);
                            signedWorkSheet.cell(i, 3).string(data.email).style(style);
                            signedWorkSheet.cell(i, 4).string(data.age).style(style);
                            signedWorkSheet.cell(i, 5).string(data.occupation).style(style);
                            signedWorkSheet.cell(i, 6).string(data.linkedinUrl).style(style);
                            signedWorkSheet.cell(i, 7).string(data.oldClub).style(style);
                            signedWorkSheet.cell(i, 8).string(data.liveState).style(style);
                            signedWorkSheet.cell(i, 9).string(data.liveCity).style(style);
                            signedWorkSheet.cell(i, 10).string(data.liveNeighbor).style(style);
                            signedWorkSheet.cell(i, 11).string(data.workState).style(style);
                            signedWorkSheet.cell(i, 12).string(data.workCity).style(style);
                            signedWorkSheet.cell(i, 13).string(data.workNeighbor).style(style);
                            signedWorkSheet.cell(i, 14).string(data.membership === undefined ? '' : (data.membership.title + " / " + data.membership.price)).style(style);
                            signedWorkSheet.cell(i, 15).string(siteDomain + 'home?' + data.userRegID).style(style);
                        })
                    }

                    workbook.writeToBuffer().then((buffer) => {
                        res.write(buffer);
                        return res.end();
                    }).catch((error) => {
                        return res.status(200).send({success: false, error: error});
                    });
                })
            } else {
                res.status(200).send({success: false, error: 'Invalid request.'});
            }
        })
    })
})