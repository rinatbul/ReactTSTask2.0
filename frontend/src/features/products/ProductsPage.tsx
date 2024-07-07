import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts, deleteProduct } from './productsSlice';
import { Container, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/*
-------------------------------------------------
Компонент загружает список товаров,
отображает их в таблице,
позволяет фильтровать по названию,
редактировать и удалять товары,
переключаться между страницами с помощью pagination.
----------------------------------------------------
 */

const ProductsPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch(); //Для отравки actions
    //useSelector - состояние из Redux
    const products = useSelector((state: RootState) => state.products.products);
    const loading = useSelector((state: RootState) => state.products.loading);
    const error = useSelector((state: RootState) => state.products.error);

    const [searchTerm, setSearchTerm] = useState('');//Поиск для фильтрации
    const [page, setPage] = useState(1);//Текущая страница
    const rowsPerPage = 5;//Количество строк на странице

    //Загрузка товаров при первом рендеринге
    useEffect(() => {
        dispatch(fetchProducts());//отправляет action для получения товаров из сервера
    }, [dispatch]);


    //Обработчики

    //Поиск товара
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    //Удаление товара по ID
    const handleDelete = (id: number) => {
        dispatch(deleteProduct(id));
    };

    //Обнавляет страницу при изменении номера страницы в pagination
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    //Фильтрация по поиску. Отфильтрованный массив товаров
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Массив товаров для текущей страницы
    const paginatedProducts = filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Товары
            </Typography>
            <TextField
                label="Поиск по названию"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />
            <Button component={Link} to="/products/create" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Добавить
            </Button>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Paper elevation={4}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Изображение</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell>Цена</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Действие</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img src={product.image} alt={product.name} width="50" />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell dangerouslySetInnerHTML={{ __html: product.description }} />
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.status}</TableCell>
                                        <TableCell>
                                            <IconButton component={Link} to={`/products/edit/${product.id}`} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(product.id)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={Math.ceil(filteredProducts.length / rowsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}
                    />
                </Paper>
            )}
        </Container>
    );
};

export default ProductsPage;
