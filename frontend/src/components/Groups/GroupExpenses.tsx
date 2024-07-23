import { useEffect, useState } from "react";
import { getExpensesByGroupId } from "../../services/groups";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

interface Expense {
    group_id: number;
    date: string
    description: string;
    amount: string;
    creator_name: string;
    share_amount: string;
    sharer_name: string;
}



export const GroupExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const { id } = useParams()
    const navigate = useNavigate();

    useEffect(() => {

            const fetchExpenses = async () => {
                try {
                    const results = await getExpensesByGroupId(Number(id));
                    console.log(results)
                    setExpenses(results)
                    return results;
                } catch (error) {
                    if (isAxiosError(error) && error.response && error.response.status === 404) {
                        // Handle 404 error by returning an empty array
                        return[];
                    } else {
                        console.error(`Error fetching expenses for group ${id}:`, error);
                        throw error; // Rethrow other errors
                    }
                }
            }

            fetchExpenses();
    }, [id]); // Runs every time id changes


    const handleOnClickBackButton = () => {
        navigate('/groups')
    }

    return (

        <div className="mx-56 my-9 font-bold w-3/4 flex content-between">
            <button onClick={handleOnClickBackButton}>Back to group</button>
                    <div>
                        <table className={`border border-solid border-black w-full `}>
                            <tbody>
                                <tr>
                                    <th className='border border-solid border-black'>Date</th>
                                    <th className='border border-solid border-black'>Description</th>
                                    <th className='border border-solid border-black'>Amount</th>
                                    <th className='border border-solid border-black'>Payer</th>
                                    <th className='border border-solid border-black'>Your share</th>
                                </tr>
                            </tbody>
                            {expenses && expenses.filter(exp => exp.group_id === Number(id)).map((exp, index) => (
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
        </div>
    )
}
