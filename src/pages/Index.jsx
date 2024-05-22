import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useHistory } from "react-router-dom";
import { Container, Text, VStack, HStack, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Input, Select, Box } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Mock API calls
const fetchUsers = async (count = 10) => {
  const response = await fetch(`https://random-data-api.com/api/users/random_user?size=${count}`);
  return response.json();
};

const fetchBanks = async (count = 10) => {
  const response = await fetch(`https://random-data-api.com/api/bank/random_bank?size=${count}`);
  return response.json();
};

// Users Page
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchBanks().then(setBanks);
  }, []);

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = (user) => {
    setUsers(users.map((u) => (u.id === user.id ? user : u)));
    setEditingUser(null);
  };

  const handleAddUsers = async (count) => {
    const newUsers = await fetchUsers(count);
    setUsers([...users, ...newUsers]);
  };

  return (
    <Container>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl">Users</Text>
        <Button leftIcon={<FaPlus />} onClick={() => handleAddUsers(1)}>
          Add User
        </Button>
      </HStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.first_name}</Td>
              <Td>{user.last_name}</Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditUser(user)} />
                <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteUser(user.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {editingUser && <UserForm user={editingUser} banks={banks} onSave={handleSaveUser} />}
    </Container>
  );
};

// Banks Page
const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingBank, setEditingBank] = useState(null);

  useEffect(() => {
    fetchBanks().then(setBanks);
    fetchUsers().then(setUsers);
  }, []);

  const handleDeleteBank = (id) => {
    if (users.some((user) => user.bank_id === id)) {
      alert("Cannot delete bank with associated users.");
      return;
    }
    setBanks(banks.filter((bank) => bank.id !== id));
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
  };

  const handleSaveBank = (bank) => {
    setBanks(banks.map((b) => (b.id === bank.id ? bank : b)));
    setEditingBank(null);
  };

  const handleAddBanks = async (count) => {
    const newBanks = await fetchBanks(count);
    setBanks([...banks, ...newBanks]);
  };

  return (
    <Container>
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize="2xl">Banks</Text>
        <Button leftIcon={<FaPlus />} onClick={() => handleAddBanks(1)}>
          Add Bank
        </Button>
      </HStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Bank Name</Th>
            <Th>Routing Number</Th>
            <Th>SWIFT/BIC</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {banks.map((bank) => (
            <Tr key={bank.id}>
              <Td>{bank.id}</Td>
              <Td>{bank.bank_name}</Td>
              <Td>{bank.routing_number}</Td>
              <Td>{bank.swift_bic}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditBank(bank)} />
                <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteBank(bank.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {editingBank && <BankForm bank={editingBank} users={users} onSave={handleSaveBank} />}
    </Container>
  );
};

// User Form
const UserForm = ({ user, banks, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={4}>
      <VStack spacing={4}>
        <Input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
        <Input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
        <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <Select name="bank_id" value={formData.bank_id} onChange={handleChange} placeholder="Select Bank">
          {banks.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.bank_name}
            </option>
          ))}
        </Select>
        <Button type="submit">Save</Button>
      </VStack>
    </Box>
  );
};

// Bank Form
const BankForm = ({ bank, users, onSave }) => {
  const [formData, setFormData] = useState(bank);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={4}>
      <VStack spacing={4}>
        <Input name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="Bank Name" />
        <Input name="routing_number" value={formData.routing_number} onChange={handleChange} placeholder="Routing Number" />
        <Input name="swift_bic" value={formData.swift_bic} onChange={handleChange} placeholder="SWIFT/BIC" />
        <Button type="submit">Save</Button>
      </VStack>
    </Box>
  );
};

// Main App
const App = () => {
  return (
    <Router>
      <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <HStack spacing={4}>
            <Button as={Link} to="/users">
              Users
            </Button>
            <Button as={Link} to="/banks">
              Banks
            </Button>
          </HStack>
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/banks" element={<BanksPage />} />
            <Route path="/" element={<Text fontSize="2xl">Welcome to the User-Bank Management System</Text>} />
          </Routes>
        </VStack>
      </Container>
    </Router>
  );
};

export default App;
