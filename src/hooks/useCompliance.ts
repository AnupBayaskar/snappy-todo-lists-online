
import { useState, useEffect } from 'react';

export interface Team {
  _id: string;
  name: string;
}

export interface Device {
  _id: string;
  name: string;
  type: string;
  teamId: string;
}

export const useCompliance = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Mock data - in real app this would come from API
    setTeams([
      { _id: '1', name: 'Security Team' },
      { _id: '2', name: 'IT Operations' }
    ]);

    setDevices([
      { _id: '1', name: 'Web Server 01', type: 'Ubuntu Server 20.04', teamId: '1' },
      { _id: '2', name: 'Database Server', type: 'CentOS 8', teamId: '1' },
      { _id: '3', name: 'John Laptop', type: 'Windows 11 Pro', teamId: '2' }
    ]);
  }, []);

  return { teams, devices };
};
