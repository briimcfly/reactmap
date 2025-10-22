import { useState, useEffect } from 'react';
import './AssetTracker.css';

const AssetTracker = () => {
    const [peopleLocations, setPeopleLocations] = useState([]);
    const areas = [
        // Row 1
        {
            id: '495283',
            name: 'DZ Den',
            type: 'Conference Room',
            gridColumn: '1 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: '385847',
            name: 'Stealth',
            type: 'Conference Room',
            gridColumn: '2 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: '495291',
            name: 'The Cove',
            type: 'Cubicles/Seating',
            gridColumn: '3 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: '495285',
            name: 'Supply Office',
            type: 'Office',
            gridColumn: '4 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: '495286',
            name: 'CTO Office',
            type: 'Office',
            gridColumn: '5 / span 1',
            gridRow: '1 / span 1'
        },
        {
            id: '495287',
            name: 'President Office',
            type: 'Office',
            gridColumn: '6 / span 1',
            gridRow: '1 / span 1'
        },

        // Row 2
        {
            id: '495322',
            name: 'Back Room',
            type: 'Cubicles/Seating',
            gridColumn: '1 / span 2',
            gridRow: '2 / span 2'
        },
        {
            id: '495321',
            name: 'Front Room',
            type: 'Cubicles/Seating',
            gridColumn: '3 / span 2',
            gridRow: '2 / span 2'
        },
        {
            id: '495323',
            name: '4insite Lobby',
            type: 'Entry/Lobby',
            gridColumn: '6 / span 1',
            gridRow: '2 / span 1'
        },
        {
            id: '385846',
            name: 'Discovery',
            type: 'Conference Room',
            gridColumn: '5 / span 1',
            gridRow: '2 / span 1'
        },
        // Row 3
        {
            id: '495290',
            name: '4insite Kitchen',
            type: 'Kitchen',
            gridColumn: '5 / span 2',
            gridRow: '3 / span 1'
        },
        //Row 4 
        {
            id: '495289',
            name: 'Womens',
            type: 'Restroom',
            gridColumn: '2 / span 1',
            gridRow: '4 / span 1'
        },
        {
            id: '495288',
            name: 'Mens',
            type: 'Restroom',
            gridColumn: '3 / span 1',
            gridRow: '4 / span 1'
        }

    ];

    const fetchPeopleLocations = async () => {
        try {
            const response = await fetch('https://bay4.4insite.com/api/geofence/employee/current-area/?contract_id=259&employee_ids=131218%2C6711%2C135432%2C86143');
            const data = await response.json();
            
            const transformedData = data.check_ins.flatMap(checkIn => {
                if (!checkIn.employee || !checkIn.current_area) return [];
                
                return {
                    id: checkIn.employee.id,
                    name: `${checkIn.employee.first_name} ${checkIn.employee.last_name}`,
                    avatar: checkIn.employee.first_name.charAt(0).toUpperCase(),
                    areaId: checkIn.current_area.id.toString(),
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
        const interval = setInterval(fetchPeopleLocations, 5000);
        return () => clearInterval(interval);
    }, []);

    const getPeopleInArea = (areaId) => {
        return peopleLocations.filter(person => person.areaId === areaId);
    };

    return (
        <div className="asset-tracker">
            <h1>4insite Office • User Location Demo</h1>
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
                                        {/* {person.photoUrl ? (
                                            <img src={person.photoUrl} alt={person.name} className="avatar-image" />
                                        ) : ( */}
                                            {person.avatar}
                                        {/* )} */}
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