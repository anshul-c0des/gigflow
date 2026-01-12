"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
  const {register} = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer" as "owner" | "freelancer",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Name"
          className="w-full border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full border p-2"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value as any })
          }
        >
          <option value="freelancer">Freelancer</option>
          <option value="owner">Owner</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button className="w-full bg-black text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
}
