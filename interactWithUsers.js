

// const admin = require('firebase-admin');

const MAX_LIST_SIZE = 100
const mostRecentResponses = []

function interactWithUsers(io) {
  io.on('connection', (socket) => {
    console.log('a user has connected!!')
    
    socket.on('user-answer', ({ answerIsYes, answerDetails }) => {
      // console.log('a user has answered!!')
      mostRecentResponses.unshift({ answerIsYes, answerDetails })
      mostRecentResponses.length = Math.min(MAX_LIST_SIZE, mostRecentResponses.length)
      io.emit('responses', mostRecentResponses)
    }) 
  });
};

module.exports = interactWithUsers;