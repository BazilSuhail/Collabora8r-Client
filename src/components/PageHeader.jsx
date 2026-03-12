import { motion } from 'framer-motion'

const PageHeader = ({ icon, title, subtitle, highlight, action, gradient = 'from-orange-600 to-orange-700' }) => {
  const Icon = icon
  return (
    <header className="relative p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] shadow-sm overflow-hidden mb-6 group">
      <div className="absolute top-0 right-0 w-56 h-56 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-orange-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          {Icon && (
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
              <Icon size={24} className="md:text-2xl" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
              {highlight && <span className="text-orange-600"> {highlight}</span>}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
