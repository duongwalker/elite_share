import { useEffect, useState } from 'react';
import { getExpensesByGroupId, getGroupsByUserId } from '../../services/groups';
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';





interface Group {
    group_id: number
    group_name: string;
}

interface Expense {
    group_id: number;
    date: string
    description: string;
    amount: string;
    creator_name: string;
    share_amount: string;
    sharer_name: string;
}

interface User {
    accessToken: string;
    id: number;
    name: string;
}

const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [visibleGroups, setVisibleGroups] = useState<{ [key: number]: boolean }>({});
    const [userId, setUserId] = useState<Number>()
    const handleGroupClick = (groupId: number) => {
        // Toggle the visibility of the clicked group's table
        setVisibleGroups(prevState => ({
            ...prevState,
            [groupId]: !prevState[groupId]
        }));
    };

    useEffect(() => {
        const user = window.localStorage.getItem('loggedUser')
        const decodedToken = jwtDecode<User>(JSON.parse(user ? user : '').accessToken)
        const id = decodedToken.id
        setUserId(id)
        getGroupsByUserId(id).then(results => {
            setGroups(results);
        });

    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            // Create an array of promises for fetching expenses by group ID
            const fetchedExpensesPromises = groups.map(async (group) => {
                try {
                    const results = await getExpensesByGroupId(group.group_id);
                    console.log(results)
                    return results;
                } catch (error) {
                    if (isAxiosError(error) && error.response && error.response.status === 404) {
                        // Handle 404 error by returning an empty array
                        return [];
                    } else {
                        console.error(`Error fetching expenses for group ${group.group_id}:`, error);
                        throw error; // Rethrow other errors
                    }
                }
            });

            try {
                // Wait for all promises to resolve
                const fetchedExpensesResults = await Promise.all(fetchedExpensesPromises);

                // Combine all the expenses into a single array or handle as needed
                const combinedExpenses = fetchedExpensesResults.flat(); // Assuming you want to flatten the array of arrays

                // Update the state with the combined expenses
                setExpenses(combinedExpenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        // Only fetch expenses if groups are not empty
        if (groups.length > 0) {
            fetchExpenses();
        }
    }, [groups]); // Runs every time `groups` changes


    return (
        <div>
            <div className="mx-56 my-9 font-bold w-3/4 flex">
                <div>Groups</div>

                <button className="ml-auto bg-red-500">
                    Add group
                </button>
            </div>

            <div className="mx-56 my-9 font-bold w-3/4 flex content-between">
                {groups.map((group) => {
                    return (
                        <div key={group.group_id} className='m-12'>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardActionArea onClick={() => handleGroupClick(group.group_id)}>
                                    <CardMedia
                                        sx={{ height: 140 }}
                                        image="https://cdn-icons-png.freepik.com/512/10384/10384161.png"
                                        title="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {group.group_name}
                                        </Typography>
                                    </CardContent>

                                </CardActionArea>
                            </Card>

                            <table className={`border border-solid border-black w-full ${visibleGroups[group.group_id] ? '' : 'hidden'}`}>
                                <tbody>
                                    <tr>
                                        <th className='border border-solid border-black'>Date</th>
                                        <th className='border border-solid border-black'>Description</th>
                                        <th className='border border-solid border-black'>Amount</th>
                                        <th className='border border-solid border-black'>Payer</th>
                                        <th className='border border-solid border-black'>Your share</th>
                                    </tr>
                                </tbody>
                                {expenses && expenses.filter(exp => exp.group_id === group.group_id).map((exp, index) => (
                                    <tbody key={index}>
                                        <tr>
                                            <td className='border border-solid border-black'>{exp.date.slice(0, 10)}</td>
                                            <td className='border border-solid border-black'>{exp.description}</td>
                                            <td className='border border-solid border-black'>{exp.amount}</td>
                                            <td className='border border-solid border-black'>{exp.creator_name}</td>
                                            <td className='border border-solid border-black'>{exp.share_amount}</td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Groups;
