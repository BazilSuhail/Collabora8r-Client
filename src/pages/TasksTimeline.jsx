import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useAuthContext } from '../AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

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
                    setError((prev) => ({ ...prev, project: 'Sector synchronization failed.' }));
                }
            } catch (err) {
                console.error(err);
                setError((prev) => ({ ...prev, project: 'Failed to access sector timeline.' }));
            }
        };

        fetchProjectDetails();
    }, [projectId, user._id]);

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
                    setError((prev) => ({ ...prev, tasks: 'Failed to retrieve directive timeline.' }));
                }
            };

            fetchProjectTasks();
        }
    }, [loggedUser, projectId]);

    const processTasksForChart = (tasks, label) => {
        return tasks.map((task) => {
            const { title, createdAt, dueDate } = task.task;
            const start = new Date(createdAt);
            const end = new Date(dueDate);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

            return {
                label,
                title: title.split(" ").slice(0, 5).join(" "),
                start: start.getTime(),
                end: end.getTime(),
                duration,
            };
        });
    };

    const data = [
        ...processTasksForChart(myTasks, 'Personnel Objective'),
        ...processTasksForChart(otherTasks, 'Squad Directive'),
    ];

    const chartData = {
        series: [{
            name: 'Operational Timeline',
            data: data.map(task => ({
                x: task.title,
                y: [task.start, task.end],
                fillColor: task.label === 'Personnel Objective' ? '#ea580c' : '#4b5563', // Orange for personnel, gray for squad
            })),
        }],
        options: {
            chart: {
                type: 'rangeBar',
                height: 400,
                toolbar: {
                    show: true,
                    tools: {
                        download: false,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                    },
                },
                foreColor: '#9ca3af', // Gray-400 for chart labels
                background: 'transparent',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: '60%',
                    borderRadius: 8,
                },
            },
            grid: {
                borderColor: '#1a1a1a', // Border color corresponding to #1a1a1a
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            xaxis: {
                type: 'datetime',
                labels: {
                    style: {
                        colors: '#9ca3af',
                        fontWeight: 700,
                        fontSize: '10px',
                    },
                    formatter: function (value) {
                        return new Date(value).toLocaleDateString();
                    }
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                title: {
                    text: 'Operational Epochs',
                    style: {
                        color: '#ea580c',
                        fontWeight: 900,
                        letterSpacing: '2px',
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#e5e7eb',
                        fontWeight: 900,
                        fontSize: '11px',
                    },
                },
            },
            tooltip: {
                theme: 'dark',
                style: {
                    fontSize: '12px',
                },
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val) => {
                        const start = new Date(val[0]).toLocaleDateString();
                        const end = new Date(val[1]).toLocaleDateString();
                        return `<span class="text-orange-500 font-black">${start}</span> &rarr; <span class="text-white font-black">${end}</span>`;
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#ffffff'],
                    fontWeight: 900,
                    fontSize: '10px',
                },
                formatter: function (val, opts) {
                    const task = data[opts.dataPointIndex];
                    return `${task.duration} Solar Cycles`;
                },
            },
        },
    };

    return (
        <div className="w-full">
            <AnimatePresence>
                {error.project && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-900/10 border border-red-500/20 text-red-500 rounded-xl mb-4 font-bold text-xs">
                        {error.project}
                    </motion.div>
                )}
            </AnimatePresence>

            {project ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-3xl p-6 shadow-sm overflow-hidden'
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-3">
                            <span className='px-4 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-600/20'>
                                {project.name}
                            </span>
                            <h2 className='text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Directive Timeline</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
                                <span className="text-[10px] font-black text-gray-500 uppercase">Personal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-gray-500 rounded-full" />
                                <span className="text-[10px] font-black text-gray-500 uppercase">Squad</span>
                            </div>
                        </div>
                    </div>

                    <div className='w-full pointer-events-auto'>
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="rangeBar"
                            height={400}
                        />
                    </div>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center p-20">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default TasksTimeline;
