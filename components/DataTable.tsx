'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DataTableProps {
  onLoad?: () => void;
}

interface TableRow {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: 'active' | 'inactive' | 'pending';
}

export default function DataTable({ onLoad }: DataTableProps) {
  const [data, setData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof TableRow>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const departments = ['IT', 'Marketing', 'Shitje', 'HR', 'Financë'];
  const names = ['Ledjan', 'Jona', 'Arben', 'Elona', 'Genti', 'Manjola', 'Albi', 'Drita'];

  useEffect(() => {
    // Simulate heavy data loading
    const timer = setTimeout(() => {
      /**
       * Generates an array of 100 `TableRow` objects with zed data for use in a data table.
       *
       * - `id`: Sequential identifier starting from 1.
       * - `name`: y selected from the `names` array if available, otherwise an empty string.
       * - `email`: Generated in the format `user{id}@euroweb.al`.
       * - `department`: y selected from the `departments` array if available, otherwise an empty string.
       * - `salary`:  integer between 30,000 and 79,999.
       * - `status`: y assigned as either `'active'`, `'inactive'`, or `'pending'`.
       *
       * @remarks
       * Useful for populating  data in development or testing environments.
       */
      const tableData: TableRow[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: names.length > 0 ? names[Math.floor(Math.random() * names.length)] : '',
        email: `user${i + 1}@euroweb.al`,
        department: departments.length > 0 ? departments[Math.floor(Math.random() * departments.length)] : '',
        salary: Math.floor(Math.random() * 50000) + 30000,
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
      }));
      setData(tableData);
      setIsLoading(false);
      onLoad?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoad]);

  const handleSort = (field: keyof TableRow) => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(row => 
    filterStatus === 'all' || row.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'inactive': return 'Joaktiv';
      case 'pending': return 'Në pritje';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Duke ngarkuar të dhënat e tabelës...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-800">
            📋 Tabela e Punonjësve ({filteredData.length} rezultate)
          </h3>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Të gjithë</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Joaktiv</option>
              <option value="pending">Në pritje</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Emri' },
                { key: 'email', label: 'Email' },
                { key: 'department', label: 'Departamenti' },
                { key: 'salary', label: 'Paga' },
                { key: 'status', label: 'Statusi' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof TableRow)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortField === key && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.slice(0, 20).map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{row.salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
                    {getStatusLabel(row.status)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > 20 && (
        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Duke shfaqur 20 nga {filteredData.length} rezultatet. Scroll për më shumë...
        </div>
      )}
    </motion.div>
  );
}

