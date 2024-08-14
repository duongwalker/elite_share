import { useEffect, useState } from "react";
import { getExpensesByGroupId } from "../../services/groups";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { Box, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from "react-hook-form"

interface Expense {
    group_id: number;
    date: string
    description: string;
    amount: string;
    creator_name: string;
    share_amount: string;
    sharer_name: string;
}

interface ExpenseCreatingInputForm {
    desc: string;
    amount: number;
}



export const GroupExpenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const { id } = useParams()
    const navigate = useNavigate();
    const [openCreateExpenseForm, setOpenCreateExpenseForm] = useState(false);
    const [openShareExpenseModal, setOpenShareExpenseModal] = useState(false);
    const { register: registerCreateExpense, handleSubmit: handleSubmitCreateExpense } = useForm<ExpenseCreatingInputForm>()
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
                    return [];
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

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid ',
        boxShadow: 24,
        p: 4,
    };

    const onCreateExpenseSubmit: SubmitHandler<ExpenseCreatingInputForm> = async (data) => {
        
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



                <Button onClick={() => setOpenCreateExpenseForm(!openCreateExpenseForm)} sx={{
                    backgroundColor: "#464BD8", color: "white", '&:hover': {
                        backgroundColor: '#DDDDDD',
                        color: '#333333',
                    },
                }}>Add expense</Button>



                <Modal
                    open={openCreateExpenseForm}
                    onClose={() => setOpenCreateExpenseForm(!openCreateExpenseForm)}
                    aria-labelledby="Create expense modal"
                >
                    <Box sx={style} >
                        <form onSubmit={handleSubmitCreateExpense(onCreateExpenseSubmit)}>
                            <input placeholder="Description" {...registerCreateExpense("desc", { required: true, maxLength: 20 })} style={{ border: '2px solid #000' }} />
                            <input placeholder="Amount" type="number" {...registerCreateExpense("amount", { min: 18, max: 99 })} style={{ border: '2px solid #000' }} />
                            <input type="submit" />
                        </form>


                        <Button onClick={() => setOpenShareExpenseModal(!openShareExpenseModal)} sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>Equally</Button>
                    </Box>
                </Modal>

                <Modal
                    open={openShareExpenseModal}
                    onClose={() => setOpenShareExpenseModal(!openShareExpenseModal)}
                    aria-labelledby="Share expense modal"
                >
                    <Box sx={style} >
                        <Button sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>=</Button>


                        {/* <Button sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>1.23</Button>

                        <Button sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>%</Button> */}

                    </Box>
                </Modal>

            </div>
        </div>
    )
}
