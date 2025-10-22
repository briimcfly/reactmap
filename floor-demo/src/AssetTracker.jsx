import { useState, useEffect } from 'react';
import './AssetTracker.css';

const AssetTracker = () => {
    const [peopleLocations, setPeopleLocations] = useState([]);

    // Define your floor plan areas with grid positioning
    // gridColumn: "start / span X" where X is number of columns to span
    // gridRow: "start / span X" where X is number of rows to span
    const areas = [
        // Row 1
        {
            id: 'dz-den',
            name: 'DZ Den',
            type: 'Conference Room',
            gridColumn: '1 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: 'stealth',
            name: 'Stealth',
            type: 'Conference Room',
            gridColumn: '2 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: 'dz-zen-den',
            name: 'The Cove',
            type: 'Cubicles/Seating',
            gridColumn: '3 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: 'supply-office',
            name: 'Supply Office',
            type: 'Office',
            gridColumn: '4 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: 'cto-office',
            name: 'CTO Office',
            type: 'Office',
            gridColumn: '5 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: 'president-office',
            name: 'President Office',
            type: 'Office',
            gridColumn: '6 / span 1',
            gridRow: '1 / span 1'
        },

        // Row 2
        {
            id: 'back-room',
            name: 'Back Room',
            type: 'Cubicles/Seating',
            gridColumn: '1 / span 2',
            gridRow: '2 / span 2'
        },
        {
            id: 'front-room',
            name: 'Front Room',
            type: 'Cubicles/Seating',
            gridColumn: '3 / span 2',
            gridRow: '2 / span 2'
        },
        {
            id: '4insite-lobby',
            name: '4insite Lobby',
            type: 'Entry/Lobby',
            gridColumn: '6 / span 1',
            gridRow: '2 / span 1'
        },
        {
            id: 'discovery',
            name: 'Discovery',
            type: 'Conference Room',
            gridColumn: '5 / span 1',
            gridRow: '2 / span 1'
        },
        // Row 3
        {
            id: '4insite-kitchen',
            name: '4insite Kitchen',
            type: 'Kitchen',
            gridColumn: '5 / span 2',
            gridRow: '3 / span 1'
        },
        //Row 4 
        {
            id: 'womens',
            name: 'Womens',
            type: 'Restroom',
            gridColumn: '2 / span 1',
            gridRow: '4 / span 1'
        },
        {
            id: 'mens',
            name: 'Mens',
            type: 'Restroom',
            gridColumn: '3 / span 1',
            gridRow: '4 / span 1'
        }

    ];

    // Mock API call - replace with your actual API endpoint
    const fetchPeopleLocations = async () => {
        try {
            // Replace this URL with your actual backend endpoint
            // const response = await fetch('YOUR_API_ENDPOINT');
            // const data = await response.json();
            // setPeopleLocations(data);

            // Mock data for demonstration
            const mockData = [
                { id: 1, name: 'Alice', avatar: 'A', areaId: '4insite-lobby' },
                { id: 2, name: 'Bob', avatar: 'B', areaId: 'office-1' },
                { id: 3, name: 'Charlie', avatar: 'C', areaId: 'dz-zen-den' },
                { id: 4, name: 'Diana', avatar: 'D', areaId: 'dz-zen-den' },
                { id: 5, name: 'Eve', avatar: 'E', areaId: 'front-room-cubicle-farm' },
            ];
            setPeopleLocations(mockData);
        } catch (error) {
            console.error('Error fetching people locations:', error);
        }
    };

    useEffect(() => {
        fetchPeopleLocations();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchPeopleLocations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Get people in a specific area
    const getPeopleInArea = (areaId) => {
        return peopleLocations.filter(person => person.areaId === areaId);
    };

    return (
        <div className="asset-tracker">
            <h1>4insite BLE Demo</h1>
            <div className="floor-plan">
                {areas.map(area => {
                    const peopleInArea = getPeopleInArea(area.id);
                    const isOccupied = peopleInArea.length > 0;

                    return (
                        <div
                            key={area.id}
                            className={`area ${isOccupied ? 'occupied' : ''}`}
                            style={{
                                gridColumn: area.gridColumn,
                                gridRow: area.gridRow,
                            }}
                        >
                            <div className="area-name">{area.name}</div>
                            <div className="area-type">{area.type}</div>
                            <div className="people-container">
                                {peopleInArea.map(person => (
                                    <div key={person.id} className="person-avatar" title={person.name}>
                                        {person.avatar}
                                    </div>
                                ))}
                            </div>
                            {isOccupied && (
                                <div className="occupancy-count">
                                    {peopleInArea.length} {peopleInArea.length === 1 ? 'person' : 'people'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssetTracker;