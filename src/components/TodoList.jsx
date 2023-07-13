import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Layout, Row, Col, message } from 'antd';
import './TodoList.css';
import TodoTab from './TodoTab';
import TodoForm from './TodoForm';
import {
	createTodo,
	deleteTodo,
	loadTodos,
	updateTodo,
} from '../services/todoService';
const { Content } = Layout;

const TodoList = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [todos, setTodos] = useState([]);
	const [activeTodos, setActiveTodos] = useState([]);
	const [completedTodos, setCompletedTodos] = useState();

	const handleFormSubmit = (todo) => {
		console.log('Todo to create', todo);
		createTodo(todo).then(onRefresh());
		message.success('Todo added!');
	};

	const handleRemoveTodo = (todo) => {
		deleteTodo(todo.id).then(onRefresh());
		message.warning('Todo removed');
	};
	const handleToggleTodoStatus = (todo) => {
		todo.completed = !todo.completed;
		updateTodo(todo).then(onRefresh());
		message.info('Todo status updated!');
	};

	const refresh = () => {
		loadTodos()
			.then((json) => {
				setTodos(json);
				setActiveTodos(json.filter((todo) => todo.completed === false));
				setCompletedTodos(json.filter((todo) => todo.completed === true));
			})
			.then(console.log('fetch completed'));
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		let data = await loadTodos();
		setTodos(data);
		setActiveTodos(data.filter((todo) => todo.completed === false));
		setCompletedTodos(data.filter((todo) => todo.completed === true));
		setRefreshing(false);
		console.log('Refresh state', refreshing);
	}, [refreshing]);

	useEffect(() => {
		refresh();
	}, [onRefresh]);

	const items = [
		{
			key: 'all',
			label: 'All',
			children: (
				<TodoTab
					todos={todos}
					onTodoToggle={handleToggleTodoStatus}
					onTodoRemoval={handleRemoveTodo}
				/>
			),
		},
		{
			key: 'active',
			label: 'Active',
			children: (
				<TodoTab
					todos={activeTodos}
					onTodoToggle={handleToggleTodoStatus}
					onTodoRemoval={handleRemoveTodo}
				/>
			),
		},
		{
			key: 'complete',
			label: 'Complete',
			children: (
				<TodoTab
					todos={completedTodos}
					onTodoToggle={handleToggleTodoStatus}
					onTodoRemoval={handleRemoveTodo}
				/>
			),
		},
	];

	return (
		<Layout className="layout">
			<Content style={{ padding: '0 50px' }}>
				<div className="todoList">
					<Row>
						<Col span={14} offset={5}>
							<h1>Gia Todos</h1>
							<TodoForm onFormSubmit={handleFormSubmit} />
							<br />

							<Tabs defaultActiveKey="all" items={items} />
						</Col>
					</Row>
				</div>
			</Content>
		</Layout>
	);
};

export default TodoList;
