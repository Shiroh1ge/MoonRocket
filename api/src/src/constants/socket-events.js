module.exports.SocketEvents = {
    connected: 'connected',
    joinRoom: 'rooms.join',
    leaveRoom: 'rooms.leave',
    bet: 'launches.bet',
    joinLaunch: 'launches.joinLaunch',
    newLaunchCountdown: 'launches.newLaunchCountdown',
    newLaunch: 'launches.newLaunch',
    getPlayer: 'players.getPlayer'
};

module.exports.SocketRooms = {
    user: 'rooms.user_',
    launch: 'rooms.launch',
};
