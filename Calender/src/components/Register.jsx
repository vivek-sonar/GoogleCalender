import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userRole: "student",
    registeredVia: "email",

  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", form);
      alert("Registered successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input name="name" placeholder="Name" className="mb-2 w-full px-3 py-2 border rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" className="mb-2 w-full px-3 py-2 border rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="mb-2 w-full px-3 py-2 border rounded" onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="mb-2 w-full px-3 py-2 border rounded" onChange={handleChange} />
        <select name="userRole" className="mb-3 w-full px-3 py-2 border rounded" onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>


         <select name="registeredVia" className="mb-3 w-full px-3 py-2 border rounded" onChange={handleChange}>
          <option value="email">Email</option>
          <option value="google">Google</option>
       
        </select>
        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
