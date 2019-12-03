export const SocketEvents = {
    connect: 'connect',
    error: 'error',
    joinRoom: 'rooms.join',
    leaveRoom: 'rooms.leave',
    bet: 'launches.bet',
    newLaunchCountdown: 'launches.newLaunchCountdown',
    launchInitiated: 'launches.launchInitiated',
    launchCompleted: 'launches.launchCompleted',
    newBets: 'launches.newBets',
    playerConnected: 'players.playerConnected',
    getPlayer: 'players.getPlayer',
};

export const SocketRooms = {
    user: 'rooms.user_',
    launches: 'rooms.launches',
};
