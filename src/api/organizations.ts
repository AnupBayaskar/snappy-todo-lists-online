
export interface Team {
  _id: string;
  name: string;
  adminId: string;
}

export const getTeams = async () => {
  // Mock API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        teams: [
          { _id: 'team1', name: 'Security Team', adminId: 'user1' },
          { _id: 'team2', name: 'IT Operations', adminId: 'user2' }
        ]
      });
    }, 500);
  });
};

export const getCurrentOrganization = async () => {
  // Mock API response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        organization: {
          _id: 'org1',
          name: 'TechCorp Solutions',
          leaderId: 'user1'
        }
      });
    }, 500);
  });
};
