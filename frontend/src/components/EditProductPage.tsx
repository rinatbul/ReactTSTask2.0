import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, updateProduct } from './productsSlice';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Container } from '@mui/material';
import QuillEditor from './QuillEditor';

// interface RouteParams {
// id: string;
// }
/*
Компонент позволяет пользователю редактировать существующий товар,
загрузить новое изображение, изменить название, описание,
цену и статус продукта,
отправить данные на сервер для сохранения изменений.
 */

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();//Параметр маршрута
    const dispatch: AppDispatch = useDispatch();//Отправка actions в Redux
    const navigate = useNavigate();//Навигация между страницами

    //Текущий товар, выбирается из состояния Redux на основе ID
    const product = useSelector((state: RootState) =>
        state.products.products.find((product) => product.id === parseInt(id || ''))
    );

    //Состояния для хранения значений полей
    const [name, setName] = useState(product?.name || '');
    const [description, setDescription] = useState(product?.description || '');
    const [image, setImage] = useState<File | null>(null);
    const [price, setPrice] = useState<number | ''>(product?.price || '');
    const [status, setStatus] = useState<'active' | 'archived'>(product?.status || 'active');
    const [error, setError] = useState<string | null>(null);

    //Загрузка товаров при первом рендеринге компоненты, если товар не найден
    useEffect(() => {
        if (!product) {
            dispatch(fetchProducts());
        }
    }, [dispatch, product, id]);

    //Обработчики

    //Обновляет состояние image привыборе нового изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    //Отправка формы.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || price === '' || price <= 0) {
            setError('Название и цена обязательны для заполнения.');
            return;
        }

        const updatedProduct = {
            id: parseInt(id || '0'),
            name,
            description,
            image: product?.image || '',
            price: typeof price === 'number' ? price : parseFloat(price),
            status,
        };

        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            try {
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                updatedProduct.image = response.data.imageUrl;
            } catch (error) {
                setError('Ошибка при загрузке изображения. Попробуйте снова.');
                return;
            }
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct);
            dispatch(updateProduct(updatedProduct));
            navigate('/products');
        } catch (error) {
            setError('Ошибка при обновлении продукта. Попробуйте снова.');
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography component="h1" variant="h5">
                    Редактирование товара
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
                            Загрузить новое изображение
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                        {product?.image && !image && <img src={product.image} alt={product.name} width="100" />}
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

export default EditProductPage;
