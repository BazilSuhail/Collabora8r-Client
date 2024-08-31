import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JoinedProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [teamDetails, setTeamDetails] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('Response Data:', response.data.project);

                if (response.data.project) {
                    setProject(response.data.project);
                } else {
                    setError('Project not found.');
                }

                if (Array.isArray(response.data.project.team)) {
                    setTeamDetails(response.data.project.team);
                } else {
                    setError('Team details not found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (loading) {
        return <p>Loading project details...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            {project ? (
                <>
                    <h2>Project Details</h2>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <h3>Team Members</h3>
                    {teamDetails.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {teamDetails.map((member) => (
                                <li key={member._id.toString()} style={{ marginBottom: '10px' }}>
                                    <strong>{member.name}</strong> - {member.email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No team members found.</p>
                    )}
                </>
            ) : (
                <p>Project not available.</p>
            )}
        </div>
    );
};

export default JoinedProjectDetails;
