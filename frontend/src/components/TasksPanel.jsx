import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "../context/userContext";
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { CheckCircle2, ArrowRight, RotateCw, Plus } from "lucide-react";

const Priority = ({ level }) => {
  const color =
    level === "High"
      ? "text-red-600"
      : level === "Low"
      ? "text-green-600"
      : "text-yellow-600";
  return (
    <span className={`text-xs font-semibold ${color}`}>{level} Priority</span>
  );
};

const NewTaskModal = ({ onCreate, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [image, setImage] = useState("");
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
        <div className="text-lg font-semibold">New Task</div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/5"
              placeholder="Short description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title.trim()) return;
              onCreate({ title, description, priority, image });
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const TasksPanel = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const counts = useMemo(() => {
    return tasks.reduce(
      (acc, t) => {
        acc.total += 1;
        if (t.status === "done") acc.done += 1;
        if (t.status === "todo") acc.todo += 1;
        if (t.status === "inprogress") acc.inprogress += 1;
        return acc;
      },
      { total: 0, done: 0, todo: 0, inprogress: 0 }
    );
  }, [tasks]);

  const updateStatus = async (id, status) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "tasks", id), {
      status,
      completedAt: status === "done" ? serverTimestamp() : null,
    });
  };

  const createTask = async ({ title, description, priority, image }) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      title,
      description,
      priority,
      image,
      status: "todo",
      createdAt: serverTimestamp(),
    });
    setShowNew(false);
  };

  const openTasks = tasks.filter((t) => t.status !== "done").slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
          <p className="text-sm text-gray-600">
            {counts.done} completed • {counts.todo} to do • {counts.inprogress} in progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          <Link
            to="/tasks"
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            View all
          </Link>
        </div>
      </div>

      {openTasks.length === 0 ? (
        <div className="text-sm text-gray-500">No open tasks.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {openTasks.map((t) => (
            <li key={t.id} className="py-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-gray-900 font-medium">{t.title}</div>
                <div className="text-xs text-gray-600 max-w-md line-clamp-1">
                  {t.description}
                </div>
                <Priority level={t.priority} />
              </div>
              <div className="flex items-center space-x-3">
                {t.status === "todo" && (
                  <button
                    onClick={() => updateStatus(t.id, "inprogress")}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                )}
                {t.status === "inprogress" && (
                  <button
                    onClick={() => updateStatus(t.id, "done")}
                    className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </button>
                )}
                {t.status === "done" && (
                  <button
                    onClick={() => updateStatus(t.id, "todo")}
                    className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Reopen</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showNew && (
        <NewTaskModal onCreate={createTask} onClose={() => setShowNew(false)} />
      )}
    </div>
  );
};

export default TasksPanel;


