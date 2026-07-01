export default function StatCard({ icon, title, value, sub, color }: any) {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    red: 'text-red-500 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 flex items-center gap-4 cursor-default">
      <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl border-[3px] border-white shadow-sm ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-black mt-0.5 tracking-tight ${colorMap[color].split(' ')[0]}`}>{value}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}