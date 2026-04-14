"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase } from "./supabase";

// Data shape (matches prototype):
// { tasks, projects, notes, folders, inbox, score: {total, streak, level, todayPoints} }

const shiftDate = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

// ─── DB ↔ client mapping ───
const projectFromDb = (r) => ({
  id: r.id, name: r.name, deadline: r.deadline,
  color: r.color, tasks: r.tasks_count, completed: r.completed_count,
});
const taskFromDb = (r) => ({
  id: r.id, title: r.title, time: r.time, duration: r.duration,
  category: r.category, done: r.done, date: r.date,
  projectId: r.project_id, subtasks: r.subtasks || [], recurring: r.recurring || "none",
    description: r.description || "", position: r.position || 0,
});
const noteFromDb = (r) => ({
  id: r.id, title: r.title, content: r.content,
  pinned: r.pinned, folderId: r.folder_id,
  date: (r.created_at || "").split("T")[0],
});
const folderFromDb = (r) => ({
  id: r.id, name: r.name, icon: r.icon, color: r.color,
});
const inboxFromDb = (r) => ({
  id: r.id, text: r.text, createdAt: r.created_at,
});

export function useRuvaData(userId) {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    tasks: [], projects: [], notes: [], folders: [], inbox: [],
    score: { total: 0, streak: 0, level: 1, todayPoints: 0 },
  });

  const userIdRef = useRef(userId);
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  // ─── INITIAL LOAD ───
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [projects, folders, tasks, notes, inbox, profile] = await Promise.all([
        supabase.from("projects").select("*").order("id"),
        supabase.from("folders").select("*").order("id"),
        supabase.from("tasks").select("*").order("date").order("position").order("time"),
        supabase.from("notes").select("*").order("created_at", { ascending: false }),
        supabase.from("inbox").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      ]);
      if (cancelled) return;
      setData({
        projects: (projects.data || []).map(projectFromDb),
        folders: (folders.data || []).map(folderFromDb),
        tasks: (tasks.data || []).map(taskFromDb),
        notes: (notes.data || []).map(noteFromDb),
        inbox: (inbox.data || []).map(inboxFromDb),
        score: {
          total: profile.data?.score_total || 0,
          streak: profile.data?.score_streak || 0,
          level: profile.data?.score_level || 1,
          todayPoints: 0,
        },
      });
      setLoading(false);
    }
    if (userId) load();
    return () => { cancelled = true; };
  }, [userId, supabase]);

  // ─── helpers ───
  const uid = () => userIdRef.current;

  // ─── TASKS ───
  const addTask = useCallback(async (t) => {
    const tempId = -Date.now();
    const optimistic = { id: tempId, ...t };
    setData((p) => ({ ...p, tasks: [...p.tasks, optimistic] }));
    const { data: row } = await supabase.from("tasks").insert({
      user_id: uid(), title: t.title, time: t.time, duration: t.duration,
      category: t.category, done: false, date: t.date,
      project_id: t.projectId, subtasks: t.subtasks || [], recurring: t.recurring || "none",
        description: t.description || "", position: t.position || 0,
    }).select().single();
    if (row) setData((p) => ({ ...p, tasks: p.tasks.map((x) => x.id === tempId ? taskFromDb(row) : x) }));
  }, [supabase]);

  const toggleTask = useCallback(async (id) => {
    let task;
    setData((p) => {
      task = p.tasks.find((t) => t.id === id);
      if (!task) return p;
      const wasDone = task.done;
      const pointChange = wasDone ? -25 : 25;
      let newTasks = p.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t);
      if (!wasDone && task.recurring && task.recurring !== "none") {
        const days = task.recurring === "weekly" ? 7 : task.recurring === "monthly" ? 30 : 1;
        const next = { ...task, id: -Date.now(), date: shiftDate(task.date, days), done: false, subtasks: (task.subtasks || []).map((s) => ({ ...s, done: false })) };
        newTasks = [...newTasks, next];
        // persist the next one
        supabase.from("tasks").insert({
          user_id: uid(), title: next.title, time: next.time, duration: next.duration,
          category: next.category, done: false, date: next.date,
          project_id: next.projectId, subtasks: next.subtasks, recurring: next.recurring,
        }).select().single().then(({ data: row }) => {
          if (row) setData((pp) => ({ ...pp, tasks: pp.tasks.map((x) => x.id === next.id ? taskFromDb(row) : x) }));
        });
      }
      let newProjects = p.projects;
      if (task.projectId) {
        newProjects = p.projects.map((pr) => pr.id === task.projectId ? { ...pr, completed: pr.completed + (wasDone ? -1 : 1) } : pr);
        supabase.rpc ? null : null;
        supabase.from("projects").update({ completed_count: (p.projects.find((pr) => pr.id === task.projectId)?.completed || 0) + (wasDone ? -1 : 1) }).eq("id", task.projectId).then(({ error }) => { if (error) console.error("DB update failed:", error); });
      }
      const newScore = {
        ...p.score,
        total: p.score.total + pointChange,
        todayPoints: p.score.todayPoints + pointChange,
      };
      supabase.from("profiles").update({ score_total: newScore.total }).eq("id", uid()).then(({ error }) => { if (error) console.error("DB update failed:", error); });
      return { ...p, tasks: newTasks, projects: newProjects, score: newScore };
    });
    if (task) {
      supabase.from("tasks").update({ done: !task.done }).eq("id", id).then(({ error }) => { if (error) console.error("DB update failed:", error); });
    }
  }, [supabase]);

  const deleteTask = useCallback(async (id) => {
    setData((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) }));
    await supabase.from("tasks").delete().eq("id", id);
  }, [supabase]);

  const rescheduleTask = useCallback(async (id, newDate) => {
    setData((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === id ? { ...t, date: newDate } : t) }));
    await supabase.from("tasks").update({ date: newDate }).eq("id", id);
  }, [supabase]);

  const toggleSubtask = useCallback(async (taskId, subId) => {
    let newSubs;
    setData((p) => ({
      ...p,
      tasks: p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        newSubs = (t.subtasks || []).map((s) => s.id === subId ? { ...s, done: !s.done } : s);
        return { ...t, subtasks: newSubs };
      }),
    }));
    if (newSubs) await supabase.from("tasks").update({ subtasks: newSubs }).eq("id", taskId);
  }, [supabase]);

  const addSubtaskToTask = useCallback(async (taskId, text) => {
    if (!text.trim()) return;
    let newSubs;
    setData((p) => ({
      ...p,
      tasks: p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        newSubs = [...(t.subtasks || []), { id: Date.now(), text: text.trim(), done: false }];
        return { ...t, subtasks: newSubs };
      }),
    }));
    if (newSubs) await supabase.from("tasks").update({ subtasks: newSubs }).eq("id", taskId);
  }, [supabase]);

  const deleteSubtask = useCallback(async (taskId, subId) => {
    let newSubs;
    setData((p) => ({
      ...p,
      tasks: p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        newSubs = (t.subtasks || []).filter((s) => s.id !== subId);
        return { ...t, subtasks: newSubs };
      }),
    }));
    if (newSubs !== undefined) await supabase.from("tasks").update({ subtasks: newSubs }).eq("id", taskId);
  }, [supabase]);

  // ─── PROJECTS ───
  const addProject = useCallback(async (p) => {
    const tempId = -Date.now();
    setData((prev) => ({ ...prev, projects: [...prev.projects, { id: tempId, ...p, tasks: 0, completed: 0 }] }));
    const { data: row } = await supabase.from("projects").insert({
      user_id: uid(), name: p.name, deadline: p.deadline, color: p.color,
    }).select().single();
    if (row) setData((prev) => ({ ...prev, projects: prev.projects.map((x) => x.id === tempId ? projectFromDb(row) : x) }));
  }, [supabase]);

  const deleteProject = useCallback(async (id) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
    await supabase.from("projects").delete().eq("id", id);
  }, [supabase]);

  // ─── NOTES ───
  const addNote = useCallback(async (n) => {
    const tempId = -Date.now();
    const today = new Date().toISOString().split("T")[0];
    setData((p) => ({ ...p, notes: [{ id: tempId, ...n, pinned: false, date: today }, ...p.notes] }));
    const { data: row } = await supabase.from("notes").insert({
      user_id: uid(), title: n.title, content: n.content, folder_id: n.folderId,
    }).select().single();
    if (row) setData((p) => ({ ...p, notes: p.notes.map((x) => x.id === tempId ? noteFromDb(row) : x) }));
  }, [supabase]);

  const updateNote = useCallback(async (id, updates) => {
    setData((p) => ({ ...p, notes: p.notes.map((n) => n.id === id ? { ...n, ...updates } : n) }));
    const dbUpdates = {};
    if ("title" in updates) dbUpdates.title = updates.title;
    if ("content" in updates) dbUpdates.content = updates.content;
    if ("folderId" in updates) dbUpdates.folder_id = updates.folderId;
    if ("pinned" in updates) dbUpdates.pinned = updates.pinned;
    if (Object.keys(dbUpdates).length) await supabase.from("notes").update(dbUpdates).eq("id", id);
  }, [supabase]);

  const togglePinNote = useCallback(async (id) => {
    let newVal;
    setData((p) => ({ ...p, notes: p.notes.map((n) => {
      if (n.id !== id) return n;
      newVal = !n.pinned;
      return { ...n, pinned: newVal };
    }) }));
    if (newVal !== undefined) await supabase.from("notes").update({ pinned: newVal }).eq("id", id);
  }, [supabase]);

  const deleteNote = useCallback(async (id) => {
    setData((p) => ({ ...p, notes: p.notes.filter((n) => n.id !== id) }));
    await supabase.from("notes").delete().eq("id", id);
  }, [supabase]);

  // ─── FOLDERS ───
  const addFolder = useCallback(async (f) => {
    const tempId = -Date.now();
    setData((p) => ({ ...p, folders: [...p.folders, { id: tempId, ...f }] }));
    const { data: row } = await supabase.from("folders").insert({
      user_id: uid(), name: f.name, icon: f.icon, color: f.color,
    }).select().single();
    if (row) setData((p) => ({ ...p, folders: p.folders.map((x) => x.id === tempId ? folderFromDb(row) : x) }));
  }, [supabase]);

  const deleteFolder = useCallback(async (id) => {
    setData((p) => ({
      ...p,
      folders: p.folders.filter((f) => f.id !== id),
      notes: p.notes.map((n) => n.folderId === id ? { ...n, folderId: null } : n),
    }));
    await supabase.from("folders").delete().eq("id", id);
  }, [supabase]);

  // ─── INBOX ───
  const addToInbox = useCallback(async (text) => {
    if (!text.trim()) return;
    const tempId = -Date.now();
    const item = { id: tempId, text: text.trim(), createdAt: new Date().toISOString() };
    setData((p) => ({ ...p, inbox: [item, ...p.inbox] }));
    const { data: row } = await supabase.from("inbox").insert({ user_id: uid(), text: text.trim() }).select().single();
    if (row) setData((p) => ({ ...p, inbox: p.inbox.map((x) => x.id === tempId ? inboxFromDb(row) : x) }));
  }, [supabase]);

  const deleteInboxItem = useCallback(async (id) => {
    setData((p) => ({ ...p, inbox: p.inbox.filter((i) => i.id !== id) }));
    await supabase.from("inbox").delete().eq("id", id);
  }, [supabase]);

  const convertInboxToTask = useCallback(async (item, taskData) => {
    await addTask({
      title: item.text,
      time: taskData.time || "09:00",
      duration: taskData.duration || 30,
      category: taskData.category || "personal",
      projectId: taskData.projectId || null,
      date: taskData.date || new Date().toISOString().split("T")[0],
      subtasks: [],
      recurring: "none",
    });
    await deleteInboxItem(item.id);
  }, [addTask, deleteInboxItem]);

  const convertInboxToNote = useCallback(async (item) => {
    await addNote({ title: item.text.substring(0, 50), content: item.text, folderId: null });
    await deleteInboxItem(item.id);
  }, [addNote, deleteInboxItem]);

  const updateTask = useCallback(async (id, updates) => {
    setData((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) }));
    const dbUpdates = {};
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    await supabase.from("tasks").update(dbUpdates).eq("id", id);
  }, [supabase]);

  const reorderTask = useCallback(async (id, direction) => {
    setData((p) => {
      const task = p.tasks.find((t) => t.id === id);
      if (!task) return p;
      const dateTasks = p.tasks.filter((t) => t.date === task.date).sort((a, b) => a.position - b.position);
      const idx = dateTasks.findIndex((t) => t.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= dateTasks.length) return p;
      const swapTask = dateTasks[swapIdx];
      const posA = task.position;
      const posB = swapTask.position;
      supabase.from("tasks").update({ position: posB }).eq("id", task.id)
        .then(({ error }) => { if (error) console.error("Reorder failed:", error); });
      supabase.from("tasks").update({ position: posA }).eq("id", swapTask.id)
        .then(({ error }) => { if (error) console.error("Reorder failed:", error); });
      return { ...p, tasks: p.tasks.map((t) => {
        if (t.id === task.id) return { ...t, position: posB };
        if (t.id === swapTask.id) return { ...t, position: posA };
        return t;
      }) };
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, [supabase]);

  return {
    loading, data,
    addTask, toggleTask, deleteTask, rescheduleTask,
    toggleSubtask, addSubtaskToTask, deleteSubtask,
    addProject, deleteProject,
    addNote, updateNote, togglePinNote, deleteNote,
    addFolder, deleteFolder,
    addToInbox, deleteInboxItem, convertInboxToTask, convertInboxToNote,
    signOut,
    updateTask, reorderTask,
  };
}
