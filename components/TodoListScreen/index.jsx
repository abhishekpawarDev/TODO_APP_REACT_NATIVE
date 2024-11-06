// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList} from 'react-native';
import { TodoStyle } from '../TodoListStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoList = () => { 
    const [showModal, setShowModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // const[showWarningModal , setShowWarningModal] = useState(false);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const storedTodoList = await AsyncStorage.getItem('todoUser');
                if (storedTodoList) {
                    setTodoList(JSON.parse(storedTodoList));
                }
            } catch (error) {
                console.log('Failed to load todos from storage');
            }
        };
        loadTodos();
    }, []);

    const addTodoList = async () => {
        try {
            const newTodo = { userName, jobTitle, id: Math.random().toString() };
            const updatedTodoList = [...todoList, newTodo];
            setTodoList(updatedTodoList);

            await AsyncStorage.setItem('todoUser', JSON.stringify(updatedTodoList));
            setUserName('');
            setJobTitle('');
            setShowModal(false);
        } catch (error) {
            console.log('Failed to save todo');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const updatedTodoList = todoList.filter((item) => item.id !== id);
            setTodoList(updatedTodoList);
            await AsyncStorage.setItem('todoUser', JSON.stringify(updatedTodoList));
            // setShowWarningModal(false);
        } catch (error) {
            console.warn('Failed to delete todo');
        }
    };

    const filteredTodoList = todoList.filter((item) =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={TodoStyle.mainContainer}>
            <Text style={TodoStyle.mainHeadingText}>Todo List App</Text>

            <TextInput
                placeholder="Search by username..."
                style={TodoStyle.textInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <TouchableOpacity style={TodoStyle.creatTodoBtn} onPress={() => setShowModal(true)}>
                <Text style={TodoStyle.creatTodoBtnText}>Create Todo List</Text>
            </TouchableOpacity>


                    <FlatList
                        data={filteredTodoList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={TodoStyle.detailsContainer}>
                                <Text style={TodoStyle.detailsTextContainer}>Name: {(item.userName.length > 15) ? `${item.userName.slice(0, 15)}...` : item.userName}</Text>
                                <Text style={TodoStyle.detailsTextContainer}>JOB TITLE: {(item.jobTitle.length > 20) ? `${item.jobTitle.slice(0, 20) }...` : item.jobTitle}</Text>
                                <TouchableOpacity style={TodoStyle.delBtn} onPress={() => deleteTodo(item.id)}>
                                    <Text style={TodoStyle.delBtnTxt}>Delete</Text>
                                </TouchableOpacity>
                                {/* <Modal transparent={true} visible={showWarningModal} animationType="fade">
                                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                        <View style={TodoStyle.modalview}>
                                            <Text>Are You Sure?</Text>
                                            <Text>Do You Want to Delete This Todo List?</Text>
                                            <View style={{ flexDirection: 'row'}}>
                                                <TouchableOpacity onPress={() => deleteTodo(item.id)} style={{ margin: 'auto', backgroundColor: 'red', paddingHorizontal: 40, marginVertical: 15, paddingVertical: 10, borderRadius: 5 }}>
                                                    <Text>Yes</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ margin: 'auto', backgroundColor: 'green', paddingHorizontal: 40, marginVertical: 15,paddingVertical:10, borderRadius:5 }}>
                                                    <Text>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Modal> */}
                                {/* <TouchableOpacity style={TodoStyle.delBtn} onPress={() => setShowWarningModal(true)}>
                                    <Text style={TodoStyle.delBtnTxt}>Delete</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}
                    />

            <Modal transparent={true} visible={showModal} animationType="slide">
                <View style={TodoStyle.centerview}>
                    <View style={TodoStyle.modalview}>
                        <TextInput
                            placeholder="Enter Name"
                            style={TodoStyle.modalInputField}
                            onChangeText={setUserName}
                            value={userName}
                        />
                        <TextInput
                            placeholder="Enter Job Title"
                            style={TodoStyle.modalInputField}
                            onChangeText={setJobTitle}
                            value={jobTitle}
                        />
                        <TouchableOpacity onPress={addTodoList} style={TodoStyle.creatTodoBtn}>
                            <Text style={TodoStyle.creatTodoBtnText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={TodoStyle.cancelBtn} onPress={() => setShowModal(false)}>
                            <Text style={TodoStyle.delBtnTxt}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default TodoList;
