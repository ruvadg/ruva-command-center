"use client";
import { useState, useEffect } from "react";
import { Plus, Check, Clock, Target, FileText, Calendar, Trophy, ChevronLeft, ChevronRight, Trash2, X, Star, Zap, Users, Palette, Briefcase, ArrowRight, ArrowLeft, CalendarDays, Folder, FolderPlus, AlertCircle, Coffee, Home, Inbox, Repeat, ListChecks, ChevronDown, ChevronUp, Grid3x3, Rows3, Sparkles, LogOut } from "lucide-react";
import { useRuvaData } from "@/lib/useRuvaData";

// ─── RUVA LOGO OFICIAL ───
const RuvaLogo = ({ size = 32, color = "#FFFFFF" }) => (
  <svg viewBox="0 0 2058.62 644.01" style={{ height: size, width: "auto", display: "block" }} xmlns="http://www.w3.org/2000/svg">
    <g fill={color}>
      <path d="M366.53,510c-2.19,0-4.38-.11-6.58-.33-17.5-1.73-33.28-10.17-44.44-23.76-9.64-11.75-14.95-26.59-14.94-41.78v-77.67c0-13.71,11.11-24.83,24.82-24.83,13.71,0,24.83,11.12,24.83,24.83v77.68c0,2.65.64,6.56,3.67,10.27,2.74,3.34,6.62,5.42,10.92,5.84,4.3.43,8.51-.85,11.86-3.59,3.76-3.08,5.92-7.65,5.92-12.53v-70.63s0-87.36,0-87.36v-1.97c0-32.56,26.5-59.05,59.06-59.05,11.2,0,22.02,3.14,31.35,9,.99.57,1.95,1.21,2.88,1.93,1.81,1.29,3.55,2.68,5.22,4.18l63.49,50.93c10.7,8.58,12.41,24.21,3.83,34.9-8.58,10.7-24.21,12.41-34.9,3.83l-63.98-51.32s-.08-.06-.12-.09l-2.99-2.4c-1.21-.72-2.79-1.29-4.77-1.29-5.19,0-9.41,4.22-9.41,9.41v1.97s0,87.35,0,87.35v70.64c-.01,19.81-8.79,38.36-24.08,50.9-11.88,9.75-26.47,14.95-41.64,14.95Z" />
      <path d="M632.06,509.48c-14.47,0-29.03-4.74-41.17-14.48-.08-.06-.15-.12-.22-.18l-108.05-88.91c-5.73-4.72-9.05-11.75-9.05-19.17,0-6.65,2.67-13.03,7.4-17.69,4.73-4.67,11.13-7.24,17.79-7.15.7,0,5.19.02,5.7.02,49.28,0,89.38-40.1,89.38-89.38s-40.1-89.38-89.38-89.38h-154.23v102.08c0,13.71-11.12,24.83-24.83,24.83s-24.83-11.12-24.83-24.83v-126.91c0-13.71,11.12-24.83,24.83-24.83h179.06c76.67,0,139.04,62.37,139.04,139.04,0,58.57-36.39,108.79-87.76,129.24l66.34,54.59c6.96,5.51,17.1,4.38,22.67-2.55,5.57-6.94,4.48-17.11-2.43-22.71-.02-.01-1.79-1.48-1.81-1.5l1.76,1.46-14.44-11.58c-10.7-8.58-12.41-24.21-3.83-34.9,8.58-10.7,24.21-12.41,34.9-3.83l14.34,11.5s.08.07.12.1c28.3,22.74,32.83,64.26,10.1,92.56-12.99,16.17-32.11,24.58-51.4,24.58Z" />
      <path d="M1034.18,160.62v201.07c0,23.44-5.34,45.65-14.86,65.49-52.69,109.74-211.18,109.74-263.88,0-9.53-19.84-14.87-42.05-14.87-65.49v-201.07c0-14.97,12.12-27.12,27.1-27.12.47,0,27.12.12,27.12,27.04v201.15c0,13.03,2.57,25.48,7.23,36.86,30.88,75.43,139.84,75.43,170.72,0,4.66-11.38,7.22-23.82,7.22-36.86v-201.15c0-26.92,26.65-27.04,27.12-27.04,14.97,0,27.1,12.14,27.1,27.12Z" />
      <path d="M1708.33,281.28v201.08c0,2.1-.24,4.13-.69,6.09-2.77,12.05-13.54,21.03-26.41,21.03-.45,0-24.19-.1-26.86-22.72-.18-1.36-.26-2.79-.26-4.32v-204.68c0-7.49-.84-14.78-2.46-21.79-1.18-5.19-2.77-10.22-4.76-15.05-30.89-75.44-139.86-75.44-170.73,0-4.66,11.38-7.23,23.82-7.23,36.85v204.68c0,26.92-26.65,27.04-27.12,27.04-14.97,0-27.1-12.14-27.1-27.12v-201.08c0-23.42,5.35-45.65,14.88-65.48,52.68-109.75,211.17-109.75,263.87,0,9.53,19.83,14.86,42.05,14.86,65.48Z" />
      <path d="M1368.71,167.85l-118.97,325.05c-3.71,9.96-13.23,16.59-23.88,16.59-.45,0-.9-.02-1.36-.04h-.14c-.45.02-.9.04-1.36.04-10.63,0-20.16-6.62-23.88-16.59l-118.95-325.05c-6.21-16.64,6.11-34.35,23.88-34.35,5.31,0,10.36,1.65,14.54,4.56,4.17,2.89,7.47,7.03,9.33,12.03l96.51,259.2,96.51-259.2c1.87-4.99,5.17-9.14,9.33-12.03,4.19-2.91,9.24-4.56,14.54-4.56,17.76,0,30.07,17.71,23.88,34.35Z" />
    </g>
  </svg>
);

