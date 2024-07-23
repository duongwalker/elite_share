import { useEffect, useState } from 'react';
import { getGroupsByUserId, createGroup } from '../../services/groups';
import { jwtDecode } from 'jwt-decode';

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from 'react-router-dom';

interface Group {
    group_id: number
    group_name: string;
}

interface User {
    accessToken: string;
    id: number;
    name: string;
}

interface GroupCreatingFormInput {
    groupName: string

}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [userId, setUserId] = useState<number>()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { register, handleSubmit } = useForm<GroupCreatingFormInput>()
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<GroupCreatingFormInput> = async (data) => {
        if(userId) {
            const returnedData = await createGroup(data.groupName, userId)
            console.log(returnedData)
        }
    }

    const handleGroupClick = (groupId: number) => {
        navigate(`/groups/${groupId}`)
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


    return (
        <div>
            <div className="mx-56 my-9 font-bold w-3/4 flex">
                <div>Groups</div>
                <div className="ml-auto bg-[white] ">
                    <Button onClick={handleOpen} sx={{
                        backgroundColor: "#464BD8", color: "white", '&:hover': {
                            backgroundColor: '#DDDDDD', // Custom hover background color
                            color: '#333333',           // Custom hover text color
                        },
                    }}>Create Group</Button>
                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography> */}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input {...register("groupName", { required: true, maxLength: 20 })} />
                        {/* <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
                        <input type="number" {...register("age", { min: 18, max: 99 })} /> */}
                        <input type="submit" />
                    </form>
                </Box>
            </Modal>

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
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
