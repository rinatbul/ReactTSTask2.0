import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import { fetchProducts } from './productsSlice';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Container } from '@mui/material';
import QuillEditor from './QuillEditor'; // Редактор Quill

/*
Компонент позволяет пользователю ввести данные нового товара,
загрузить изображение, указать цену и статус,
отправить эти данные на сервер для создания нового товара.
 */
const CreateProductPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();//Отправка actions в Redux
    const navigate = useNavigate();//Навигация между страницами(Routes)

    //Состояния для хранения значений полей
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [price, setPrice] = useState<number | ''>('');
    const [status, setStatus] = useState<'active' | 'archived'>('active');
    const [error, setError] = useState<string | null>(null);

    //Обработчики

    //Обновление состояния image при выборе изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    //Отправка формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //Проверка заполнения обязательных полей
        if (!name || price === '' || price <= 0) {
            setError('Название и цена обязательны для заполнения.');
            return;
        }

        //Создание объекта нового товара
        const newProduct = {
            name,
            description,
            image: '',
            price: typeof price === 'number' ? price : parseFloat(price),
            status,
        };

        //Если изображение выбрано, загружает на сервер и обновляет URL изображения в объекте
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            //Отправка запроса создания товара на сервер
            try {
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                newProduct.image = response.data.imageUrl;
            } catch (error) {
                setError('Ошибка при загрузке изображения. Попробуйте снова.');
                console.error('Error uploading image:', error);
                return;
            }
        }

        // В случае успеха, перенаправляет на страницу товаров, обновляет состояние товаров в Redux
        try {
            await axios.post('http://localhost:5000/api/products', newProduct);
            dispatch(fetchProducts());
            navigate('/products');
        } catch (error) {
            setError('Ошибка при создании продукта. Попробуйте снова.');
            console.error('Error creating product:', error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography component="h1" variant="h5">
                    Добавление товара
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Название"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormControl>
                    <Typography variant="h6">Описание</Typography>
                    <QuillEditor onChange={setDescription} initialContent={description} />
                    <FormControl fullWidth margin="normal">
                        <Button variant="contained" component="label">
                            Загрузить изображение
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                        {image && <Typography>{image.name}</Typography>}
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Цена"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            required
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Статус</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'active' | 'archived')}
                        >
                            <MenuItem value="active">Активный</MenuItem>
                            <MenuItem value="archived">Архивный</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Typography color="error">{error}</Typography>}
                    <FormControl fullWidth margin="normal">
                        <Button type="submit" variant="contained" color="primary">
                            Сохранить
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/products')} style={{ margin: '10px' }}>
                            Отмена
                        </Button>
                    </FormControl>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateProductPage;
