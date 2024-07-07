import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer'; // Для загрузки файлов
import path from 'path'; // Для работы с путями файлов и каталогов

/*
Создает сервер, который может принимать запросы на загрузку файлов
и выполнять CRUD операции для товаров.
 */

const app = express(); //Экземпляр приложения Express
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); //Разрешает кросс-доменные запросы

//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    status: 'active' | 'archived';
}

let products: Product[] = [
    {
        id: 1,
        name: "Палатка №1",
        description: "<p>Классическая двухместная туристическая палатка Outventure подойдет для непродолжительных стоянок. Модель с продуманной конструкцией отличается простотой установки, компактностью и малым весом.</p>",
        image: "https://cdnkz.sportmaster.com/upload/mdm/media_content/resize/677/768_1024_e504/120759050299.jpg",
        price: 20000,
        status: 'active'
    },
    {
        id: 2,
        name: "Рюкзак Northland Camino, 60 л",
        description: "<p>Легкий и вместительный рюкзак Northland — отличный выбор для треккинга.\n</p>",
        image: "https://cdnkz.sportmaster.com/upload/mdm/media_content/resize/50b/768_1024_b7e7/114924870299.jpg",
        price: 25000,
        status: 'archived'
    },
];

let currentId = 3;

//CRUD операции для товаров

app.get('/api/products', (req: Request, res: Response) => {
    res.json(products);
});

app.post('/api/products', (req: Request, res: Response) => {
    const { name, description, image, price, status } = req.body;
    const newProduct: Product = { id: currentId++, name, description, image, price, status };
    products.push(newProduct);
    res.status(201).json(newProduct);
});


app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== parseInt(id));
    res.status(204).send();
});

app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, image, price, status } = req.body;
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    products[productIndex] = { id: parseInt(id), name, description, image, price, status };
    res.json(products[productIndex]);
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
