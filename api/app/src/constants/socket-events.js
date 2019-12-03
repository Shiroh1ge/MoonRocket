module.exports.SocketEvents = {
    playerConnected: 'players.playerConnected',
    error: 'error',
    joinRoom: 'rooms.join',
    leaveRoom: 'rooms.leave',
    bet: 'launches.bet',
    joinLaunch: 'launches.joinLaunch',
    newLaunchCountdown: 'launches.newLaunchCountdown',
    newLaunch: 'launches.newLaunch',
    launchCompleted: 'launches.launchCompleted',
    newBets: 'launches.newBets',
    getPlayer: 'players.getPlayer'
};

module.exports.SocketRooms = {
    user: 'rooms.user_',
    launches: 'rooms.launches'
};
