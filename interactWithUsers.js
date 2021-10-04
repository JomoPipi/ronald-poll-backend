

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ronald-poll-c6ce7.firebaseio.com'
});

const db = admin.firestore();


const MAX_LIST_SIZE = 100

const responses = db
  .collection('hotdog-sandwich-responses')
  .doc('all-responses')

async function getDocument(callback) {
  const doc = await responses.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    callback(doc.data())
  }
}

async function interactWithUsers(io) {

  getDocument(mostRecent => {
    console.log('here: ',mostRecent.responses)
    io.on('connection', (socket) => {
      console.log('a user has connected!!')
      
      socket.on('user-answer', ({ answerIsYes, answerDetails }) => {
        mostRecent.responses.unshift({ answerIsYes, answerDetails })
        mostRecent.responses.length = Math.min(MAX_LIST_SIZE, mostRecent.responses.length)
        io.emit('responses', mostRecent.responses)
        responses.set(mostRecent)
      }) 
    });
  })
};

module.exports = interactWithUsers;