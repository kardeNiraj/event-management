const StatsCard = () => {
  const stats = [
    { title: "Total Events", value: "24" },
    { title: "Registered Users", value: "1,234" },
    { title: "Active Users", value: "892" },
    { title: "Avg Attendance", value: "78%" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold mb-6">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg flex flex-col justify-between">
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
