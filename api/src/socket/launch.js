const Rx = require('rxjs');
const obs = new Rx.Observable();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A new socket has connected: ', socket.id);

        io.emit('connected', {id: socket.id});
    });

    io.on('joinLaunch', (socket => {
        console.log('sock', socket);
    }));

};
