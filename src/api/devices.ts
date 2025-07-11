
export interface Device {
  _id: string;
  name: string;
  type: string;
  teamId: string;
}

export const getDevices = async () => {
  // Mock API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        devices: [
          { _id: 'device1', name: 'Web Server 01', type: 'Ubuntu Server 20.04', teamId: 'team1' },
          { _id: 'device2', name: 'Database Server', type: 'CentOS 8', teamId: 'team1' },
          { _id: 'device3', name: 'Load Balancer', type: 'NGINX', teamId: 'team2' }
        ]
      });
    }, 500);
  });
};
