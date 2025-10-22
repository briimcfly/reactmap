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

    // Fetch people locations from your API
    const fetchPeopleLocations = async () => {
        try {
            const response = await fetch('YOUR_API_ENDPOINT_HERE');
            const data = await response.json();
            
            // Transform the API response to match our component's expected format
            const transformedData = data.check_ins.flatMap(checkIn => {
                if (!checkIn.employee || !checkIn.current_area) return [];
                
                return {
                    id: checkIn.employee.id,
                    name: `${checkIn.employee.first_name} ${checkIn.employee.last_name}`,
                    avatar: checkIn.employee.first_name.charAt(0).toUpperCase(),
                    areaId: checkIn.current_area.id.toString(), // Use the area ID directly
                    photoUrl: checkIn.employee.photo_url || null
                };
            });
            
            setPeopleLocations(transformedData);
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
                                        {person.photoUrl ? (
                                            <img src={person.photoUrl} alt={person.name} className="avatar-image" />
                                        ) : (
                                            person.avatar
                                        )}
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