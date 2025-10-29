import './Dashboard.css';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Payments',
      value: '1,234',
      icon: '💳',
      color: '#667eea',
      change: '+12%'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      icon: '💰',
      color: '#48bb78',
      change: '+8%'
    },
    {
      title: 'Active Students',
      value: '567',
      icon: '👥',
      color: '#ed8936',
      change: '+5%'
    },
    {
      title: 'Pending Payments',
      value: '23',
      icon: '⏳',
      color: '#f56565',
      change: '-3%'
    }
  ];

  const recentPayments = [
    { id: 1, studentName: 'John Doe', amount: '$500', date: '2024-01-15', status: 'Completed' },
    { id: 2, studentName: 'Jane Smith', amount: '$750', date: '2024-01-14', status: 'Completed' },
    { id: 3, studentName: 'Bob Johnson', amount: '$300', date: '2024-01-13', status: 'Pending' },
    { id: 4, studentName: 'Alice Brown', amount: '$600', date: '2024-01-12', status: 'Completed' },
    { id: 5, studentName: 'Charlie Wilson', amount: '$450', date: '2024-01-11', status: 'Completed' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to Admin Panel</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change" style={{ color: stat.change.startsWith('+') ? '#48bb78' : '#f56565' }}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Payments</h2>
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.studentName}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

