
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

export interface Control {
  _id: string;
  controlId: string;
  title: string;
  description: string;
  implementation: string;
  section: string;
  riskLevel: 'high' | 'medium' | 'low';
  references: string[];
}

export const useCompliance = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [controls, setControls] = useState<Control[]>([]);

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

    setControls([
      {
        _id: 'c1',
        controlId: 'CIS-1.1',
        title: 'Maintain Inventory of Authorized Software',
        description: 'Maintain an up-to-date inventory of all authorized software that is installed or approved for installation on enterprise assets.',
        implementation: 'Use automated discovery tools to identify all software installed on systems. Maintain a centralized software inventory database.',
        section: 'Inventory and Control of Enterprise Assets',
        riskLevel: 'high',
        references: ['CIS Controls v8', 'NIST CSF']
      },
      {
        _id: 'c2',
        controlId: 'CIS-1.2',
        title: 'Maintain Inventory of Authorized Hardware',
        description: 'Maintain an up-to-date inventory of all authorized hardware that is connected to the enterprise network.',
        implementation: 'Deploy network discovery tools and maintain hardware asset databases with regular updates.',
        section: 'Inventory and Control of Enterprise Assets',
        riskLevel: 'high',
        references: ['CIS Controls v8', 'ISO 27001']
      },
      {
        _id: 'c3',
        controlId: 'CIS-2.1',
        title: 'Establish Software Allowlisting',
        description: 'Establish and maintain a software allowlist policy.',
        implementation: 'Configure application control policies to only allow execution of authorized software.',
        section: 'Inventory and Control of Software Assets',
        riskLevel: 'medium',
        references: ['CIS Controls v8']
      }
    ]);
  }, []);

  return { teams, devices, controls };
};
