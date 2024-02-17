import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import { TextField, Paper, Grid, Button, FormControl, InputLabel, MenuItem } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCars, selectuserData } from '../store/slice/userSlice';
import Container from '@mui/material/Container';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { useParams } from 'react-router-dom';

interface Types {
    category_id: string;
    category_name: string;
    category_image: string;
}

interface ItemType {
    type_id: string;
    type_name: string;
    comment: string;
    category_id: string;
    Category: {
        category_name: string;
        category_image: string;
    };
}


export default function Type_menu() {
    const { category_id } = useParams();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const dispatch = useDispatch<any>();
    const username = useSelector(selectuserData);
    const [typesware, settypesware] = React.useState<Types[]>([]);
    const [typeresult, settyperesult] = React.useState<ItemType[]>([]);
    const [selectedGroup, setSelectedGroup] = React.useState<string>('');
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(category_id || null);


    useEffect(() => {
        setCurrentCategoryId(category_id || null);
    }, [category_id]);


    useEffect(() => {
        dispatch(fetchCars());
    }, [dispatch]);

    const [formData, setFormData] = React.useState({
        group_name: "",
        comment: "",
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleInputChange = (key: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleChange6 = (event: SelectChangeEvent) => {
        setSelectedGroup(event.target.value as string);
    };


    const handleSubmit = async () => {
        try {
            handleClose();
            const isConfirmed = await Swal.fire({
                title: "คุณแน่ใจไหม?",
                text: "คุณจะไม่สามารถเปลี่ยนกลับสิ่งนี้ได้!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Submit"
            }).then((result) => result.isConfirmed);

            if (isConfirmed) {
                console.log("formData before axios.post:", formData);

                const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/type/create-type`, {
                    ...formData,
                    user_id: username.user_id,
                    category_id: currentCategoryId,
                });

                console.log(response.data);

                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    text: 'มีการเพิ่มสถานะใหม่',
                });
            }
        } catch (error) {
            console.error("Error while submitting data:", error);

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'มีข้อผิดพลาดในการเพิ่มสถานะ',
            });
        } finally {
            handleClose();
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    useEffect(() => {
        fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/category/get-all`)
            .then(response => response.json())
            .then(data => settypesware(data.result.filter((types: Types) => types.category_id === category_id)))
            .catch(error => console.error('Error fetching group data:', error));
    }, [category_id]);


    const [data, setData] = useState<ItemType[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/type/get-type`);
                setData(response.data.result.filter((types: Types) => types.category_id === category_id));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1px', marginTop: '30px' }}>
                <Link to={'/assets/view_status'}>
                    <Fab
                        sx={{ bgcolor: '#01345d', color: 'white', fontSize: '1rem', width: '36px', height: '56px', borderRadius: 0.5, boxShadow: 'none' }}
                    >
                        <RemoveRedEyeIcon />
                    </Fab>
                </Link>
                <Fab
                    aria-describedby={id}
                    onClick={handleClick}
                    sx={{ bgcolor: '#01345d', color: 'white', fontSize: '1rem', width: '36px', height: '56px', borderRadius: 0.5, boxShadow: 'none' }}
                >
                    <AddCircleOutlineIcon />
                </Fab>
            </div>

            <Popover
                id={id}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                className='mt-24'
            >
                <div className='flex justify-between items-center ml-4 mr-4 mt-2 mb-2'>
                    <div>เพิ่ม ประเภท</div>
                    <div onClick={handleClose}>
                        <CloseIcon />
                    </div>
                </div>
                <hr />
                <Paper sx={{ width: { xs: '340px', xl: '1200px' }, padding: '40px' }}>
                    <Grid container spacing={2}>
                        <Container maxWidth="sm">
                            <TextField label="ชื่อประเภท" variant="outlined" fullWidth sx={{ marginTop: '10px' }} onChange={(e) => handleInputChange('type_name', e.target.value)} />
                            <textarea id="comment" rows={4} className="mt-6 block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " placeholder="คอมเม้นต์" onChange={(e) => handleInputChange('comment', e.target.value)}></textarea>

                            <div className='mt-4'>
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label">ค่าที่ส่งมา</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedGroup}
                                        label="Age"
                                        onChange={handleChange6}
                                    >
                                        {typesware.map(types => (
                                            <MenuItem key={types.category_id} value={types.category_id}>
                                                {types.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className='mt-4'>
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label">ประเภท</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedGroup}
                                        label="Age"
                                        onChange={handleChange6}
                                    >
                                        {data ? (
                                            <div>
                                                {data.map((item: ItemType) => (
                                                    <div key={item.type_id}>
                                                        <h1>ชื่อ: {item.type_name}</h1>
                                                        <p>{item.category_id}</p>
                                                        <hr />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>Loading...</div>
                                        )}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className='flex justify-center'>
                                <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#3f51b5', color: 'white', marginTop: '20px' }}>
                                    บันทึก
                                </Button>
                            </div>
                        </Container>
                    </Grid>
                </Paper>
            </Popover>
        </div>
    );
}