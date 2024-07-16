import { useEffect, useState } from 'react';
import { getExpensesByGroupId, getGroupsByUserId } from '../../services/groups';
import { isAxiosError } from 'axios';

interface Group {
    group_id: number
    group_name: string;
}

interface Expense {
    group_id: number;
    date: string
    description: string;
    amount: string;
    name: string;

}

const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [visibleGroups, setVisibleGroups] = useState<{ [key: number]: boolean }>({});
    const [userId, setUserId] = useState(null)
    const handleGroupClick = (groupId: number) => {
        // Toggle the visibility of the clicked group's table
        setVisibleGroups(prevState => ({
            ...prevState,
            [groupId]: !prevState[groupId]
        }));
    };


    useEffect(() => {
        const user = window.localStorage.getItem('loggedUser')
        const id = JSON.parse(user ? user : '').id
        setUserId(id)
        getGroupsByUserId(id).then(results => {
            setGroups(results);
        });

    }, []); // Runs once when the component mounts

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
            <div className="mx-56 my-9 font-bold w-3/4">
                Groups
            </div>

            <div className="mx-56 my-9 font-bold w-3/4">
                {groups.map((group) => {
                    return (
                        <div key={group.group_id}>
                            <li key={group.group_id} onClick={() => handleGroupClick(group.group_id)} className='cursor-pointer'>{group.group_name}</li>
                            <table className={`border border-solid border-black w-full ${visibleGroups[group.group_id] ? '' : 'hidden'}`}>
                                <tbody>
                                    <tr>
                                        <th className='border border-solid border-black'>Date</th>
                                        <th className='border border-solid border-black'>Description</th>
                                        <th className='border border-solid border-black'>Amount</th>
                                        <th className='border border-solid border-black'>Payer</th>
                                    </tr>
                                </tbody>
                                {expenses && expenses.filter(exp => exp.group_id === group.group_id).map((exp, index) => (
                                    <tbody key={index}>
                                        <tr>
                                            <td className='border border-solid border-black'>{exp.date.slice(0, 10)}</td>
                                            <td className='border border-solid border-black'>{exp.description}</td>
                                            <td className='border border-solid border-black'>{exp.amount}</td>
                                            <td className='border border-solid border-black'>{exp.name}</td>
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
