import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar.css'; // Optional custom styles
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Setting from '../components/Setting';

const mockPayments = [
  { id: 1, title: 'Netflix', amount: 499, frequency: 'Monthly', nextDue: '2025-05-20' },
  { id: 2, title: 'Gym', amount: 999, frequency: 'Monthly', nextDue: '2025-05-25' },
  { id: 3, title: 'Cred', amount: 2000, frequency: 'Monthly', nextDue: '2025-05-25' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [activePage, setActivePage] = useState('home');
  const [customEvents, setCustomEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date() });
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  const totalDue = payments.reduce((sum, p) => sum + p.amount, 0);
  const nextPayment = payments.length
    ? payments.reduce((next, p) =>
        new Date(p.nextDue) < new Date(next.nextDue) ? p : next,
        payments[0]
      )
    : null;

  const handleDelete = (id) => {
    if (confirm('Are you sure to delete this payment?')) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const dueDatesMap = payments.reduce((acc, payment) => {
    const key = new Date(payment.nextDue).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...payment, type: 'payment' });
    return acc;
  }, {});

  const customEventsMap = customEvents.reduce((acc, ev) => {
    const key = new Date(ev.date).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...ev, type: 'event' });
    return acc;
  }, {});

  const mergedEventsMap = { ...dueDatesMap };
  for (const key in customEventsMap) {
    if (!mergedEventsMap[key]) mergedEventsMap[key] = [];
    mergedEventsMap[key] = [...(mergedEventsMap[key] || []), ...customEventsMap[key]];
  }

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    setCustomEvents((prev) => [...prev, newEvent]);
    setNewEvent({ title: '', date: new Date() });
    setShowAddEventForm(false);
  };

  const barData = payments.map((p) => ({ name: p.title, amount: p.amount }));

  return (
    <div className="bg-gray-900 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 p-6 shadow-md bg-gray-800">
          <nav className="space-y-2">
            {['home', 'payments', 'reports', 'settings'].map((key) => (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className={`block w-full text-left px-4 py-2 rounded transition hover:bg-blue-100 ${
                  activePage === key ? 'bg-blue-200 font-semibold' : ''
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </nav>
          <div className="mt-10">
            <button
              onClick={logout}
              className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p>{new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</p>
          </header>

          {activePage === 'home' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded shadow"><p>Total Due</p><h2 className="text-2xl font-bold">₹ {totalDue}</h2></div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded shadow"><p>Next Payment</p><h2>{nextPayment ? `${nextPayment.title} on ${new Date(nextPayment.nextDue).toLocaleDateString('en-IN')}` : 'None'}</h2></div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded shadow"><p>Subscriptions</p><h2>{payments.length}</h2></div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded shadow"><p>Today</p><h2>{calendarValue.toDateString()}</h2></div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}><XAxis dataKey="name" stroke={'#fff'} /><YAxis stroke={'#fff'} /><Tooltip /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={barData} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {barData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Calendar</h2>
                  <button
                    onClick={() => setShowAddEventForm(true)}
                    className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                  >
                    + Add Event
                  </button>
                </div>
                <Calendar
                  value={calendarValue}
                  onChange={setCalendarValue}
                  className="rounded border-none"
                  tileContent={({ date }) => {
                    const key = date.toDateString();
                    const hasDue = dueDatesMap[key];
                    const hasEvent = customEventsMap[key];
                    if (hasDue || hasEvent) {
                      return (
                        <div className="flex justify-center mt-1 space-x-1">
                          {hasDue && <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />}
                          {hasEvent && <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {mergedEventsMap[calendarValue.toDateString()] && (
                  <div className="mt-4 bg-gray-800 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-2">Items on {calendarValue.toDateString()}</h3>
                    <ul className="space-y-2">
                      {mergedEventsMap[calendarValue.toDateString()].map((item, i) => (
                        <li key={i} className="flex justify-between border-b border-gray-600 pb-1">
                          <span>{item.title}</span>
                          <span className="text-sm text-gray-300">{item.amount ? `₹ ${item.amount}` : 'Event'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add Event Form */}
                {showAddEventForm && (
                  <div className="mt-4 p-4 bg-gray-700 rounded">
                    <h3 className="text-md font-semibold mb-2">Add Event</h3>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title"
                      className="w-full p-2 mb-2 text-black rounded"
                    />
                    <input
                      type="date"
                      value={new Date(newEvent.date).toISOString().split('T')[0]}
                      onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                      className="w-full p-2 mb-2 text-black rounded"
                    />
                    <div className="flex space-x-2">
                      <button onClick={handleAddEvent} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Add</button>
                      <button onClick={() => setShowAddEventForm(false)} className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {activePage === 'payments' && (
            <div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">All Payments</h2>
                <button onClick={() => navigate('/add')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Payment</button>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="py-2 text-left">Title</th><th>Amount</th><th>Next Due</th><th>Actions</th></tr></thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-gray-400">No payments scheduled.</td></tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="py-2">{p.title}</td>
                        <td>₹ {p.amount}</td>
                        <td>{new Date(p.nextDue).toLocaleDateString('en-IN')}</td>
                        <td className="space-x-2">
                          <button onClick={() => navigate(`/edit/${p.id}`)} className="text-blue-600 hover:underline cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activePage === 'reports' && (
            <div className="bg-white dark:bg-gray-700 p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Reports</h2>
              <p>Download monthly or yearly reports of your expenses.</p>
              <div className="mt-4 space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Download PDF</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Download CSV</button>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
              <Setting />
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
