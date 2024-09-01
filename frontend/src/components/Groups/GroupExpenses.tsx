import { useEffect, useState } from "react";
import { getExpensesByGroupId, getGroupMembersByGroupId, getSettledGroupTransactions } from "../../services/groups";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from "react-hook-form"
import { CheckboxList } from "../List/CheckboxList";
import useUserStore from "../../states/useUserStore";
import { createGroupExpense } from "../../services/groups";
import { jwtDecode } from "jwt-decode";

interface FetchedExpense {
    group_id: number;
    date: string
    description: string;
    amount: string;
    creator_name: string;
    share_amount: string;
    sharer_name: string;
}

interface ExpenseShare {
    user_id: number;
    amount: number;
}

interface User {
    accessToken: string;
    id: number;
    name: string;
}


// interface CreatedExpense {
//     expense_id?: number
//     group_id: number | null
//     name?: string
//     created_by: number
//     amount: number
//     description: string
//     date: Date
//     shares?: ExpenseShare[];
//   }

interface ExpenseCreatingInputForm {
    desc: string;
    amount: number;
}

interface Transaction {
    from: string
    to: string
    amount: number
}

interface GroupMember {
    name: string
    group_name: string
    user_id: number
}

export const GroupExpenses = () => {
    const [expenses, setExpenses] = useState<FetchedExpense[] | null>(null);
    const { id } = useParams()
    const navigate = useNavigate();
    const [openCreateExpenseForm, setOpenCreateExpenseForm] = useState(false);
    const [openShareExpenseModal, setOpenShareExpenseModal] = useState(false);
    const { register: registerCreateExpense, handleSubmit: handleSubmitCreateExpense } = useForm<ExpenseCreatingInputForm>()
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [shareMemberIds, setShareMemberIds] = useState<number[]>([]);
    const { userId, setUserId } = useUserStore()


    useEffect(() => {
        const user = window.localStorage.getItem('loggedUser')
        const decodedToken = jwtDecode<User>(JSON.parse(user ? user : '').accessToken)
        const id = decodedToken.id
        setUserId(id)

    }, [setUserId]);

    useEffect(() => {
        console.log("userid")
        console.log(userId)
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

        const fetchGroupMembers = async () => {
            try {
                const results = await getGroupMembersByGroupId(Number(id))
                // console.log('id')
                // console.log(Number(id))
                // console.log(results)
                setMembers(results)
                return results;
            } catch (error) {
                if (isAxiosError(error) && error.response && error.response.status === 404) {
                    // Handle 404 error by returning an empty array
                    return [];
                } else {
                    console.error(`Error fetching members for group ${id}:`, error);
                    throw error; // Rethrow other errors
                }
            }
        }

        fetchExpenses();
        fetchGroupMembers();
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

        const shares: Array<ExpenseShare> = shareMemberIds.map((id) => {
            const share = {
                user_id: id,
                amount: (data.amount)/(shareMemberIds.length)
            }
            return share
        })
        const expense = {
            group_id: Number(id),
            created_by: userId,
            amount: data.amount,
            description: data.desc,
            date: "2024-08-30T15:30:00Z",
            shares: shares
        }


        const expenseShare = await createGroupExpense(expense)
        console.log(expenseShare)
        // Send request
        // POST /expenses
        //
        //
        //
        //
        //
        //
        //
        //
        //
    }

    const handleSettleUp = async (group_id: number) => {
        const transactions = await getSettledGroupTransactions(group_id)
        setTransactions(transactions)
    }

    return (

        <div className="mx-56 my-9 font-bold w-3/4 flex content-between">
            <button onClick={handleOnClickBackButton}>Back to group</button>
            <div>
                {expenses && (
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
                )}

                {expenses && (
                    <div>
                        <Button onClick={() => setOpenCreateExpenseForm(!openCreateExpenseForm)} sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>Add expense</Button>

                        <Button onClick={() => handleSettleUp(Number(id))} sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>Settle up</Button>
                    </div>
                )}

                {transactions && (
                    <table className={`border border-solid border-black w-full `}>
                        <tbody>
                            <tr>
                                <th className='border border-solid border-black'>From</th>
                                <th className='border border-solid border-black'>To</th>
                                <th className='border border-solid border-black'>Amount</th>
                            </tr>
                        </tbody>

                        {transactions.map((transaction: Transaction, index: number) => (
                            <tbody key={index}>
                                <tr>
                                    <td className='border border-solid border-black'>{transaction.from}</td>
                                    <td className='border border-solid border-black'>{transaction.to}</td>
                                    <td className='border border-solid border-black'>{transaction.amount}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                )}

                <Modal
                    open={openCreateExpenseForm}
                    onClose={() => setOpenCreateExpenseForm(!openCreateExpenseForm)}
                    aria-labelledby="Create expense modal"

                    disableEnforceFocus
                    disableAutoFocus
                >
                    <Box sx={{ ...style, left: '25%' }} >
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
                    <Box sx={{ ...style, left: '55%' }} >
                        <Button sx={{
                            backgroundColor: "#464BD8", color: "white", '&:hover': {
                                backgroundColor: '#DDDDDD',
                                color: '#333333',
                            },
                        }}>=</Button>

                        <CheckboxList members={members} setShareMemberIds={setShareMemberIds} />
                    </Box>
                </Modal>

            </div>
        </div>
    )
}