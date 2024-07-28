import { useEffect, useState } from 'react';
import { getGroupsByUserId, createGroup, deleteGroup, updateGroupName } from '../../services/groups';
import { jwtDecode } from 'jwt-decode';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

interface Group {
    group_id: number ;
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

interface ChangeGroupNameFormInput {
    newGroupName: string

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
    const [openGroupForm, setOpenGroupForm] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number>(null);
    const [openChangeNameForm, setOpenChangeNameForm] = useState(false);
    // const [openMenu, setOpenMenu] = useState(false);

    const { register: registerCreateName, handleSubmit:handleSubmitCreateName } = useForm<GroupCreatingFormInput>()
    const { register: registerChangeName, handleSubmit: handleSubmitChangeName} = useForm<ChangeGroupNameFormInput>();
    // const { register, handleSubmit } = useForm<ChangeGroupNameFormInput>()
    const navigate = useNavigate();

    const onCreateGroupSubmit: SubmitHandler<GroupCreatingFormInput> = async (data) => {
        if (userId) {
            const returnedData = await createGroup(data.groupName, userId)
            const newGroup = { group_id: returnedData.id, group_name: returnedData.group_name }
            setGroups((prevGroup) => [...prevGroup, newGroup])
        }
        setOpenGroupForm(false)
    }

    const onChangeNameSubmit : SubmitHandler<ChangeGroupNameFormInput> = async(data) => {
        console.log('group_name')
        console.log(data.newGroupName)
        if(userId && selectedGroupId) {
            const newGroupInfo = {
                group_id: selectedGroupId,
                group_name: data.newGroupName
            }
            const response = await updateGroupName(newGroupInfo)
            console.log('response')
            console.log(response)
        }
        setOpenChangeNameForm(false)
    }

    // const handleOpenMenu = () => setOpenMenu(true);
    // const handleCloseMenu = () => setOpenMenu(false);

    const handleDeleteGroup = async (group_id: number) => {
        const response = await deleteGroup(group_id)
        if (response) {
            console.log(response)
            const group_id = response.group_id
            const newGroups = groups.filter((group) => group.group_id !== group_id)
            setGroups(newGroups)
        }
    }


    const handleGroupClick = (groupId: number) => {
        navigate(`/groups/${groupId}`)
    };

    const handleOpenChangeNameForm = (groupId: number) => {
        setSelectedGroupId(groupId);
        setOpenChangeNameForm(true);
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
                    <Button onClick={() => setOpenGroupForm(!openGroupForm)} sx={{
                        backgroundColor: "#464BD8", color: "white", '&:hover': {
                            backgroundColor: '#DDDDDD',
                            color: '#333333',
                        },
                    }}>Create Group</Button>
                </div>
            </div>

            <Modal
                open={openGroupForm}
                onClose={() => setOpenGroupForm(!openGroupForm)}
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

                    <form onSubmit={handleSubmitCreateName(onCreateGroupSubmit)}>
                        <input {...registerCreateName("groupName", { required: true, maxLength: 20 })} />
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
                                        title="money"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {group.group_name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>

                                <CardActions>
                                    {/* <MenuIcon onClick={handleOpenMenu}></MenuIcon> */}
                                    {/* <Modal
                                        open={openMenu}
                                        onClose={handleCloseMenu}
                                    >
                                        <Menu open={openMenu} />
                                    </Modal> */}
                                    <Button onClick={() => handleDeleteGroup(group.group_id)} sx={{
                                        backgroundColor: "#464BD8", color: "white", '&:hover': {
                                            backgroundColor: '#DDDDDD',
                                            color: '#333333',
                                        }
                                    }}>Delete Group</Button>

                                    <Button onClick={() => handleOpenChangeNameForm(group.group_id)} sx={{
                                        backgroundColor: "#464BD8", color: "white", '&:hover': {
                                            backgroundColor: '#DDDDDD',
                                            color: '#333333',
                                        }
                                    }}>Change Name</Button>

                                </CardActions>

                            </Card>
                            <Modal
                                open={openChangeNameForm}
                                onClose={() => setOpenChangeNameForm(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <form onSubmit={handleSubmitChangeName(onChangeNameSubmit)}>
                                        <input {...registerChangeName("newGroupName", { required: true, maxLength: 20 })} />
                                        <input type="submit" />
                                    </form>
                                </Box>
                            </Modal>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
