import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/*
Компонент используется в формах создания и редактирования товаров
для ввода и редактирования HTML-описания товара.
 */

interface QuillEditorProps {
    initialContent: string;
    onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ initialContent, onChange }) => {
    const [editorState, setEditorState] = useState(initialContent);//Состояние содержимого

    //Обновление состояния редактора, когда initialContent изменяется
    useEffect(() => {
        setEditorState(initialContent);
    }, [initialContent]);

    //Обработчик изменений редактора
    const handleEditorChange = (content: string) => {
        setEditorState(content);
        onChange(content);
    };

    return (
        <ReactQuill
            value={editorState}
            onChange={handleEditorChange}
            theme="snow"
        />
    );
};

export default QuillEditor;