// ─── HELPERS ───
const formatDate = (d) => {
  const date = new Date(d + "T12:00:00");
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};
const shortDate = (d) => {
  const date = new Date(d + "T12:00:00");
  const days = ["D", "L", "M", "X", "J", "V", "S"];
  return { day: days[date.getDay()], num: date.getDate() };
};
const getDateStr = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};
const shiftDate = (dateStr, days) => {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const getWeekDates = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  const dayOfWeek = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd.toISOString().split("T")[0];
  });
};
const daysUntil = (deadline) => {
  if (!deadline) return 0;
  const now = new Date();
  const dl = new Date(deadline + "T23:59:59");
  return Math.max(0, Math.ceil((dl - now) / (1000 * 60 * 60 * 24)));
};
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
};

const categoryMeta = {
  meeting: { label: "Junta", icon: Users, color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  creative: { label: "Creativo", icon: Palette, color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  admin: { label: "Admin", icon: Briefcase, color: "#06B6D4", bg: "rgba(6,182,212,0.15)" },
  personal: { label: "Personal", icon: Coffee, color: "#10B981", bg: "rgba(16,185,129,0.15)" },
};
const recurringLabels = {
  none: { label: "No repetir", icon: null },
  daily: { label: "Diaria", icon: "🔄" },
  weekly: { label: "Semanal", icon: "📅" },
  monthly: { label: "Mensual", icon: "🗓️" },
};

export default function RuvaApp({ userEmail, userId }) {
  const D = useRuvaData(userId);
  const { data, loading } = D;

  const [activeTab, setActiveTab] = useState("agenda");
  const [selectedDate, setSelectedDate] = useState(getDateStr(0));
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [agendaView, setAgendaView] = useState("day");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showReschedule, setShowReschedule] = useState(null);
  const [showConvertInbox, setShowConvertInbox] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [quickInboxOpen, setQuickInboxOpen] = useState(false);
  const [quickInput, setQuickInput] = useState("");

  const [newTask, setNewTask] = useState({ title: "", time: "09:00", duration: 30, category: "creative", projectId: null, recurring: "none", subtasks: [] });
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [newProject, setNewProject] = useState({ name: "", deadline: getDateStr(7), color: "#3B82F6" });
  const [newNote, setNewNote] = useState({ title: "", content: "", folderId: null });
  const [newFolder, setNewFolder] = useState({ name: "", icon: "📁", color: "#3B82F6" });

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setQuickInboxOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") { e.preventDefault(); setQuickInboxOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") { e.preventDefault(); setShowAddTask(true); }
      if (e.key === "Escape") {
        setShowAddTask(false); setShowAddProject(false); setShowAddNote(false);
        setShowAddFolder(false); setQuickInboxOpen(false); setEditingNote(null);
        setShowReschedule(null); setShowConvertInbox(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // ─── Wrapped actions ───
  const handleToggleTask = async (id) => {
    const t = data.tasks.find((x) => x.id === id);
    if (!t) return;
    await D.toggleTask(id);
    if (!t.done) {
      if (t.recurring && t.recurring !== "none") notify(`+25 pts ⚡ Siguiente instancia creada`);
      else notify("+25 pts ⚡ ¡Sigue así!");
    }
  };
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await D.addTask({ ...newTask, date: selectedDate });
    setNewTask({ title: "", time: "09:00", duration: 30, category: "creative", projectId: null, recurring: "none", subtasks: [] });
    setShowAddTask(false);
    notify("Tarea agregada");
  };
  const handleDeleteTask = async (id) => { await D.deleteTask(id); notify("Tarea eliminada", "info"); };
  const handleReschedule = async (id, date) => { await D.rescheduleTask(id, date); setShowReschedule(null); notify(`Movida a ${formatDate(date)}`); };
  const handleMoveDays = async (id, days) => {
    const t = data.tasks.find((x) => x.id === id);
    if (!t) return;
    await D.rescheduleTask(id, shiftDate(t.date, days));
    notify(days > 0 ? "Movida al día siguiente →" : "← Movida al día anterior");
  };
  const handleAddInbox = async (text) => { await D.addToInbox(text); notify("Capturado en inbox ⚡"); };
  const handleConvertTask = async (item, td) => { await D.convertInboxToTask(item, td); setShowConvertInbox(null); notify("Convertido a tarea ✓"); };
  const handleConvertNote = async (item) => { await D.convertInboxToNote(item); notify("Convertido a nota 📝"); };
  const handleAddProject = async () => {
    if (!newProject.name.trim()) return;
    await D.addProject(newProject);
    setNewProject({ name: "", deadline: getDateStr(7), color: "#3B82F6" });
    setShowAddProject(false);
    notify("Proyecto creado");
  };
  const handleDeleteProject = async (id) => { await D.deleteProject(id); notify("Proyecto eliminado", "info"); };
  const handleAddNote = async () => {
    if (!newNote.title.trim()) return;
    await D.addNote(newNote);
    setNewNote({ title: "", content: "", folderId: newNote.folderId });
    setShowAddNote(false);
    notify("Nota guardada");
  };
  const handleDeleteNote = async (id) => { await D.deleteNote(id); notify("Nota eliminada", "info"); };
  const handleAddFolder = async () => {
    if (!newFolder.name.trim()) return;
    await D.addFolder(newFolder);
    setNewFolder({ name: "", icon: "📁", color: "#3B82F6" });
    setShowAddFolder(false);
    notify("Carpeta creada");
  };
  const handleDeleteFolder = async (id) => {
    await D.deleteFolder(id);
    if (selectedFolder === id) setSelectedFolder("all");
    notify("Carpeta eliminada", "info");
  };

  // ─── DERIVED ───
  const todayTasks = data.tasks.filter((t) => t.date === selectedDate).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const completedToday = todayTasks.filter((t) => t.done).length;
  const totalToday = todayTasks.length;
  const completionPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const totalMinutesToday = todayTasks.reduce((s, t) => s + (t.duration || 0), 0);
  const remainingMinutes = todayTasks.filter((t) => !t.done).reduce((s, t) => s + (t.duration || 0), 0);

  const filteredNotes = selectedFolder === "all" ? data.notes
    : selectedFolder === "uncategorized" ? data.notes.filter((n) => !n.folderId)
    : data.notes.filter((n) => n.folderId === selectedFolder);
  const sortedNotes = [...filteredNotes].sort((a, b) => (a.pinned && !b.pinned) ? -1 : (!a.pinned && b.pinned) ? 1 : 0);

  const weekDates = getWeekDates(selectedDate);
  const levelProgress = ((data.score.total % 200) / 200) * 100;

  // ─── STYLES ───
  const styles = {
    app: { minHeight: "100vh", background: "linear-gradient(180deg, #0A0E1A 0%, #0F1629 50%, #0A0E1A 100%)", color: "#E2E8F0", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif", margin: 0, display: "flex" },
    sidebar: { width: 240, background: "rgba(10,14,26,0.8)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", gap: 4 },
    sidebarLogo: { padding: "8px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 },
    sidebarNavItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: active ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))" : "transparent", color: active ? "#60A5FA" : "#94A3B8", cursor: "pointer", border: active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent", fontSize: 14, fontWeight: active ? 600 : 500, justifyContent: "space-between" }),
    mainContent: { flex: 1, maxWidth: isDesktop ? "none" : 480, margin: isDesktop ? "0" : "0 auto", width: "100%", minHeight: "100vh" },
    innerContent: { maxWidth: isDesktop ? 900 : "none", margin: "0 auto", padding: isDesktop ? "32px 40px 40px" : "0" },
    header: { padding: isDesktop ? "0 0 24px" : "20px 20px 12px", background: isDesktop ? "none" : "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, transparent 100%)", display: isDesktop ? "flex" : "block", justifyContent: isDesktop ? "space-between" : "initial", alignItems: isDesktop ? "center" : "initial" },
    greeting: { fontSize: 13, color: "#64748B", marginBottom: 2, letterSpacing: "0.5px", textTransform: "uppercase" },
    name: { fontSize: isDesktop ? 24 : 28, fontWeight: 700, background: "linear-gradient(135deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: isDesktop ? 0 : 16 },
    statsRow: { display: "flex", gap: 10, marginBottom: 8 },
    statCard: { flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.06)" },
    statValue: { fontSize: 22, fontWeight: 700, color: "#F1F5F9" },
    statLabel: { fontSize: 11, color: "#64748B", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.3px" },
    dateNav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: isDesktop ? "0 0 16px" : "8px 20px 12px", gap: 12 },
    dateBtn: { background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: "#94A3B8", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
    dateLabel: { fontSize: 16, fontWeight: 600, color: "#E2E8F0" },
    todayBtn: { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, color: "#60A5FA", padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    section: { padding: isDesktop ? 0 : "0 20px" },
    taskCard: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)" },
    taskMain: { display: "flex", alignItems: "flex-start", gap: 12 },
    checkbox: (done) => ({ width: 24, height: 24, borderRadius: 8, border: done ? "none" : "2px solid rgba(255,255,255,0.2)", background: done ? "linear-gradient(135deg, #3B82F6, #818CF8)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2 }),
    taskTitle: (done) => ({ fontSize: 15, fontWeight: 500, color: done ? "#475569" : "#E2E8F0", textDecoration: done ? "line-through" : "none", marginBottom: 6, lineHeight: 1.3 }),
    taskMeta: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
    badge: (bg, color) => ({ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: bg, color: color, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }),
    timeBadge: { fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 4 },
    fab: { position: "fixed", bottom: isDesktop ? 30 : 90, right: isDesktop ? 30 : 20, width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #3B82F6, #6366F1)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 32px rgba(59,130,246,0.4)", zIndex: 50 },
    fabInbox: { position: "fixed", bottom: isDesktop ? 100 : 160, right: isDesktop ? 30 : 20, width: 48, height: 48, borderRadius: 14, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", color: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 50, backdropFilter: "blur(10px)" },
    bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(10,14,26,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "8px 0 env(safe-area-inset-bottom, 12px)", zIndex: 100 },
    navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0", background: "none", border: "none", color: active ? "#60A5FA" : "#475569", cursor: "pointer", fontSize: 10, fontWeight: active ? 600 : 400, position: "relative" }),
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent: "center", padding: isDesktop ? 20 : 0 },
    modalContent: { background: "linear-gradient(180deg, #1A1F35 0%, #141828 100%)", borderRadius: isDesktop ? 20 : "24px 24px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 500, maxHeight: "85vh", overflowY: "auto", border: "1px solid rgba(255,255,255,0.08)" },
    input: { width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#E2E8F0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    textarea: { width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#E2E8F0", fontSize: 15, outline: "none", minHeight: 120, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5 },
    primaryBtn: { width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "white", fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 16, fontFamily: "inherit" },
    categorySelector: { display: "flex", gap: 8, flexWrap: "wrap" },
    catOption: (selected) => ({ padding: "10px 14px", borderRadius: 10, border: selected ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.1)", background: selected ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", color: "#E2E8F0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: selected ? 600 : 400 }),
    projectCard: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "18px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" },
    progressBar: { height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", marginTop: 12, position: "relative", overflow: "hidden" },
    progressFill: (pct, color) => ({ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}88)`, transition: "width 0.5s ease" }),
    noteCard: { background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" },
    notification: (type) => ({ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", borderRadius: 14, background: type === "success" ? "linear-gradient(135deg, #3B82F6, #6366F1)" : "rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", animation: "slideDown 0.3s ease" }),
    actionBtn: { background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" },
    emptyState: { textAlign: "center", padding: "48px 20px", color: "#475569" },
    folderChip: (selected, color) => ({ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: selected ? `${color}20` : "rgba(255,255,255,0.04)", border: selected ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.06)", color: selected ? color : "#94A3B8", fontSize: 13, fontWeight: selected ? 600 : 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }),
    inboxItem: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 14, marginBottom: 8 },
    subtaskRow: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0" },
    subtaskCheckbox: (done) => ({ width: 18, height: 18, borderRadius: 6, border: done ? "none" : "1.5px solid rgba(255,255,255,0.25)", background: done ? "linear-gradient(135deg, #3B82F6, #818CF8)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }),
    weekGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 },
    weekDayCol: (isToday, isSelected) => ({ background: isSelected ? "rgba(59,130,246,0.1)" : isToday ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.02)", border: isSelected ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 6px", minHeight: 200, cursor: "pointer" }),
    weekDayHeader: (isToday) => ({ textAlign: "center", fontSize: 11, color: isToday ? "#60A5FA" : "#64748B", fontWeight: isToday ? 700 : 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }),
    weekDayNum: (isToday) => ({ fontSize: 18, color: isToday ? "#60A5FA" : "#E2E8F0", fontWeight: 700, textAlign: "center", marginBottom: 6 }),
    miniTask: (done, catColor) => ({ fontSize: 10, padding: "4px 6px", borderRadius: 5, background: `${catColor}15`, color: done ? "#475569" : "#CBD5E1", marginBottom: 4, borderLeft: `2px solid ${catColor}`, textDecoration: done ? "line-through" : "none", lineHeight: 1.3, cursor: "pointer" }),
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0E1A" }}>
        <div style={{ textAlign: "center" }}>
          <RuvaLogo size={60} />
          <div style={{ color: "#64748B", fontSize: 13, marginTop: 12, letterSpacing: 2 }}>CARGANDO...</div>
        </div>
      </div>
    );
  }

  const renderTaskCard = (task) => {
    const cat = categoryMeta[task.category] || categoryMeta.personal;
    const CatIcon = cat.icon;
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const subtasksDone = hasSubtasks ? task.subtasks.filter((s) => s.done).length : 0;
    const isExpanded = expandedTaskId === task.id;
    const isRecurring = task.recurring && task.recurring !== "none";

    return (
      <div key={task.id} style={styles.taskCard}>
        <div style={styles.taskMain}>
          <div style={styles.checkbox(task.done)} onClick={() => handleToggleTask(task.id)}>
            {task.done && <Check size={14} color="white" strokeWidth={3} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.taskTitle(task.done)}>
              {task.title}
              {isRecurring && <span style={{ marginLeft: 6, fontSize: 11 }}>{recurringLabels[task.recurring].icon}</span>}
            </div>
            <div style={styles.taskMeta}>
              <span style={styles.timeBadge}><Clock size={12} />{task.time} · {task.duration}min</span>
              <span style={styles.badge(cat.bg, cat.color)}><CatIcon size={10} />{cat.label}</span>
              {hasSubtasks && (
                <span style={styles.badge("rgba(59,130,246,0.15)", "#60A5FA")} onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}>
                  <ListChecks size={10} />{subtasksDone}/{task.subtasks.length}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {hasSubtasks && (
              <button style={styles.actionBtn} onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            <button style={styles.actionBtn} onClick={() => handleMoveDays(task.id, -1)}><ArrowLeft size={14} /></button>
            <button style={styles.actionBtn} onClick={() => handleMoveDays(task.id, 1)}><ArrowRight size={14} /></button>
            <button style={styles.actionBtn} onClick={() => setShowReschedule(task)}><CalendarDays size={14} /></button>
            <button style={styles.actionBtn} onClick={() => handleDeleteTask(task.id)}><Trash2 size={14} /></button>
          </div>
        </div>
        {isExpanded && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingLeft: 36 }}>
            {task.subtasks.map((s) => (
              <div key={s.id} style={styles.subtaskRow}>
                <div style={styles.subtaskCheckbox(s.done)} onClick={() => D.toggleSubtask(task.id, s.id)}>
                  {s.done && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: s.done ? "#475569" : "#CBD5E1", textDecoration: s.done ? "line-through" : "none" }}>{s.text}</div>
                <button style={{ ...styles.actionBtn, width: 24, height: 24 }} onClick={() => D.deleteSubtask(task.id, s.id)}><X size={12} /></button>
              </div>
            ))}
            <input
              style={{ ...styles.input, padding: "8px 12px", fontSize: 13, marginTop: 8 }}
              placeholder="+ Agregar subtarea..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  D.addSubtaskToTask(task.id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderAgendaDay = () => (
    <>
      <div style={styles.dateNav}>
        <button style={styles.dateBtn} onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}><ChevronLeft size={18} /></button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={styles.dateLabel}>{formatDate(selectedDate)}</div>
          {selectedDate === getDateStr(0) ? (
            <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 600, marginTop: 2 }}>HOY</div>
          ) : (
            <button style={{ ...styles.todayBtn, marginTop: 4 }} onClick={() => setSelectedDate(getDateStr(0))}>
              <Home size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />Ir a hoy
            </button>
          )}
        </div>
        <button style={styles.dateBtn} onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}><ChevronRight size={18} /></button>
      </div>
      {isDesktop && (
        <div style={{ ...styles.section, marginBottom: 16 }}>
          <input type="date" style={styles.input} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>
      )}
      <div style={{ ...styles.section, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>{completedToday}/{totalToday} completadas</span>
          <span style={{ fontSize: 13, color: "#60A5FA", fontWeight: 600 }}>{completionPct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completionPct}%`, borderRadius: 3, background: completionPct === 100 ? "linear-gradient(90deg, #10B981, #34D399)" : "linear-gradient(90deg, #3B82F6, #818CF8)", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
          {remainingMinutes > 0 ? `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m restantes` : totalToday > 0 ? "🎉 ¡Todo completado!" : "Sin tareas programadas"}
        </div>
      </div>
      <div style={styles.section}>
        {todayTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <Calendar size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Sin tareas para este día</div>
            <div style={{ fontSize: 13 }}>Toca + para agregar una actividad</div>
          </div>
        ) : todayTasks.map(renderTaskCard)}
      </div>
      <div style={{ height: isDesktop ? 40 : 160 }} />
    </>
  );

  const renderAgendaWeek = () => {
    const todayStr = getDateStr(0);
    return (
      <>
        <div style={styles.dateNav}>
          <button style={styles.dateBtn} onClick={() => setSelectedDate(shiftDate(selectedDate, -7))}><ChevronLeft size={18} /></button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={styles.dateLabel}>Semana del {formatDate(weekDates[0])}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>al {formatDate(weekDates[6])}</div>
          </div>
          <button style={styles.dateBtn} onClick={() => setSelectedDate(shiftDate(selectedDate, 7))}><ChevronRight size={18} /></button>
        </div>
        <div style={{ ...styles.section, marginBottom: 24 }}>
          <div style={styles.weekGrid}>
            {weekDates.map((d) => {
              const dTasks = data.tasks.filter((t) => t.date === d).sort((a, b) => (a.time || "").localeCompare(b.time || ""));
              const { day, num } = shortDate(d);
              const isToday = d === todayStr;
              const isSelected = d === selectedDate;
              return (
                <div key={d} style={styles.weekDayCol(isToday, isSelected)} onClick={() => { setSelectedDate(d); setAgendaView("day"); }}>
                  <div style={styles.weekDayHeader(isToday)}>{day}</div>
                  <div style={styles.weekDayNum(isToday)}>{num}</div>
                  {dTasks.length === 0 && <div style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>—</div>}
                  {dTasks.slice(0, 6).map((t) => {
                    const cat = categoryMeta[t.category] || categoryMeta.personal;
                    return (
                      <div key={t.id} style={styles.miniTask(t.done, cat.color)} title={t.title}>
                        {t.time} {t.title.length > 14 ? t.title.substring(0, 14) + "..." : t.title}
                      </div>
                    );
                  })}
                  {dTasks.length > 6 && <div style={{ fontSize: 10, color: "#64748B", textAlign: "center", marginTop: 4 }}>+{dTasks.length - 6}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ height: isDesktop ? 40 : 160 }} />
      </>
    );
  };

  const renderAgenda = () => (
    <div>
      <div style={{ ...styles.section, marginBottom: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button style={{ ...styles.catOption(agendaView === "day"), display: "flex", alignItems: "center", gap: 6 }} onClick={() => setAgendaView("day")}>
          <Rows3 size={14} /> Día
        </button>
        <button style={{ ...styles.catOption(agendaView === "week"), display: "flex", alignItems: "center", gap: 6 }} onClick={() => setAgendaView("week")}>
          <Grid3x3 size={14} /> Semana
        </button>
      </div>
      {agendaView === "day" ? renderAgendaDay() : renderAgendaWeek()}
    </div>
  );

  const renderInbox = () => (
    <div style={styles.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "8px 0" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Inbox size={20} color="#FBBF24" /> Inbox
          </h2>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Captura ideas sin organizar. Decide después.</div>
        </div>
        <span style={{ fontSize: 13, color: "#FBBF24", fontWeight: 600 }}>{data.inbox.length}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input
          style={{ ...styles.input, borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)" }}
          placeholder="¿Qué tienes en mente? Enter para capturar..."
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && quickInput.trim()) { handleAddInbox(quickInput); setQuickInput(""); }
          }}
        />
      </div>
      {data.inbox.length === 0 ? (
        <div style={styles.emptyState}>
          <Inbox size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Inbox vacío ✨</div>
          <div style={{ fontSize: 13 }}>Captura cualquier idea sin decidir dónde va.</div>
        </div>
      ) : (
        data.inbox.map((item) => (
          <div key={item.id} style={styles.inboxItem}>
            <div style={{ flex: 1, fontSize: 14, color: "#E2E8F0" }}>{item.text}</div>
            <button style={{ ...styles.actionBtn, color: "#60A5FA" }} onClick={() => setShowConvertInbox(item)}><Calendar size={14} /></button>
            <button style={{ ...styles.actionBtn, color: "#F59E0B" }} onClick={() => handleConvertNote(item)}><FileText size={14} /></button>
            <button style={styles.actionBtn} onClick={() => D.deleteInboxItem(item.id)}><Trash2 size={14} /></button>
          </div>
        ))
      )}
      <div style={{ height: isDesktop ? 40 : 160 }} />
    </div>
  );

  const renderProjects = () => (
    <div style={styles.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "8px 0" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Mis Proyectos</h2>
        <span style={{ fontSize: 13, color: "#64748B" }}>{data.projects.length} activos</span>
      </div>
      <div style={isDesktop ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } : {}}>
        {data.projects.map((project) => {
          const pct = project.tasks > 0 ? Math.round((project.completed / project.tasks) * 100) : 0;
          const days = daysUntil(project.deadline);
          const urgent = days <= 3;
          return (
            <div key={project.id} style={styles.projectCard}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: project.color, borderRadius: "4px 0 0 4px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{project.name}</div>
                  <div style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
                    <Target size={13} />{project.completed}/{project.tasks} tareas
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: urgent ? "#EF4444" : "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                    {urgent && <AlertCircle size={13} />}{days}d restantes
                  </div>
                  <button style={{ ...styles.actionBtn, marginTop: 4, marginLeft: "auto" }} onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={styles.progressBar}><div style={styles.progressFill(pct, project.color)} /></div>
              <div style={{ fontSize: 12, color: project.color, fontWeight: 600, marginTop: 6 }}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: isDesktop ? 40 : 160 }} />
    </div>
  );

  const renderNotes = () => (
    <div style={styles.section}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "8px 0" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Notas Rápidas</h2>
        <button style={{ ...styles.actionBtn, width: "auto", padding: "6px 10px", gap: 6, fontSize: 12, color: "#60A5FA" }} onClick={() => setShowAddFolder(true)}>
          <FolderPlus size={14} /> Carpeta
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 8, flexWrap: isDesktop ? "wrap" : "nowrap" }}>
        <div style={styles.folderChip(selectedFolder === "all", "#60A5FA")} onClick={() => setSelectedFolder("all")}>
          <FileText size={14} /> Todas ({data.notes.length})
        </div>
        {data.folders.map((folder) => {
          const count = data.notes.filter((n) => n.folderId === folder.id).length;
          return (
            <div key={folder.id} style={styles.folderChip(selectedFolder === folder.id, folder.color)} onClick={() => setSelectedFolder(folder.id)}>
              <span>{folder.icon}</span>{folder.name} ({count})
              {selectedFolder === folder.id && (
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, marginLeft: 6 }} onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}>
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
        <div style={styles.folderChip(selectedFolder === "uncategorized", "#64748B")} onClick={() => setSelectedFolder("uncategorized")}>
          <Folder size={14} /> Sin carpeta ({data.notes.filter((n) => !n.folderId).length})
        </div>
      </div>
      <div style={isDesktop ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } : {}}>
        {sortedNotes.map((note) => {
          const folder = data.folders.find((f) => f.id === note.folderId);
          return (
            <div key={note.id} style={styles.noteCard} onClick={() => setEditingNote(note)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>
                  {note.pinned && <Star size={13} style={{ color: "#F59E0B", marginRight: 6, verticalAlign: "middle" }} fill="#F59E0B" />}
                  {note.title}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button style={styles.actionBtn} onClick={(e) => { e.stopPropagation(); D.togglePinNote(note.id); }}>
                    <Star size={13} fill={note.pinned ? "#F59E0B" : "none"} color={note.pinned ? "#F59E0B" : "#64748B"} />
                  </button>
                  <button style={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, marginBottom: 8 }}>
                {(note.content || "").length > 120 ? note.content.substring(0, 120) + "..." : (note.content || "")}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#475569" }}>{note.date ? formatDate(note.date) : ""}</div>
                {folder && (
                  <div style={{ fontSize: 11, color: folder.color, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                    <span>{folder.icon}</span>{folder.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {sortedNotes.length === 0 && (
        <div style={styles.emptyState}>
          <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Sin notas en esta carpeta</div>
          <div style={{ fontSize: 13 }}>Captura ideas rápidas con +</div>
        </div>
      )}
      <div style={{ height: isDesktop ? 40 : 160 }} />
    </div>
  );

  const renderScore = () => (
    <div style={styles.section}>
      <div style={{ textAlign: "center", padding: "24px 0 32px" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(#3B82F6 ${levelProgress * 3.6}deg, rgba(255,255,255,0.06) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#0F1629", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {data.score.level}
            </div>
  