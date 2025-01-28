import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useAuthContext } from '../../AuthProvider';


const TasksTimeline = ({ projectId }) => {
    const { user } = useAuthContext();
    const [loggedUser, setLoggedUser] = useState(null);
    const [project, setProject] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [otherTasks, setOtherTasks] = useState([]);
    const [error, setError] = useState({});

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                //const DecodeUserId = decodeJWT(token);
                //const DecodeUserId = decodeJWT(user._id);


                setLoggedUser(user._id);
                const response = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data.project) {
                    setProject(response.data.project);
                } else {
                    setError((prev) => ({ ...prev, project: 'Project not found.' }));
                }
            } catch (err) {
                console.error(err);
                setError((prev) => ({ ...prev, project: 'Failed to fetch project details.' }));
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        if (loggedUser) {
            const fetchProjectTasks = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`
                    );
                    const tasks = response.data.tasks;

                    const assignedToMe = tasks.filter(task => task.task.assignedTo === loggedUser);
                    const assignedToOthers = tasks.filter(task => task.task.assignedTo !== loggedUser);

                    setMyTasks(assignedToMe || []);
                    setOtherTasks(assignedToOthers || []);
                } catch (err) {
                    console.error(err);
                    setError((prev) => ({ ...prev, tasks: 'Failed to fetch project tasks.' }));
                }
            };

            fetchProjectTasks();
        }
    }, [loggedUser, projectId]);

    const processTasksForChart = (tasks, assignee) => {
        return tasks.map((task) => {
            const { title, createdAt, dueDate } = task.task;
            const start = new Date(createdAt);
            const end = new Date(dueDate);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            return {
                assignee,
                title: title.split(" ").slice(0, 5).join(" "),
                start: start.getTime(),
                end: end.getTime(),
                duration,
            };
        });
    };

    const data = [
        ...processTasksForChart(myTasks, 'My Tasks'),
        ...processTasksForChart(otherTasks, 'Other Tasks'),
    ];

    const chartData = {
        series: [{
            name: 'Tasks Timeline',
            data: data.map(task => ({
                x: task.title,
                y: [task.start, task.end],
            })),
        }],
        options: {
            chart: {
                type: 'rangeBar',
                height: 400,
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    formatter: function (value) {
                        return new Date(value).toLocaleDateString();
                    }
                },
                title: {
                    text: 'Timeline',
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    const task = data[opts.dataPointIndex];
                    const startDate = new Date(task.start).toLocaleDateString();
                    const endDate = new Date(task.end).toLocaleDateString();
                    const duration = task.duration;
                    return `${task.title} (${duration} days: ${startDate} - ${endDate})`;
                },
            },
            colors: ['#008FFB', '#00E396'],
        },
    };

    return (
        <main>
            {error.project && <p>{error.project}</p>}
            {project && (
                <div className='bg-white lg:w-full w-[950px] overflow-auto py-[20px] shadow-lg border-[2px] rounded-xl px-3'>
                    <h2 className='text-[20px] font-[600]'><span className='text-white text-[17px] bg-blue-800 rounded-xl px-[15px] py-[4px]'>{project.name}</span> Tasks Timeline</h2>
                    <div className='overflow-x-auto pointer-events-none'>
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="rangeBar"
                            height={400}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default TasksTimeline;
